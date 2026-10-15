import { getBrowserId, getGuestId } from '@sitecore-cloudsdk/core/browser';
import scConfig from 'sitecore.config';

/**
 * Synchronize this visit's native guest reference before a full document navigation.
 * Cloud SDK 0.5.8 uses this first-party cookie for server personalization. Its
 * public getGuestId lookup returns the current browser's native customer.ref;
 * it does not persist that cookie itself or guarantee profile-event processing.
 */
export async function synchronizeDemoGuest(): Promise<void> {
  const contextId = scConfig.api.edge.clientContextId;
  const browserId = getBrowserId();
  if (!contextId || !browserId) {
    throw new Error('This visit could not be connected. Please try again.');
  }

  const guestId = await getGuestId();
  if (
    typeof guestId !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(guestId) ||
    getBrowserId() !== browserId
  ) {
    throw new Error('This visit could not be connected. Please try again.');
  }

  const name = `sc_${contextId}_personalize`;
  const domain = window.location.hostname.replace(/^www\./, '');
  // Match the installed SDK's default cookie attributes: 730 days, /, Secure,
  // SameSite=None and the same host domain used by our CloudSDK initialization.
  document.cookie = `${name}=${guestId}; Max-Age=${730 * 86400}; Path=/; Domain=${domain}; Secure; SameSite=None`;
  const persisted = document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.slice(name.length + 1);
  if (persisted !== guestId) {
    throw new Error('This visit could not be connected. Please try again.');
  }
}
