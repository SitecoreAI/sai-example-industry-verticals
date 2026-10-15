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

`/demo` starts a fresh anonymous Sitecore browser session and then opens `public/instagram/index.html`. This static rehearsal prop preserves the supplied Instagram appearance: one general Westfield sponsored post appears among unrelated friend stories, concert/weekend posts and suggestions. The ad says **Your insurance. On your terms.** and its **Log in** CTA opens `/login?utm_source=instagram&utm_medium=social&utm_campaign=mywestfield`. It contains no identity or paperless-status logic. Feed interactions are illustrative. Reused supplied-image provenance is recorded in `demo/westfield/instagram-asset-provenance.json` at the repository root.

At `/login`, use `casey@example.com` or `jordan@example.com`, with the literal password `password`. This synthetic local acceptance gate is not production authentication. The password remains in the browser and is never serialized into a request or URL. After acceptance, the Cloud SDK establishes a fresh browser identity and sends the matching existing native identifier: `westfield-demo-unenrolled@example.invalid` for Casey or `westfield-demo-enrolled@example.invalid` for Jordan. Navigation waits for the native identity response and preserves the allowed campaign parameters.

The destination remains `/paperless`, the existing native page now containing general MyWestfield account content. Its native false/true UDL-derived decision recommends **Sign up for paperless billing** to Casey and **Keep your coverage in step with life** to Jordan. The frontend does not store or submit an enrollment flag. Restart through `/demo` before rehearsing the other account.

Both Westfield stylesheets are imported from the Pages Router `_app.tsx` after the starter stylesheet. Roboto fonts are served from `public/westfield-assets`. Styling is scoped to the Westfield components; native layout fields and placeholders remain intact.

## Personalization boundary

The starter middleware composes MultisiteMiddleware, RedirectsMiddleware and PersonalizeMiddleware. The prior release verified the target's two native synthetic imports (2/2), Published Boolean custom value, LIVE native decision, both personalized initial documents and native campaign attribution. This revision changes the entry/login journey and account-page content; deployment and fresh end-to-end QA remain release-specific work. Prior verification is not a pass for the revised flow.

Cloud SDK initialization and page-view events are disabled in development/editing/preview by the inherited starter. Rehearse tracking in a normal deployed session. No UDL connector, fake customer-profile fixture, or real enrollment transaction is implemented in this frontend.

The native `westfieldPaperlessEnrolled` extension and native rule select the CMS datasource and finite presentation export. `Default` and `Quiet` do not encode customer state. The demo form supplies only an allowlisted synthetic identity after local acceptance; it does not authenticate against the real MyWestfield service.

## Ownership and removal

All frontend, login assets and Instagram prop files remain inside this Westfield head. Developer-only profile preparation, docs and Instagram provenance are under the repository's `demo/westfield`. Normal builds do not import/reset profiles or seed authored content. Use `node scripts/sites.mjs plan-remove westfield` from the repository root to inspect the separate source/native/media/hosting/profile/DAM boundaries before any deliberate retirement; preserve shared environment resources and later author changes.
