# Westfield customer demo

This independent head starts from `industry-verticals/starter` at repository revision `6c7c2a890d18abfc0a856e6f334c2a64ac54c067`. It retains the starter's Next.js Pages Router, SitecoreProvider, native Placeholders, editing endpoints, component-map generation, and PersonalizeMiddleware.

The package ranges remain those supplied by the starter. The inherited lockfile records Next.js 15.5.9, React 19.2.3, Content SDK/CLI 1.3.0, and Cloud SDK Core/Events 0.5.8. Dependency installation and deployment are separate steps.

## Native component contracts

| Component | Datasource fields | Presentation exports |
| --- | --- | --- |
| CampaignHero | Eyebrow, Heading, Body, Image | Default |
| CampaignAction | Heading, Body, Link | Default, Quiet |
| CampaignContent | Heading, Body | Default |
| SiteHeader | Logo; HomeLink, BusinessLink, HomeAndAutoLink, AboutLink, CareersLink, PaperlessLink, AccountLink, ClaimsLink, AgentLink, BillingLink, ContactLink | Default |
| SiteFooter | Logo, Address, Phone, ContactLink, AccountLink, PrivacyLink, TermsLink, Copyright | Default |

Components receive original Content SDK fields. Native datasources determine both link labels and destinations. `CampaignAction.Quiet` is a presentation option; it does not encode customer status. Header/footer content is intended for shared partials. Ordinary campaign content belongs in page-local Data.

## Application setup

Copy the appropriate `.env.*.example` to `.env.local` and supply the authorized target environment values. The examples identify `westfield` and English; all credentials and Edge context IDs are blank. Keep actual credentials outside source control.

The root deployment configuration and native Westfield definitions must be configured before deploying this head. Do not run all other verticals' content seeding against an existing shared authoring environment as part of an ordinary Westfield code release.

The standard build runs component-map generation and Sitecore metadata/site/import-map generation before Next.js. The inherited `.sitecore` maps will be regenerated from this head's components during that process.

## Campaign entry and styles

`public/instagram/index.html` is the supplied static Instagram rehearsal prop. Its sponsored Westfield card links to `/paperless` with Instagram campaign parameters. Feed interactions are illustrative. This prop contains no identity or enrollment-status logic.

Both Westfield stylesheets are imported from the Pages Router `_app.tsx` after the starter stylesheet. Roboto fonts are served from `public/westfield-assets`. Styling is scoped to the Westfield components; native layout fields and placeholders remain intact.

## Personalization boundary

The starter middleware already composes MultisiteMiddleware, RedirectsMiddleware, and PersonalizeMiddleware. That is integration scaffolding, not proof of a configured decision or synced customer profile. The target site's Edge context, personalization scope, native variants/datasources, synthetic identity, source sync, and first-render behavior must be configured and verified separately.

Cloud SDK initialization and page-view events are disabled in development/editing/preview by the inherited starter. Rehearse tracking in a normal deployed session. No UDL connector, fake customer-profile fixture, or real enrollment transaction is implemented in this frontend.
