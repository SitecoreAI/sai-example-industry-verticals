export const isParamEnabled = (value: string | undefined) => value === '1';

/** Checkbox / toggle values sometimes serialize differently from Sitecore or proxies. */
export const isParamTruthy = (value: string | undefined): boolean => {
  if (value === undefined || value === '') return false;
  const v = value.trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes' || v === 'on';
};
