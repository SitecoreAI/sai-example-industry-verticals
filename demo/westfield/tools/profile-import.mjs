#!/usr/bin/env node
/**
 * Deliberate developer-only imports of the two synthetic Westfield demo profiles.
 * This script is independent of the frontend and all ordinary build commands.
 *
 * API contract:
 * https://doc.sitecore.com/sai/en/developers/sitecoreai/profile-import/profile-import-api.html
 * JSONL contract:
 * https://doc.sitecore.com/sai/en/developers/sitecoreai/profile-import/batch-file-format.html
 */
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const providerPlaceholder = 'SET_EXISTING_IDENTITY_PROVIDER';
const syntheticProfiles = new Map([
  ['westfield-demo-unenrolled@example.invalid', { firstName: 'Casey', lastName: 'Morgan' }],
  ['westfield-demo-enrolled@example.invalid', { firstName: 'Jordan', lastName: 'Taylor' }],
]);
const files = {
  upload: 'demo-data/policyholders.jsonl',
  reset: 'demo-data/policyholders-reset.jsonl',
};
const help = `Developer-only SitecoreAI profile imports (Node.js 24+, no dependencies).

Commands:
  validate --provider EXISTING_PROVIDER
  upload --provider EXISTING_PROVIDER --endpoint HTTPS_API_ENDPOINT
  reset --provider EXISTING_PROVIDER --endpoint HTTPS_API_ENDPOINT
  status --batch-id UUID --endpoint HTTPS_API_ENDPOINT
  results --batch-id UUID --endpoint HTTPS_API_ENDPOINT [--output PATH]

validate checks both synthetic files and prints checksums; it makes no network request.
upload imports policyholders.jsonl. reset deliberately restores the two baseline
paperless flags from policyholders-reset.jsonl; it does not delete profiles.
Each remote command requires SITECORE_PROFILE_IMPORT_API_KEY in the process
environment. Keep it out of browser/public environment variables and source code.
Pass the API Endpoint from Performance > Settings > Profile import > Credentials
as --endpoint (the base URL, before /v1/batches).
--provider must exactly match an EXISTING native identity rule's identifier provider.
The script substitutes that explicit provider into the JSONL before computing MD5.
Do not create or assume an email identity rule solely to run this script.
Publish the native westfieldPaperlessEnrolled Boolean profile-extension schema before import.
An accepted upload is queued, not verified profile synchronization. Check status,
download results, then verify the two profiles and the native live decisions.
These two files are the only upload inputs; deletion is not supported.

Sources:
https://doc.sitecore.com/sai/en/developers/sitecoreai/profile-import/profile-import-api.html
https://doc.sitecore.com/sai/en/developers/sitecoreai/profile-import/batch-file-format.html
`;

