import { JSX } from 'react';
import type { AppProps } from 'next/app';
import { I18nProvider } from 'next-localization';
import Bootstrap from 'src/Bootstrap';
import { SitecorePageProps } from '@sitecore-content-sdk/nextjs';
import scConfig from 'sitecore.config';
import 'assets/main.css';
import { Environment, PageController, WidgetsProvider } from '@sitecore-search/react';

const SEARCH_CONFIG = {
  env: process.env.NEXT_PUBLIC_SEARCH_ENV,
  customerKey: process.env.NEXT_PUBLIC_SEARCH_CUSTOMER_KEY,
  apiKey: process.env.NEXT_PUBLIC_SEARCH_API_KEY,
};

const hasSearchConfig = Boolean(
  SEARCH_CONFIG.env && SEARCH_CONFIG.customerKey && SEARCH_CONFIG.apiKey
);

function App({ Component, pageProps }: AppProps<SitecorePageProps>): JSX.Element {
  const { dictionary, ...rest } = pageProps;
  const lang = pageProps.page?.locale || scConfig.defaultLanguage;

  if (hasSearchConfig) {
    PageController.getContext().setLocaleLanguage(lang.split('-')[0]);
    if (lang == 'en') {
      PageController.getContext().setLocaleCountry('us');
    } else {
      PageController.getContext().setLocaleCountry(lang.split('-')[1].toLocaleLowerCase());
    }
  }

  const page = (
    <I18nProvider lngDict={dictionary} locale={pageProps.page?.locale || scConfig.defaultLanguage}>
      <Component {...rest} />
    </I18nProvider>
  );

  return (
    <>
      <Bootstrap {...pageProps} />
      {hasSearchConfig ? (
        <WidgetsProvider
          env={SEARCH_CONFIG.env as Environment}
          customerKey={SEARCH_CONFIG.customerKey}
          apiKey={SEARCH_CONFIG.apiKey}
          publicSuffix={true}
        >
          {page}
        </WidgetsProvider>
      ) : (
        page
      )}
    </>
  );
}

export default App;
