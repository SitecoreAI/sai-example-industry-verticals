#!/usr/bin/env node
/** Deprecated creation helper. This entry point provides read-only guidance only. */
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const usage = `Deprecated editing-host setup helper: read-only guidance.

Use:
  node scripts/sites.mjs list
  node scripts/sites.mjs check
  node scripts/setup-editing-hosts.js --site <site-id>

This script creates no host, runs no CLI/API command, reads no environment
secrets and changes no variables. Host creation must be a separate explicit
command for one verified target authoring environment and one exact host key.
`;
const args = process.argv.slice(2);
if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
  process.stdout.write(usage);
} else if (args.length !== 2 || args[0] !== '--site') {
  process.stderr.write(usage);
  process.exitCode = 1;
} else {
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(resolve(__dirname, '../sites.manifest.json'), 'utf8'));
  } catch {
    console.error('Cannot read the site manifest. No action was taken.');
    process.exitCode = 1;
  }
  if (manifest) {
    const site = manifest.sites.find((entry) => entry.id === args[1]);
    if (!site || !site.renderingHost || !/^[A-Za-z0-9_-]+$/.test(site.renderingHost.key)) {
      console.error('Choose one manifest site with a configured host key. Use scripts/sites.mjs list. No action was taken.');
      process.exitCode = 1;
    } else {
      console.log(JSON.stringify({
        mode: 'read-only-guidance',
        site: site.id,
        hostKey: site.renderingHost.key,
        appPath: site.appPath,
        nativeIdentityStatus: site.bindings.native.status,
        definitionDeploymentStatus: site.bindings.definitions?.status || 'unverified',
        liveBindingStatus: site.bindings.live.status,
        commandsExecuted: [],
        reviewCommands: ['node scripts/sites.mjs check', 'dotnet sitecore cloud editinghost create --help'],
        manualCommandTemplate: `dotnet sitecore cloud editinghost create -n "${site.renderingHost.key}" -cm "<verified-authoring-environment-id>"`,
        prerequisites: [
          'Verify installed CLI help, exact project/authoring environment and existing editing hosts first.',
          'Run a creation command separately only if this exact host is absent and creation is authorized.',
          'Configure branch/repository/app path, private environment values and deployment bindings separately.',
          'A manifest entry or created host does not prove deployment, native editing or publication.'
        ]
      }, null, 2));
    }
  }
}
