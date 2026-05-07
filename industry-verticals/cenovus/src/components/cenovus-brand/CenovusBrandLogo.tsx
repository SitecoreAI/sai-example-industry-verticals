import React, { JSX } from 'react';

import { defaultBrandLogo } from '@/lib/cenovus-demo';

export type CenovusBrandLogoProps = {
  className?: string;
  priority?: boolean;
};

/** Plain img so the default/fallback logo is not tied to the Next/Image optimizer. */
export function CenovusBrandLogo({ className, priority }: CenovusBrandLogoProps): JSX.Element {
  return (
    <img
      src={defaultBrandLogo.src}
      alt={defaultBrandLogo.alt}
      width={defaultBrandLogo.width}
      height={defaultBrandLogo.height}
      className={className}
      {...(priority ? { fetchPriority: 'high' as const } : {})}
      decoding="async"
    />
  );
}
