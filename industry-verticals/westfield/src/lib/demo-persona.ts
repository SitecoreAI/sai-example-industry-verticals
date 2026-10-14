import { CloudSDK, getBrowserId } from '@sitecore-cloudsdk/core/browser';
import { clearEventQueue, identity } from '@sitecore-cloudsdk/events/browser';
import scConfig from 'sitecore.config';

export const demoPersonas = [
  {
    name: 'Casey Morgan',
    email: 'westfield-demo-unenrolled@example.invalid',
    description: 'Paperless enrollment offer',
  },
  {
    name: 'Jordan Taylor',
    email: 'westfield-demo-enrolled@example.invalid',
    description: 'Already enrolled in paperless',
  },
] as const;

type DemoEmail = (typeof demoPersonas)[number]['email'];

function cookieValue(name: string): string | undefined {
  const prefix = `${name}=`;
  return document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(prefix))
    ?.slice(prefix.length);
}

/**
 * Presenter-only identity setup. Profile attributes stay in SitecoreAI.
 * Cloud SDK 0.5 has no reset API. Its source and visitor-cookie documentation
 * establish that an absent browser cookie receives a fresh server-issued ID.
 * Expire only this context's browser/guest cookies before sending another email
 * so the two synthetic people are never identified on the same browser ID.
 */
export async function startDemoPersona(email: DemoEmail): Promise<void> {
  const contextId = scConfig.api.edge.clientContextId;
  if (!contextId) {
    throw new Error('The live Sitecore client context is not configured.');
  }
  if (!demoPersonas.some((persona) => persona.email === email)) {
    throw new Error('Choose one of the two synthetic demo people.');
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

  const response = await identity({
    channel: 'WEB',
    currency: 'USD',
    language: scConfig.defaultLanguage,
    page: 'Westfield synthetic demo launch',
    identifiers: [{ provider: 'email', id: email }],
  });

  if (response?.status !== 'OK' || !response.ref) {
    throw new Error('Sitecore did not confirm the identity event. Stay here and try again.');
  }
}
