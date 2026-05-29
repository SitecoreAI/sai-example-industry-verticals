import { Field, LinkField, RichTextField, TextField } from '@sitecore-content-sdk/nextjs';
import { ReviewFields } from '@/types/review';
import { IGQLTextField } from '@/types/igql';

export const SMART_FACTORY_CAMPAIGN = 'smart-factory';
export const SMART_FACTORY_CAMPAIGN_COOKIE = 'belden_utm_campaign';
export const SMART_FACTORY_SUBSCRIBE_SUBHEAD =
  'See how Belden helps manufacturers build secure, scalable, high-performance infrastructure for connected operations.';

export function isSmartFactoryCampaign(campaign: string | string[] | undefined | null): boolean {
  if (!campaign) {
    return false;
  }

  const value = Array.isArray(campaign) ? campaign[0] : campaign;
  return value === SMART_FACTORY_CAMPAIGN;
}

function textField(value: string): Field<string> {
  return { value };
}

function richTextField(value: string): RichTextField {
  return { value };
}

function linkField(text: string, href = '/'): LinkField {
  return {
    value: {
      href,
      text,
      linktype: 'internal',
      url: href,
      anchor: '',
      target: '',
      class: '',
      title: text,
      querystring: '',
      id: '',
    },
  };
}

interface HeroFields {
  Title: Field<string>;
  Description: RichTextField;
  CtaLink: LinkField;
}

export function personalizeHeroFields<T extends HeroFields>(fields: T, active: boolean): T {
  if (!active) {
    return fields;
  }

  return {
    ...fields,
    Title: textField('Keep production moving with resilient industrial networks.'),
    Description: richTextField(
      '<p>From plant-floor connectivity to secure OT data infrastructure, Belden helps manufacturers reduce downtime, modernize operations, and connect critical systems.</p>'
    ),
    CtaLink: linkField('Explore manufacturing solutions', '/'),
  };
}

interface FeatureItem {
  featureTitle: { jsonValue: { value: string } };
  featureDescription: { jsonValue: { value: string } };
  featureLink?: { jsonValue: { value: { href: string } } };
  featureImage?: { jsonValue: { value: { src: string; alt?: string } } };
}

interface FeaturesFields {
  data: {
    datasource: {
      title: IGQLTextField;
      children: {
        results: FeatureItem[];
      };
    };
  };
}

const SMART_FACTORY_FEATURES: Array<{ title: string; description: string }> = [
  {
    title: 'Reduce unplanned downtime',
    description: 'Build resilient network infrastructure that keeps production lines connected.',
  },
  {
    title: 'Modernize OT safely',
    description: 'Connect legacy equipment, sensors, and systems without disrupting operations.',
  },
  {
    title: 'Turn plant data into action',
    description: 'Move operational data securely from the edge to the systems that need it.',
  },
];

export function personalizeFeaturesFields<T extends FeaturesFields>(fields: T, active: boolean): T {
  if (!active) {
    return fields;
  }

  const results = fields.data.datasource.children.results.map((item, index) => {
    const override = SMART_FACTORY_FEATURES[index];
    if (!override) {
      return item;
    }

    return {
      ...item,
      featureTitle: { jsonValue: { value: override.title } },
      featureDescription: { jsonValue: { value: override.description } },
    };
  });

  return {
    ...fields,
    data: {
      ...fields.data,
      datasource: {
        ...fields.data.datasource,
        title: { jsonValue: { value: 'Why manufacturers choose Belden' } },
        children: {
          results,
        },
      },
    },
  };
}

interface PromoFields {
  PromoSubTitle: Field<string>;
  PromoTitle: Field<string>;
  PromoDescription: RichTextField;
  PromoMoreInfo: LinkField;
}

export function personalizePromoFields<T extends PromoFields>(fields: T, active: boolean): T {
  if (!active) {
    return fields;
  }

  return {
    ...fields,
    PromoSubTitle: textField('Smart manufacturing'),
    PromoTitle: textField('Connected infrastructure for smart manufacturing'),
    PromoDescription: richTextField(
      '<p>Whether you are modernizing a single facility or standardizing across global plants, Belden helps unify industrial connectivity, cybersecurity, edge data, and network resilience.</p>'
    ),
    PromoMoreInfo: linkField('See smart manufacturing solutions', '/'),
  };
}

interface ReviewsFieldsShape {
  Title: TextField;
  Eyebrow: TextField;
  Reviews: ReviewFields[];
}

const MANUFACTURING_REVIEW_KEYWORDS = [
  'manufactur',
  'industrial',
  'automation',
  'plant',
  'ot ',
  'network',
  'downtime',
  'edge',
  'factory',
  'production',
];

function reviewMatchesManufacturing(review: ReviewFields): boolean {
  const text = [
    review.fields.Description?.value,
    review.fields.Caption?.value,
    review.fields.ReviewerName?.value,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return MANUFACTURING_REVIEW_KEYWORDS.some((keyword) => text.includes(keyword));
}

export function personalizeReviewsFields<T extends ReviewsFieldsShape>(
  fields: T,
  active: boolean
): T {
  if (!active) {
    return fields;
  }

  const reviews = fields.Reviews || [];
  const prioritized = [...reviews].sort((a, b) => {
    const aMatch = reviewMatchesManufacturing(a) ? 1 : 0;
    const bMatch = reviewMatchesManufacturing(b) ? 1 : 0;
    return bMatch - aMatch;
  });

  return {
    ...fields,
    Eyebrow: textField('What our customers say'),
    Title: textField('Proof from connected manufacturing operations'),
    Reviews: prioritized,
  };
}

interface SubscribeFieldsShape {
  Title?: Field<string>;
  ConsentText?: RichTextField;
}

export function personalizeSubscribeFields<T extends SubscribeFieldsShape>(
  fields: T | undefined,
  active: boolean
): T | undefined {
  if (!active || !fields) {
    return fields;
  }

  return {
    ...fields,
    Title: textField('Ready to modernize your plant network?'),
  };
}
