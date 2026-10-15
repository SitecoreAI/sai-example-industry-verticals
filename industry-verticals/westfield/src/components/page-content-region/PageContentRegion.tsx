import type { JSX } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';

// Fixed in each page design so native placeholder settings can offer the right
// component palette without adding a visual wrapper or changing SDK routing.
export const Home = ({ params, rendering }: ComponentProps): JSX.Element => (
  <Placeholder
    name={`westfield-home-content-${params.DynamicPlaceholderId}`}
    rendering={rendering}
  />
);

export const Campaign = ({ params, rendering }: ComponentProps): JSX.Element => (
  <Placeholder
    name={`westfield-campaign-content-${params.DynamicPlaceholderId}`}
    rendering={rendering}
  />
);

export const Advice = ({ params, rendering }: ComponentProps): JSX.Element => (
  <Placeholder
    name={`westfield-advice-content-${params.DynamicPlaceholderId}`}
    rendering={rendering}
  />
);

export const Search = ({ params, rendering }: ComponentProps): JSX.Element => (
  <Placeholder
    name={`westfield-search-content-${params.DynamicPlaceholderId}`}
    rendering={rendering}
  />
);

export const Default = Home;
