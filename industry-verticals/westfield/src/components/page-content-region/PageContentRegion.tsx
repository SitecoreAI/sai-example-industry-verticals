import type { JSX } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';

// Fixed in each page design so native placeholder settings can offer the right
// component palette without adding a visual wrapper or changing SDK routing.
export const Home = ({ rendering }: ComponentProps): JSX.Element => (
  <Placeholder name="westfield-home-content" rendering={rendering} />
);

export const Campaign = ({ rendering }: ComponentProps): JSX.Element => (
  <Placeholder name="westfield-campaign-content" rendering={rendering} />
);

export const Advice = ({ rendering }: ComponentProps): JSX.Element => (
  <Placeholder name="westfield-advice-content" rendering={rendering} />
);

export const Search = ({ rendering }: ComponentProps): JSX.Element => (
  <Placeholder name="westfield-search-content" rendering={rendering} />
);

export const Default = Home;
