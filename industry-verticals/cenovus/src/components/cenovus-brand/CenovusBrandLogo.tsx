import Image from 'next/image';
import React, { JSX } from 'react';

import { defaultBrandLogo } from '@/lib/cenovus-demo';

export type CenovusBrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function CenovusBrandLogo({ className, priority }: CenovusBrandLogoProps): JSX.Element {
  return (
    <Image
      src={defaultBrandLogo.src}
      alt={defaultBrandLogo.alt}
      width={defaultBrandLogo.width}
      height={defaultBrandLogo.height}
      className={className}
      priority={priority}
    />
  );
}
