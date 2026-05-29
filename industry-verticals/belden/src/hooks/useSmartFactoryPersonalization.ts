import { useRouter } from 'next/router';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import {
  isSmartFactoryCampaign,
  SMART_FACTORY_CAMPAIGN_COOKIE,
} from '@/constants/smartFactoryPersonalization';

function readCampaignCookie(): string | undefined {
  if (typeof document === 'undefined') {
    return undefined;
  }

  const match = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${SMART_FACTORY_CAMPAIGN_COOKIE}=`));

  return match?.split('=')[1];
}

/**
 * Returns true when the visitor is in the smart-factory manufacturing demo segment.
 */
export function useSmartFactoryPersonalization(): boolean {
  const router = useRouter();
  const { page } = useSitecore();
  const campaign = router.query.utm_campaign ?? readCampaignCookie();

  if (page.mode.isEditing || page.mode.isPreview) {
    return false;
  }

  return isSmartFactoryCampaign(campaign);
}
