// Below are built-in components that are available in the app, it's recommended to keep them as is

import { BYOCWrapper, NextjsContentSdkComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

// end of built-in components
import * as Title from 'src/components/title/Title';
import * as ThemeEditor from 'src/components/theme-editor/ThemeEditor';
import * as SocialFollow from 'src/components/social-follow/SocialFollow';
import * as SocialFeed from 'src/components/social-feed/SocialFeed';
import * as SelectedProducts from 'src/components/selected-products/SelectedProducts';
import * as SectionWrapper from 'src/components/section-wrapper/SectionWrapper';
import * as RowSplitter from 'src/components/row-splitter/RowSplitter';
import * as RichText from 'src/components/rich-text/RichText';
import * as Promo from 'src/components/promo/Promo';
import * as ProductListing from 'src/components/product-listing/ProductListing';
import * as ProductDetails from 'src/components/product-details/ProductDetails';
import * as PartialDesignDynamicPlaceholder from 'src/components/partial-design-dynamic-placeholder/PartialDesignDynamicPlaceholder';
import * as PageHeader from 'src/components/page-header/PageHeader';
import * as PageContent from 'src/components/page-content/PageContent';
import * as Offers from 'src/components/offers/Offers';
import * as NavigationIcons from 'src/components/navigation-icons/NavigationIcons';
import * as Navigation from 'src/components/navigation/Navigation';
import * as LinkList from 'src/components/link-list/LinkList';
import * as LanguageSwitcher from 'src/components/language-switcher/LanguageSwitcher';
import * as Image from 'src/components/image/Image';
import * as HeroBanner from 'src/components/hero-banner/HeroBanner';
import * as Header from 'src/components/header/Header';
import * as Footer from 'src/components/footer/Footer';
import * as Features from 'src/components/features/Features';
import * as ContentBlock from 'src/components/content-block/ContentBlock';
import * as Container from 'src/components/container/Container';
import * as ColumnSplitter from 'src/components/column-splitter/ColumnSplitter';
import * as CenovusSpotlights from 'src/components/cenovus-spotlights/CenovusSpotlights';
import * as CenovusOnboardingChecklist from 'src/components/cenovus-onboarding-checklist/CenovusOnboardingChecklist';
import * as CenovusKeyDates from 'src/components/cenovus-key-dates/CenovusKeyDates';
import * as CenovusHomepage from 'src/components/cenovus-homepage/CenovusHomepage';
import * as CenovusHomeHero from 'src/components/cenovus-home-hero/CenovusHomeHero';
import * as CenovusRegionPicker from 'src/components/cenovus-header/CenovusRegionPicker';
import * as CenovusHeaderDemoChrome from 'src/components/cenovus-header/CenovusHeaderDemoChrome';
import * as CenovusHeader from 'src/components/cenovus-header/CenovusHeader';
import * as CenovusFooter from 'src/components/cenovus-footer/CenovusFooter';
import * as CenovusCompanyNews from 'src/components/cenovus-company-news/CenovusCompanyNews';
import * as CenovusLogoField from 'src/components/cenovus-brand/CenovusLogoField';
import * as CenovusBrandLogo from 'src/components/cenovus-brand/CenovusBrandLogo';
import * as CenovusArticlePage from 'src/components/cenovus-article-page/CenovusArticlePage';
import * as CenovusArticleListing from 'src/components/cenovus-article-listing/CenovusArticleListing';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCWrapper],
  ['FEaaSWrapper', FEaaSWrapper],
  ['Form', Form],
  ['Title', { ...Title }],
  ['ThemeEditor', { ...ThemeEditor }],
  ['SocialFollow', { ...SocialFollow }],
  ['SocialFeed', { ...SocialFeed }],
  ['SelectedProducts', { ...SelectedProducts }],
  ['SectionWrapper', { ...SectionWrapper }],
  ['RowSplitter', { ...RowSplitter }],
  ['RichText', { ...RichText }],
  ['Promo', { ...Promo }],
  ['ProductListing', { ...ProductListing }],
  ['ProductDetails', { ...ProductDetails }],
  ['PartialDesignDynamicPlaceholder', { ...PartialDesignDynamicPlaceholder }],
  ['PageHeader', { ...PageHeader }],
  ['PageContent', { ...PageContent }],
  ['Offers', { ...Offers }],
  ['NavigationIcons', { ...NavigationIcons }],
  ['Navigation', { ...Navigation, componentType: 'client' }],
  ['LinkList', { ...LinkList }],
  ['LanguageSwitcher', { ...LanguageSwitcher, componentType: 'client' }],
  ['Image', { ...Image }],
  ['HeroBanner', { ...HeroBanner }],
  ['Header', { ...Header, componentType: 'client' }],
  ['Footer', { ...Footer }],
  ['Features', { ...Features }],
  ['ContentBlock', { ...ContentBlock }],
  ['Container', { ...Container }],
  ['ColumnSplitter', { ...ColumnSplitter }],
  ['CenovusSpotlights', { ...CenovusSpotlights }],
  ['CenovusOnboardingChecklist', { ...CenovusOnboardingChecklist, componentType: 'client' }],
  ['CenovusKeyDates', { ...CenovusKeyDates, componentType: 'client' }],
  ['CenovusHomepage', { ...CenovusHomepage }],
  ['CenovusHomeHero', { ...CenovusHomeHero, componentType: 'client' }],
  ['CenovusRegionPicker', { ...CenovusRegionPicker, componentType: 'client' }],
  ['CenovusHeaderDemoChrome', { ...CenovusHeaderDemoChrome, componentType: 'client' }],
  ['CenovusHeader', { ...CenovusHeader, componentType: 'client' }],
  ['CenovusFooter', { ...CenovusFooter }],
  ['CenovusCompanyNews', { ...CenovusCompanyNews }],
  ['CenovusLogoField', { ...CenovusLogoField }],
  ['CenovusBrandLogo', { ...CenovusBrandLogo }],
  ['CenovusArticlePage', { ...CenovusArticlePage, componentType: 'client' }],
  ['CenovusArticleListing', { ...CenovusArticleListing, componentType: 'client' }],
]);

export default componentMap;
