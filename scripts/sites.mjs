#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (path) => {
  try {
    return JSON.parse(readFileSync(resolve(root, path), 'utf8').replace(/^\uFEFF/, ''));
  } catch {
    throw new Error(`Cannot read valid JSON: ${path}`);
  }
};
const repositoryPath = (path) => {
  if (typeof path !== 'string' || !path || path.startsWith('/')) return null;
  const absolute = resolve(root, path);
  return absolute.startsWith(`${root}${sep}`) ? relative(root, absolute).split(sep).join('/') : null;
};
const overlaps = (left, right) => {
  const a = left.toLowerCase().replace(/\/$/, '');
  const b = right.toLowerCase().replace(/\/$/, '');
  return a === b || a.startsWith(`${b}/`) || b.startsWith(`${a}/`);
};
const moduleFiles = (directory) => readdirSync(resolve(root, directory), { withFileTypes: true })
  .flatMap((entry) => {
    const path = `${directory}/${entry.name}`;
    return entry.isDirectory() ? moduleFiles(path) : entry.isFile() && entry.name.endsWith('.module.json') ? [path] : [];
  });

function check(manifest) {
  const errors = [];
  const warnings = [];
  const config = readJson('xmcloud.build.json');
  const hosts = config.renderingHosts || {};
  const deployedDefinitions = new Set(config.deployItems?.modules || []);
  const ids = new Set();
  const apps = new Map();
  const hostKeys = new Map();
  const declaredModules = new Map();
  const actualModules = new Map();
  const dependencies = new Map(manifest.sharedDependencies.map((item) => [item.id, item]));
  for (const path of moduleFiles('authoring')) {
    const module = readJson(path);
    if (actualModules.has(module.namespace)) errors.push(`Duplicate module namespace: ${module.namespace}`);
    actualModules.set(module.namespace, { path, module });
  }
  for (const module of manifest.modules) {
    if (declaredModules.has(module.namespace)) errors.push(`Duplicate manifest namespace: ${module.namespace}`);
    declaredModules.set(module.namespace, module);
    const actual = actualModules.get(module.namespace);
    if (!actual || actual.path !== module.path) errors.push(`Module namespace/path mismatch: ${module.namespace}`);
    if (actual && module.includeScopes) {
      const declared = module.includeScopes.map((include) => `${include.path.toLowerCase()}|${include.scope?.toLowerCase()}`).sort();
      const current = (actual.module.items?.includes || []).map((include) => `${include.path.toLowerCase()}|${include.scope?.toLowerCase()}`).sort();
      if (JSON.stringify(declared) !== JSON.stringify(current)) errors.push(`Module include scopes differ from manifest: ${module.namespace}`);
    }
    if (module.ownerSite && !manifest.sites.some((site) => site.id === module.ownerSite)) errors.push(`Unknown owner of module: ${module.namespace}`);
  }
  for (const namespace of actualModules.keys()) {
    if (!declaredModules.has(namespace)) errors.push(`Module missing from manifest: ${namespace}`);
  }
  for (const site of manifest.sites) {
    if (ids.has(site.id)) errors.push(`Duplicate site identifier: ${site.id}`);
    ids.add(site.id);
    const app = repositoryPath(site.appPath);
    if (!app || !app.startsWith('industry-verticals/')) errors.push(`Invalid app path for: ${site.id}`);
    else {
      if (apps.has(app)) errors.push(`App path owned by both ${apps.get(app)} and ${site.id}`);
      apps.set(app, site.id);
      if (!existsSync(resolve(root, app, 'package.json'))) errors.push(`App package missing: ${site.id}`);
    }
    const host = site.renderingHost;
    if (host) {
      if (hostKeys.has(host.key)) errors.push(`Host key owned by both ${hostKeys.get(host.key)} and ${site.id}`);
      hostKeys.set(host.key, site.id);
      if (repositoryPath(host.path) !== app) errors.push(`Manifest host/app path mismatch: ${site.id}`);
      if (!hosts[host.key]) errors.push(`Rendering host missing from build config: ${host.key}`);
      else if (repositoryPath(hosts[host.key].path) !== app) errors.push(`Build host path mismatch: ${host.key}`);
    } else {
      const matches = Object.entries(hosts).filter(([, value]) => repositoryPath(value.path) === app);
      if (matches.length) errors.push(`Record configured host key in manifest for: ${site.id}`);
      else warnings.push(`No configured rendering host recorded: ${site.id}`);
    }
    for (const namespace of [...site.definitionModules, ...site.seedModules]) {
      const module = declaredModules.get(namespace);
      if (!module) errors.push(`Unknown module dependency for ${site.id}: ${namespace}`);
      else if (module.ownerSite && module.ownerSite !== site.id) errors.push(`Site ${site.id} references module owned by ${module.ownerSite}: ${namespace}`);
    }
    for (const namespace of site.definitionModules) {
      if (!deployedDefinitions.has(namespace)) errors.push(`Definition module missing from build deployment: ${namespace}`);
    }
    for (const dependency of site.sharedDependencies) {
      if (!dependencies.has(dependency)) errors.push(`Unknown shared dependency for ${site.id}: ${dependency}`);
    }
    if (Object.values(site.bindings).some((binding) => binding.status !== 'verified')) warnings.push(`Remote bindings remain unverified: ${site.id}`);
  }
  for (const [key, host] of Object.entries(hosts)) {
    if (!hostKeys.has(key)) errors.push(`Build host missing from manifest: ${key}`);
    if (!repositoryPath(host.path)) errors.push(`Invalid build host path: ${key}`);
  }
  for (const entry of readdirSync(resolve(root, 'industry-verticals'), { withFileTypes: true })) {
    const path = `industry-verticals/${entry.name}`;
    if (entry.isDirectory() && existsSync(resolve(root, path, 'package.json')) && !apps.has(path)) errors.push(`App head missing from manifest: ${path}`);
  }
  for (const dependency of dependencies.values()) {
    for (const namespace of dependency.moduleNamespaces) {
      const module = declaredModules.get(namespace);
      if (!module) errors.push(`Shared dependency references unknown module: ${namespace}`);
      else if (module.ownerSite) errors.push(`Shared dependency references site-owned module: ${namespace}`);
    }
    for (const contribution of dependency.sourceContributions || []) {
      if (!ids.has(contribution.site)) errors.push(`Unknown contribution site: ${contribution.site}`);
      for (const item of contribution.definitionItems) {
        const path = repositoryPath(item.sourcePath);
        if (!path || !path.startsWith('authoring/') || !path.endsWith('.yml') || !existsSync(resolve(root, path))) {
          errors.push(`Shared source contribution file missing or invalid for: ${contribution.site}`);
          continue;
        }
        const content = readFileSync(resolve(root, path), 'utf8');
        const id = content.match(/^ID:\s*"?([^"\r\n]+)/m)?.[1];
        const nativePath = content.match(/^Path:\s*"?([^"\r\n]+)/m)?.[1];
        if (id?.toLowerCase() !== item.itemId.toLowerCase() || nativePath !== item.nativePath) errors.push(`Shared contribution identity/path mismatch: ${path}`);
      }
      if (contribution.status !== 'native-deployment-verified') warnings.push(`Shared source contribution deployment unverified: ${contribution.site}`);
    }
  }
  const claims = manifest.sites.flatMap((site) => ['sourcePaths', 'nativePaths', 'mediaPaths'].flatMap((kind) =>
    site.ownership[kind].map((path) => ({ site: site.id, kind, path }))));
  for (let i = 0; i < claims.length; i++) {
    for (let j = i + 1; j < claims.length; j++) {
      if (claims[i].site !== claims[j].site && overlaps(claims[i].path, claims[j].path)) errors.push(`Ownership overlap: ${claims[i].site} / ${claims[j].site} at ${claims[i].path}`);
    }
  }
  for (const module of manifest.modules.filter((item) => item.ownerSite)) {
    const actual = actualModules.get(module.namespace);
    if (!actual) continue;
    for (const other of manifest.modules.filter((item) => item.ownerSite && item.ownerSite !== module.ownerSite)) {
      const otherActual = actualModules.get(other.namespace);
      if (!otherActual) continue;
      if ((actual.module.items?.includes || []).some((a) => (otherActual.module.items?.includes || []).some((b) => overlaps(a.path, b.path)))) errors.push(`Site-owned module roots overlap: ${module.namespace} / ${other.namespace}`);
    }
    const owner = manifest.sites.find((site) => site.id === module.ownerSite);
    if (owner && (actual.module.items?.includes || []).some((include) => !(owner.ownership.definitionPaths || owner.ownership.nativePaths).some((path) => include.path.toLowerCase() === path.toLowerCase() || include.path.toLowerCase().startsWith(`${path.toLowerCase().replace(/\/$/, '')}/`)))) errors.push(`Module includes escape declared owner scope: ${module.namespace}`);
  }
  for (const namespace of config.deployItems?.modules || []) {
    if (!declaredModules.has(namespace)) errors.push(`Unknown deployItems module: ${namespace}`);
    else if (declaredModules.get(namespace).kind === 'initial-seed') errors.push(`Initial seed module in ordinary definition deployment: ${namespace}`);
  }
  if ((config.postActions?.actions?.scsModules?.modules || []).length) errors.push('Ordinary build config contains content/media seed post-actions; separate explicit seed/recovery configuration.');
  const output = { status: errors.length ? 'failed' : 'passed', siteCount: manifest.sites.length, errors: [...new Set(errors)], warnings: [...new Set(warnings)] };
  console.log(JSON.stringify(output, null, 2));
  process.exitCode = errors.length ? 1 : 0;
}

