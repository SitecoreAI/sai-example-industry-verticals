import { localeOptions } from '@/constants/localeOptions';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { defaultLocaleCurrency, LocaleOption } from '@/types/locale';

export type LocaleWithCurrency = LocaleOption & typeof defaultLocaleCurrency;

/**
 * Get locale options for a given locale (defaults to current locale)
 */
export function useLocale(locale?: string): LocaleWithCurrency {
  const { page } = useSitecore();
  const currentLocale = page.locale || 'en';
  const targetLocale = locale || currentLocale;
  const localeItem = localeOptions.find((l) => l.code === targetLocale) || localeOptions[0];

  return {
    ...localeItem,
    currency: localeItem.currency ?? defaultLocaleCurrency.currency,
    currencySymbol: localeItem.currencySymbol ?? defaultLocaleCurrency.currencySymbol,
  };
}
