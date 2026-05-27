export type LocaleOption = {
  code: string;
  label: string;
  currency?: string;
  currencySymbol?: string;
};

export const defaultLocaleCurrency = {
  currency: 'USD',
  currencySymbol: '$',
} as const;
