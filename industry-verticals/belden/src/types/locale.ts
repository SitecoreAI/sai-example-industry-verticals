export type LocaleOption = {
  code: string;
  label: string;
  currency?: string;
  currencySymbol?: string;
};

export type LocaleWithCurrency = LocaleOption & {
  currency: string;
  currencySymbol: string;
};

export const defaultLocaleCurrency: Pick<LocaleWithCurrency, 'currency' | 'currencySymbol'> = {
  currency: 'USD',
  currencySymbol: '$',
};
