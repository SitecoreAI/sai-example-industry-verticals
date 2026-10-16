// Regression for reused Cloud SDK server state. All fetches are local mocks.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const app = path.resolve(__dirname, '../..');
const appRequire = createRequire(path.join(app, 'package.json'));
const ts = appRequire('typescript');
const { NextRequest, NextResponse } = appRequire('next/server');
const { CloudSDK } = appRequire('@sitecore-cloudsdk/core/server');
const { personalize } = appRequire('@sitecore-cloudsdk/personalize/server');

const contextId = 'OFFLINE_BROWSER_PERSONALIZE_REGRESSION';
const browserCookie = `sc_${contextId}`;
const guestCookie = `${browserCookie}_personalize`;
const previousBrowser = '11111111-1111-4111-8111-111111111111';
const previousGuest = '22222222-2222-4222-8222-222222222222';
const currentBrowser = '33333333-3333-4333-8333-333333333333';
const nextBrowser = '44444444-4444-4444-8444-444444444444';
const calls = [];
const originalFetch = global.fetch;

global.fetch = async (input, options = {}) => {
  const url = new URL(String(input));
  assert.equal(url.origin, 'https://offline-personalize.invalid', 'Remote fetch is forbidden');
  calls.push({ path: url.pathname, body: options.body ? JSON.parse(options.body) : null });
  if (url.pathname.endsWith('/browser/create.json')) {
    return Response.json({ ref: previousBrowser, customer_ref: previousGuest });
  }
  if (url.pathname === '/v1/personalize') {
    return Response.json({ variantId: 'offline_native_result' });
  }
  throw new Error(`Unexpected SDK request: ${url.pathname}`);
};

function loadMiddleware() {
  const file = path.join(app, 'src/lib/browser-personalize-middleware.ts');
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', source)(appRequire, module, module.exports);
  return module.exports.BrowserPersonalizeMiddleware;
}

const settings = {
  sitecoreEdgeUrl: 'https://offline-personalize.invalid',
  sitecoreEdgeContextId: contextId,
  siteName: 'westfield',
  cookieDomain: 'demo.invalid',
  enableServerCookie: true,
};

async function run() {
  // Prime the installed SDK with a prior visitor in the same middleware process.
  const previous = new NextRequest('https://demo.invalid/');
  await CloudSDK(previous, NextResponse.next(), settings)
    .addPersonalize({ enablePersonalizeCookie: true })
    .initialize();
  assert.equal(previous.cookies.get(guestCookie).value, previousGuest);

  // Prove that the installed SDK's normal path would assign that visitor's guest
  // to a different browser when its personalize cookie is absent after sign-in.
  const upstream = new NextRequest('https://demo.invalid/paperless', {
    headers: { cookie: `${browserCookie}=${currentBrowser}` },
  });
  await CloudSDK(upstream, NextResponse.next(), settings)
    .addPersonalize({ enablePersonalizeCookie: true })
    .initialize();
  assert.equal(upstream.cookies.get(guestCookie).value, previousGuest);

  const Middleware = loadMiddleware();
  const middleware = new Middleware({
    contextId,
    clientContextId: contextId,
    edgeUrl: settings.sitecoreEdgeUrl,
    enabled: true,
    sites: [],
  });
  for (const browserId of [currentBrowser, nextBrowser]) {
    const request = new NextRequest('https://demo.invalid/paperless?utm_source=instagram', {
      headers: { cookie: `${browserCookie}=${browserId}` },
    });
    const response = NextResponse.next();
    // Exercise the base middleware's supported protected extension point.
    await middleware.initPersonalizeServer({
      hostname: 'demo.invalid',
      siteName: 'westfield',
      request,
      response,
    });
    assert.equal(request.cookies.get(browserCookie).value, browserId);
    assert.equal(request.cookies.get(guestCookie), undefined);
    assert.equal(response.cookies.get(guestCookie), undefined);
    assert.equal(new URL(request.url).pathname, '/paperless');
    const result = await personalize(request, {
      friendlyId: 'OFFLINE_NATIVE_EXPERIENCE',
      channel: 'WEB',
      currency: 'USD',
      language: 'en',
    });
    const payload = calls.filter((call) => call.path === '/v1/personalize').at(-1).body;
    assert.equal(payload.browserId, browserId);
    assert.ok(!payload.guestRef);
    assert.equal(payload.identifiers, undefined);
    assert.equal(payload.email, undefined);
    assert.equal(payload.params.utm.source, 'instagram');
    assert.equal(result.variantId, 'offline_native_result');
  }
  console.log(
    'PASS: stale upstream guest reproduced; two fresh browser decisions preserve native SDK results without cached guest, URL rewrite, identity override or remote requests.'
  );
}

run()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => {
    global.fetch = originalFetch;
  });
