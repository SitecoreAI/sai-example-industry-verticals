import { CloudSDK, getBrowserId, getGuestId } from '@sitecore-cloudsdk/core/browser';
import { clearEventQueue, identity } from '@sitecore-cloudsdk/events/browser';
import scConfig from 'sitecore.config';
import { readNativeGuestId, waitForNativeIdentityChange } from './native-identity-readiness';

const demoAccounts = [
  {
    name: 'Casey Morgan',
    username: 'casey@example.com',
    identifier: 'westfield-demo-unenrolled@example.invalid',
  },
  {
    name: 'Jordan Taylor',
    username: 'jordan@example.com',
    identifier: 'westfield-demo-enrolled@example.invalid',
  },
] as const;

const campaignParameters = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'utm_id',
] as const;

/** Keep attribution without accepting an arbitrary redirect or identity from the URL. */
export function demoAccountDestination(search: string): string {
  const incoming = new URLSearchParams(search);
  const campaign = new URLSearchParams();
  for (const name of campaignParameters) {
    for (const value of incoming.getAll(name)) {
      campaign.append(name, value);
    }
  }
  const query = campaign.toString();
  return `/paperless${query ? `?${query}` : ''}`;
}

function cookieValue(name: string): string | undefined {
  const prefix = `${name}=`;
  return document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(prefix))
    ?.slice(prefix.length);
}

/**
 * Presenter-only session reset. Profile attributes stay in SitecoreAI.
 * Cloud SDK 0.5 has no reset API. Its source and visitor-cookie documentation
 * establish that an absent browser cookie receives a fresh server-issued ID.
 * Expire only this context's browser/guest cookies before sending another email
 * so the two synthetic people are never identified on the same browser ID.
 */
export async function resetDemoBrowserIdentity(): Promise<void> {
  const contextId = scConfig.api.edge.clientContextId;
  if (!contextId) {
    throw new Error('The live Sitecore client context is not configured.');
  }
  const browserCookie = `sc_${contextId}`;
  const previousBrowserId = cookieValue(browserCookie);
  const cookieDomain = window.location.hostname.replace(/^www\./, '');

  for (const name of [browserCookie, `${browserCookie}_personalize`]) {
    for (const domain of ['', `; Domain=${cookieDomain}`]) {
      document.cookie = `${name}=; Max-Age=0; Path=/; Secure; SameSite=None${domain}`;
    }
    if (cookieValue(name)) {
      throw new Error(
        'The previous demo identity could not be cleared. Use a fresh browser session.'
      );
    }
  }

  CloudSDK({
    sitecoreEdgeUrl: scConfig.api.edge.edgeUrl,
    sitecoreEdgeContextId: contextId,
    siteName: scConfig.defaultSite,
    enableBrowserCookie: true,
    cookieDomain,
  })
    .addEvents()
    .initialize();

  // This public SDK method also awaits asynchronous cookie initialization.
  await clearEventQueue();
  const browserId = getBrowserId();
  if (!browserId || browserId === previousBrowserId) {
    throw new Error('A fresh Sitecore browser identity could not be established.');
  }
}

/** Synthetic credentials are checked locally. Only the native identifier reaches Sitecore. */
export async function signInDemoAccount(username: string, password: string): Promise<void> {
  const account = demoAccounts.find(
    (candidate) => candidate.username === username.trim().toLowerCase()
  );
  if (!account || password !== 'password') {
    throw new Error('The email or password is incorrect. Please try again.');
  }

  await resetDemoBrowserIdentity();
  const browserId = getBrowserId();
  const anonymousGuestId = await readNativeGuestId(getGuestId);
  if (!browserId || getBrowserId() !== browserId) {
    throw new Error('Your demo session changed. Please try signing in again.');
  }

  const response = await identity({
    channel: 'WEB',
    currency: 'USD',
    language: scConfig.defaultLanguage,
    page: 'MyWestfield synthetic demo sign in',
    identifiers: [{ provider: 'email', id: account.identifier }],
  });

  if (response?.status !== 'OK' || !response.ref) {
    throw new Error('Your demo account could not be connected. Please try signing in again.');
  }
  await waitForNativeIdentityChange({
    anonymousGuestId,
    lookup: getGuestId,
    isCurrentBrowser: () => getBrowserId() === browserId,
  });
}