function planRemove(manifest, id) {
  const site = manifest.sites.find((item) => item.id === id);
  if (!site) throw new Error('Unknown site identifier. Use list to inspect available identifiers.');
  const retainedShared = site.sharedDependencies.map((key) => manifest.sharedDependencies.find((item) => item.id === key));
  const sharedConsumers = manifest.sites.filter((other) => other.id !== site.id && other.sharedDependencies.some((key) => site.sharedDependencies.includes(key))).map((other) => other.id);
  const ownedModules = manifest.modules.filter((module) => module.ownerSite === site.id).map((module) => module.namespace);
  const sharedContributions = retainedShared.flatMap((dependency) => (dependency.sourceContributions || []).filter((item) => item.site === site.id).map((item) => ({ sourceBranch: item.sourceBranch, sourceCommit: item.sourceCommit, itemCount: item.definitionItems.length, status: item.status, action: 'Inspect exact item paths in the manifest and native references; retain the shared module and other contributions.' })));
  console.log(JSON.stringify({
    mode: 'read-only-plan', site: site.id, remoteStatus: 'not-queried',
    source: { appPath: site.appPath, hostKey: site.renderingHost?.key || null, ownedModules },
    preserve: { sharedDependencies: retainedShared.map(({ sourceContributions, ...dependency }) => dependency), otherConsumers: sharedConsumers, unassignedModules: manifest.modules.filter((module) => !module.ownerSite).map((module) => module.namespace) },
    sharedContributionsToReview: sharedContributions,
    steps: [
      { area: 'inventory-and-recovery', action: 'Confirm exact remote bindings, references, retained authored content and recoverable backups before any retirement operation.' },
      { area: 'source', action: 'Prepare a reviewed change removing only this app path, its manifest entry, its exact host config entry, and proven exclusively owned modules.', paths: site.ownership.sourcePaths },
      { area: 'native-content', action: 'Verify current site ID/path, publication, versions, workflow and inbound references. Source scopes and identity verification do not prove deployment/editing/publication or authorize deletion.', binding: site.bindings.native, declaredNativeScopes: site.ownership.nativePaths, intendedContentRoot: site.ownership.intendedContentRoot || null },
      { area: 'media', action: 'Inventory references and remove only proven site-exclusive media after export; retain shared assets. A CMS Media folder does not prove the actual media-library asset path.', binding: site.bindings.media || null, ownedPaths: site.ownership.mediaPaths },
      { area: 'hosting', action: 'Verify project, editing host, deployments, aliases and DNS. Remove only confirmed site-specific bindings after the source change is ready.', binding: site.bindings.live },
      { area: 'profiles-and-personalization', action: 'Identify this site’s actual scope, decisions, experiments and synthetic records. Retain shared scopes and unrelated profiles.', binding: site.bindings.profiles },
      { area: 'DAM', action: 'If used, verify collection/asset IDs and consumers. Retire only confirmed exclusive resources; retain shared collections, assets and brand configuration.', binding: site.bindings.dam },
      { area: 'verification', action: 'Check surviving heads and shared definitions, publication/search references and remaining aliases; record what was retired and how to restore it.' },
    ],
  }, null, 2));
}

try {
  const manifest = readJson('sites.manifest.json');
  if (manifest.schemaVersion !== 1) throw new Error('Unsupported manifest schema version.');
  const [command, id, ...extra] = process.argv.slice(2);
  if (extra.length || (command !== 'plan-remove' && id)) throw new Error('Usage: node scripts/sites.mjs list | check | plan-remove <site>');
  if (command === 'list') {
    for (const site of manifest.sites) console.log(`${site.id}\t${site.appPath}\t${site.renderingHost?.key || '(unconfigured)'}\tnative-identity:${site.bindings.native.status}\tdefinitions:${site.bindings.definitions?.status || 'unverified'}\tlive:${site.bindings.live.status}`);
  } else if (command === 'check') check(manifest);
  else if (command === 'plan-remove' && id) planRemove(manifest, id);
  else throw new Error('Usage: node scripts/sites.mjs list | check | plan-remove <site>');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