function parseArgs(args) {
  const command = args.shift();
  if (!command || command === '--help' || command === '-h' || command === 'help') {
    if (args.length) throw new Error('Help does not take additional options.');
    return { command: 'help', options: {} };
  }
  const allowed = {
    validate: new Set(['provider']),
    upload: new Set(['provider', 'endpoint']),
    reset: new Set(['provider', 'endpoint']),
    status: new Set(['batch-id', 'endpoint']),
    results: new Set(['batch-id', 'endpoint', 'output']),
  };
  if (!allowed[command]) throw new Error(`Unknown command: ${command}. Use --help.`);
  const options = {};
  while (args.length) {
    const flag = args.shift();
    if (!flag.startsWith('--') || !allowed[command].has(flag.slice(2))) {
      throw new Error(`Unsupported option for ${command}: ${flag}.`);
    }
    const key = flag.slice(2);
    const value = args.shift();
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${flag}.`);
    if (key in options) throw new Error(`Duplicate option: ${flag}.`);
    options[key] = value;
  }
  return { command, options };
}

function requireProvider(options) {
  const provider = options.provider;
  if (!provider || !/^[A-Za-z0-9_]{1,50}$/.test(provider) || provider === providerPlaceholder) {
    throw new Error('Pass --provider with the existing native identity rule provider (1–50 letters, numbers, or underscores).');
  }
  return provider;
}

function hasOnlyKeys(value, keys) {
  return value && typeof value === 'object' && !Array.isArray(value)
    && Object.keys(value).every((key) => keys.includes(key));
}

async function prepareFile(command, provider) {
  const relativePath = files[command];
  const bytes = await readFile(resolve(repoRoot, relativePath));
  const source = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  const lines = source.replace(/\r\n/g, '\n').replace(/\n$/, '').split('\n');
  if (lines.length !== syntheticProfiles.size) throw new Error(`${relativePath}: exactly two synthetic records are required.`);
  const seen = new Set();
  const records = lines.map((line, index) => {
    let record;
    try { record = JSON.parse(line); } catch { throw new Error(`${relativePath}, line ${index + 1}: invalid JSON.`); }
    if (!hasOnlyKeys(record, ['recordType', 'identifiers', 'contact', 'extensions']) || record.recordType !== 'profile') {
      throw new Error(`${relativePath}, line ${index + 1}: expected a profile record envelope.`);
    }
    if (!Array.isArray(record.identifiers) || record.identifiers.length !== 1) {
      throw new Error(`${relativePath}, line ${index + 1}: exactly one synthetic identifier is required.`);
    }
    const identifier = record.identifiers[0];
    if (!hasOnlyKeys(identifier, ['provider', 'id']) || identifier.provider !== providerPlaceholder
      || !syntheticProfiles.has(identifier.id) || seen.has(identifier.id)) {
      throw new Error(`${relativePath}, line ${index + 1}: identifier must be a unique allowlisted synthetic identity with the provider placeholder.`);
    }
    seen.add(identifier.id);
    if (!hasOnlyKeys(record.extensions, ['westfieldPaperlessEnrolled']) || typeof record.extensions.westfieldPaperlessEnrolled !== 'boolean') {
      throw new Error(`${relativePath}, line ${index + 1}: westfieldPaperlessEnrolled must be a Boolean.`);
    }
    if ('contact' in record) {
      const expectedName = syntheticProfiles.get(identifier.id);
      if (!hasOnlyKeys(record.contact, ['firstName', 'lastName', 'email'])
        || record.contact.email !== identifier.id || record.contact.firstName !== expectedName.firstName
        || record.contact.lastName !== expectedName.lastName) {
        throw new Error(`${relativePath}, line ${index + 1}: contact must use the allowlisted synthetic identity and name.`);
      }
    } else if (command === 'upload') {
      throw new Error(`${relativePath}, line ${index + 1}: initial synthetic contact fields are required.`);
    }
    if (command === 'reset') {
      const baseline = identifier.id === 'westfield-demo-enrolled@example.invalid';
      if (record.extensions.westfieldPaperlessEnrolled !== baseline) throw new Error(`${relativePath}: reset flags must match the baseline.`);
    }
    return { ...record, identifiers: [{ provider, id: identifier.id }] };
  });
  const payload = Buffer.from(records.map((record) => JSON.stringify(record)).join('\n') + '\n', 'utf8');
  return {
    relativePath,
    payload,
    md5: createHash('md5').update(payload).digest('hex'),
    recordCount: records.length,
  };
}

function remoteConfig(options) {
  if (!options.endpoint) throw new Error('Pass --endpoint with the API Endpoint from the target tenant Credentials page.');
  let url;
  try { url = new URL(options.endpoint); } catch { throw new Error('--endpoint must be a valid HTTPS base URL.'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash
    || /\/v1\/batches(?:\/|$)/.test(url.pathname)) {
    throw new Error('--endpoint must be the HTTPS API base URL, with no credentials/query/fragment or /v1/batches suffix.');
  }
  const apiKey = process.env.SITECORE_PROFILE_IMPORT_API_KEY;
  if (!apiKey || !apiKey.trim() || /[\r\n]/.test(apiKey)) {
    throw new Error('Set SITECORE_PROFILE_IMPORT_API_KEY in the process environment; never pass it on the command line.');
  }
  return { endpoint: url.href.replace(/\/$/, ''), apiKey };
}

function requireBatchId(options) {
  const value = options['batch-id'];
  if (!value || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
    throw new Error('Pass --batch-id with the UUID returned by the upload.');
  }
  return value;
}

async function request(config, suffix, init = {}) {
  let response;
  try {
    response = await fetch(`${config.endpoint}/v1/batches${suffix}`, {
      ...init,
      headers: { Authorization: `ApiKey ${config.apiKey}` },
      redirect: 'error',
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    throw new Error('Profile Import request failed or timed out. No retry was attempted; inspect native batch history before uploading again.');
  }
  if (!response.ok) {
    throw new Error(`Profile Import API returned HTTP ${response.status}. No retry was attempted; check access and native batch history.`);
  }
  return response;
}

async function main() {
  if (Number(process.versions.node.split('.')[0]) < 24) throw new Error('Use Node.js 24 or later.');
  const { command, options } = parseArgs(process.argv.slice(2));
  if (command === 'help') { process.stdout.write(help); return; }
  if (command === 'validate') {
    const provider = requireProvider(options);
    for (const name of ['upload', 'reset']) {
      const prepared = await prepareFile(name, provider);
      console.log(JSON.stringify({ file: prepared.relativePath, provider, records: prepared.recordCount, bytes: prepared.payload.length, md5: prepared.md5 }));
    }
    console.log('Offline validation passed. The provider still needs verification against the target native identity rule. No remote request was made.');
    return;
  }
  if (command === 'upload' || command === 'reset') {
    const provider = requireProvider(options);
    const prepared = await prepareFile(command, provider);
    const config = remoteConfig(options);
    const body = new FormData();
    body.append('file', new Blob([prepared.payload], { type: 'application/x-ndjson' }), prepared.relativePath.split('/').at(-1));
    body.append('md5', prepared.md5);
    body.append('operationType', 'UPSERT');
    const response = await request(config, '', { method: 'POST', body });
    if (response.status !== 202) throw new Error(`Expected HTTP 202 Accepted; received ${response.status}. Inspect native batch history before another upload.`);
    const result = await response.json();
    console.log(JSON.stringify(result, null, 2));
    console.log('Queued only. Use status and results, then verify the native profiles and live personalization.');
    return;
  }
  const batchId = requireBatchId(options);
  const config = remoteConfig(options);
  const response = await request(config, `/${encodeURIComponent(batchId)}/${command}`);
  if (command === 'status') {
    console.log(JSON.stringify(await response.json(), null, 2));
  } else {
    const contents = await response.text();
    if (options.output) {
      await writeFile(resolve(options.output), contents, { flag: 'wx', mode: 0o600 });
      console.log(`Saved results to ${resolve(options.output)}. Inspect each record outcome before claiming synchronization.`);
    } else {
      process.stdout.write(contents);
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
