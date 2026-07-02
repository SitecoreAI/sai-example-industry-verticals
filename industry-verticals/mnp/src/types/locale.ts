export type AppLocale = 'en' | 'fr-FR';

export type LocaleOption = {
  code: AppLocale;
  label: string;
  currency: string;
  currencySymbol: string;
};
