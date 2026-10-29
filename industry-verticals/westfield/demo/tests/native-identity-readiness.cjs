// Native mapping readiness regression. No SDK or remote requests are performed.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const app = path.resolve(__dirname, '../..');
const appRequire = createRequire(path.join(app, 'package.json'));
const ts = appRequire('typescript');

function load(file) {
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', source)(appRequire, module, module.exports);
  return module.exports;
}

const { readNativeGuestId, waitForNativeIdentityChange } = load(
  path.join(app, 'src/lib/native-identity-readiness.ts')
);
const anonymousGuestId = 'fresh-anonymous-profile';
const pending = /still connecting/;

async function run() {
  let lookups = 0;
  await waitForNativeIdentityChange({
    anonymousGuestId,
    lookup: async () => (++lookups < 3 ? anonymousGuestId : 'resolved-native-profile'),
    isCurrentBrowser: () => true,
    timeoutMs: 200,
    retryDelayMs: 1,
  });
  assert.equal(lookups, 3, 'Do not proceed while the native mapping is anonymous');

  lookups = 0;
  await waitForNativeIdentityChange({
    anonymousGuestId,
    lookup: async () => {
      if (++lookups === 1) throw new Error('Temporary native lookup failure');
      return 'resolved-native-profile';
    },
    isCurrentBrowser: () => true,
    timeoutMs: 200,
    retryDelayMs: 1,
  });
  assert.equal(lookups, 2, 'Retry transient reads without sending another identity');

  await assert.rejects(
    waitForNativeIdentityChange({
      anonymousGuestId,
      lookup: async () => anonymousGuestId,
      isCurrentBrowser: () => true,
      timeoutMs: 30,
      retryDelayMs: 1,
    }),
    pending,
    'Elapsed time alone must never permit the redirect'
  );
  await assert.rejects(
    readNativeGuestId(() => new Promise(() => {}), 30),
    pending,
    'A hanging lookup must not leave the login pending indefinitely'
  );
  await assert.rejects(
    waitForNativeIdentityChange({
      anonymousGuestId,
      lookup: async () => 'another-profile',
      isCurrentBrowser: () => false,
    }),
    /session changed/,
    'A different browser session must not satisfy the wait'
  );
  let currentBrowser = true;
  await assert.rejects(
    waitForNativeIdentityChange({
      anonymousGuestId,
      lookup: async () => {
        currentBrowser = false;
        return 'resolved-native-profile';
      },
      isCurrentBrowser: () => currentBrowser,
    }),
    /session changed/,
    'Reject a session change that occurs while the lookup is pending'
  );
  console.log('PASS: native mapping convergence, transient failure, timeout, hanging lookup, and changed-session rejection.');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
