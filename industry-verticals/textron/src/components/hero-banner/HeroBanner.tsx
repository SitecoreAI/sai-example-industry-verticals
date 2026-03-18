import {
  Field,
  ImageField,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
  RichText as ContentSdkRichText,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Image: ImageField;
  Video: ImageField;
  Title: Field<string>;
  Description: Field<string>;
}

interface HeroBannerProps extends ComponentProps {
  fields: Fields;
}

const HeroBannerCommon = ({
  params,
  fields,
  children,
  topContent,
}: HeroBannerProps & { children: React.ReactNode; topContent?: boolean }) => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;
  const isPageEditing = page.mode.isEditing;
  const hideGradientOverlay = styles?.includes('hide-gradient-overlay');

  if (!fields) {
    return isPageEditing ? (
      <div className={`component hero-banner min-h-screen ${styles}`} id={id}>
        [HERO BANNER]
      </div>
    ) : (
      <></>
    );
  }

  return (
    <section
      className={`component hero-banner ${styles} relative flex flex-col items-center`}
      id={id}
    >
      {/* Hero image/video in flow so section height fits content */}
      <div className="relative w-full overflow-hidden bg-background-muted aspect-[16/10] min-h-0">
        {!isPageEditing && fields?.Video?.value?.src ? (
          <video
            className="h-full w-full object-contain object-top"
            autoPlay
            muted
            loop
            playsInline
            poster={fields.Image?.value?.src}
          >
            <source src={fields.Video?.value?.src} type="video/webm" />
          </video>
        ) : (
          <ContentSdkImage
            field={fields.Image}
            className="h-full w-full object-contain object-top"
            priority
          />
        )}
        {/* Gradient overlay */}
        {hideGradientOverlay && (
          <div
            className={`to-foreground/80 absolute inset-0 ${topContent ? 'bg-gradient-to-t' : 'bg-gradient-to-b'} from-transparent from-40%`}
          ></div>
        )}
      </div>

      {/* Text panel - only as tall as its content */}
      <div className="w-full shrink-0">{children}</div>
    </section>
  );
};

/* ------------------- Default (bottom-left) ------------------- */
export const Default = ({ params, fields, rendering }: HeroBannerProps) => {
  const styles = params.styles || '';
  const reverseLayout = styles.includes('reversed');

  return (
    <HeroBannerCommon params={params} fields={fields} rendering={rendering}>
      <div className="relative flex w-full items-end">
        <div className="container mx-auto px-4 py-6">
          <div
            className={`flex w-full ${
              reverseLayout ? 'justify-end text-right' : 'justify-start text-left'
            }`}
          >
            <div>
              <h1 className="font-heading text-foreground text-4xl tracking-tight capitalize lg:text-7xl">
                <ContentSdkText field={fields.Title} />
              </h1>

              <div className="text-foreground-light text-md lg:text-xl">
                <ContentSdkRichText field={fields.Description} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeroBannerCommon>
  );
};

/* ------------------- TopContent (top-right) ------------------- */
export const TopContent = ({ params, fields, rendering }: HeroBannerProps) => {
  const styles = params.styles || '';
  const reverseLayout = styles.includes('reversed');

  return (
    <HeroBannerCommon params={params} fields={fields} rendering={rendering} topContent>
      <div className="relative flex w-full items-start">
        <div className="container mx-auto px-4 py-6">
          <div
            className={`flex w-full ${
              reverseLayout ? 'justify-start text-left' : 'justify-end text-right'
            }`}
          >
            <div>
              <h1 className="font-heading text-foreground text-4xl tracking-tight capitalize lg:text-7xl">
                <ContentSdkText field={fields.Title} />
              </h1>

              <div className="text-foreground-light text-md lg:text-xl">
                <ContentSdkRichText field={fields.Description} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeroBannerCommon>
  );
};
