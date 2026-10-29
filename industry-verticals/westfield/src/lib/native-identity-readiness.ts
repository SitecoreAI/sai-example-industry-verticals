const IDENTITY_TIMEOUT_MS = 6000;
const IDENTITY_PENDING_MESSAGE =
  'Your demo account is still connecting. Please try signing in again.';

type NativeGuestLookup = () => Promise<string>;

/** Bound the SDK lookup without treating elapsed time as a successful identity match. */
export async function readNativeGuestId(
  lookup: NativeGuestLookup,
  timeoutMs = IDENTITY_TIMEOUT_MS
): Promise<string> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const guestId = await Promise.race([
      Promise.resolve().then(lookup),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(IDENTITY_PENDING_MESSAGE)), timeoutMs);
      }),
    ]);
    if (!guestId) throw new Error(IDENTITY_PENDING_MESSAGE);
    return guestId;
  } catch {
    throw new Error(IDENTITY_PENDING_MESSAGE);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}

/**
 * Both synthetic accounts already have imported profiles. After a fresh browser
 * identifies, wait for its native mapping to leave the anonymous profile before
 * navigating. This does not inspect profile attributes or choose page content.
 */
export async function waitForNativeIdentityChange({
  anonymousGuestId,
  lookup,
  isCurrentBrowser,
  timeoutMs = IDENTITY_TIMEOUT_MS,
  retryDelayMs = 250,
}: {
  anonymousGuestId: string;
  lookup: NativeGuestLookup;
  isCurrentBrowser: () => boolean;
  timeoutMs?: number;
  retryDelayMs?: number;
}): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  let retryDelay = retryDelayMs;
  while (Date.now() < deadline) {
    if (!isCurrentBrowser()) {
      throw new Error('Your demo session changed. Please try signing in again.');
    }
    let guestId: string | undefined;
    try {
      guestId = await readNativeGuestId(lookup, deadline - Date.now());
    } catch {
      // A transient lookup failure can recover within the same bounded wait.
    }
    if (!isCurrentBrowser()) {
      throw new Error('Your demo session changed. Please try signing in again.');
    }
    if (guestId && guestId !== anonymousGuestId) return;
    const remaining = deadline - Date.now();
    if (remaining <= 0) break;
    await new Promise((resolve) => setTimeout(resolve, Math.min(retryDelay, remaining)));
    retryDelay = Math.min(retryDelay * 2, 1000);
  }
  throw new Error(IDENTITY_PENDING_MESSAGE);
}
