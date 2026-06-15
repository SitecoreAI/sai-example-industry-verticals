import {
  Field,
  ImageField,
  NextImage as ContentSdkImage,
  RichText as ContentSdkRichText,
  RichTextField,
  Text as ContentSdkText,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { FormEvent, JSX } from 'react';

interface Fields {
  Title?: Field<string>;
  Copy?: RichTextField;
  Image?: ImageField;
}

export type AllianzHomeHeroProps = ComponentProps & {
  fields?: Fields;
};

const LoginPanel = (): JSX.Element => (
  <div className="hidden w-full max-w-sm shrink-0 lg:block">
    <div className="bg-background shadow-md">
      <form
        className="space-y-4 p-6"
        onSubmit={(event: FormEvent<HTMLFormElement>) => event.preventDefault()}
      >
        <div>
          <label
            htmlFor="allianz-hero-username"
            className="text-foreground-light mb-1 block text-sm"
          >
            Username<span className="text-danger">*</span>
          </label>
          <input
            id="allianz-hero-username"
            name="username"
            type="text"
            autoComplete="username"
            required
            className="border-border text-foreground focus:ring-accent h-10 w-full rounded-sm border px-3 text-sm focus:ring-2 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="allianz-hero-password"
            className="text-foreground-light mb-1 block text-sm"
          >
            Password<span className="text-danger">*</span>
          </label>
          <input
            id="allianz-hero-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="border-border text-foreground focus:ring-accent h-10 w-full rounded-sm border px-3 text-sm focus:ring-2 focus:outline-none"
          />
        </div>

        <label className="text-foreground-light flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="remember"
            className="border-border text-accent h-4 w-4 rounded-sm border"
          />
          Remember me
        </label>

        <div className="flex items-center gap-4 pt-1">
          <button
            type="submit"
            className="bg-success text-background focus-visible:ring-accent h-10 rounded-sm px-8 text-sm font-semibold hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none"
          >
            Login
          </button>
          <a href="#" className="text-accent text-sm font-semibold hover:underline">
            Register
          </a>
        </div>
      </form>

      <div className="border-border flex items-center justify-center gap-4 border-t px-6 py-3 text-sm">
        <a href="#" className="text-accent hover:underline">
          Forgot username?
        </a>
        <span className="bg-border h-4 w-px" aria-hidden="true" />
        <a href="#" className="text-accent hover:underline">
          Forgot password?
        </a>
      </div>
    </div>
  </div>
);

export const Default = ({ params, fields }: AllianzHomeHeroProps): JSX.Element => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  const { styles, RenderingIdentifier: id } = params;
  const { Title, Copy, Image } = fields || {};

  if (!fields && !isEditing) {
    return <></>;
  }

  const showBackgroundImage = Boolean(Image?.value?.src) || isEditing;

  return (
    <section
      className={`component allianz-home-hero relative flex min-h-[28rem] items-center overflow-hidden ${styles ?? ''}`}
      id={id || undefined}
    >
      <div className="absolute inset-0 z-0">
        {showBackgroundImage && (
          <ContentSdkImage field={Image} className="h-full w-full object-cover" priority />
        )}
      </div>

      <div className="relative z-10 w-full">
        {!isEditing && (
          <div
            className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 bg-white/60"
            aria-hidden="true"
          />
        )}
        <div className="relative container mx-auto px-4 py-12 lg:py-16">
          <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
            <div className="max-w-2xl">
              {(Title?.value || isEditing) && (
                <h1 className="text-foreground text-3xl leading-tight font-bold md:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
                  <ContentSdkText field={Title} />
                </h1>
              )}

              {(Copy?.value || isEditing) && (
                <div className="text-foreground-light mt-5 max-w-xl text-base leading-relaxed md:text-lg">
                  <ContentSdkRichText field={Copy} />
                </div>
              )}
            </div>

            <LoginPanel />
          </div>
        </div>
      </div>
    </section>
  );
};
