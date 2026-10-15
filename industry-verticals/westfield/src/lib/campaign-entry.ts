import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { pageView } from '@sitecore-cloudsdk/events/browser';
import scConfig from 'sitecore.config';
import { synchronizeDemoGuest } from 'lib/native-guest';

const campaignParameters = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'utm_id',
] as const;

export function campaignHomeDestination(search: string): string {
  const incoming = new URLSearchParams(search);
  const campaign = new URLSearchParams();
  for (const name of campaignParameters) {
    const value = incoming.get(name);
    if (value !== null) campaign.set(name, value);
  }
  const query = campaign.toString();
  return query ? `/?${query}` : '/';
}

/** Record the actual entry page before navigating; the native Home decision chooses its content. */
export async function recordCampaignArrival(): Promise<string> {
  const contextId = scConfig.api.edge.clientContextId;
  if (!contextId) throw new Error('Campaign tracking is not configured.');

  const destination = campaignHomeDestination(window.location.search);
  // pageView reads location.search automatically. Keep only the supported campaign parameters.
  window.history.replaceState(
    window.history.state,
    '',
    `${window.location.pathname}${destination.slice(1)}`
  );

  CloudSDK({
    sitecoreEdgeUrl: scConfig.api.edge.edgeUrl,
    sitecoreEdgeContextId: contextId,
    siteName: scConfig.defaultSite,
    enableBrowserCookie: true,
    cookieDomain: window.location.hostname.replace(/^www\./, ''),
  })
    .addEvents()
    .initialize();

  // This sends directly and awaits the native acknowledgement; it does not enqueue the event.
  const response = await pageView({
    channel: 'WEB',
    currency: 'USD',
    language: scConfig.defaultLanguage,
    page: 'Westfield campaign entry',
  });
  if (response?.status !== 'OK' || !response.ref) {
    throw new Error('The campaign entry was not acknowledged.');
  }

  await synchronizeDemoGuest();
  return destination;
}
