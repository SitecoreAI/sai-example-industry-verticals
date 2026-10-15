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

`/demo` starts a fresh anonymous Sitecore browser session and then opens `public/instagram/index.html`. This static rehearsal prop preserves the supplied Instagram appearance: one Westfield prospect ad appears among unrelated friend stories, concert/weekend posts and suggestions. All presented friend names and corresponding accessible labels use human-friendly names with spaces. The ad says **A new chapter. Protection for what’s next.**, with **Explore home and auto coverage for wherever life takes you.** Its **Learn more** CTA opens `/campaign?utm_source=instagram&utm_medium=social&utm_campaign=next_chapter`. It contains no identity or paperless-status logic and does not lead directly to login. Feed interactions are illustrative. Reused-image provenance is recorded in `demo/westfield/instagram-asset-provenance.json` at the repository root.

The generic `/campaign` entry awaits a native anonymous VIEW acknowledgement with status OK and a ref, then uses replacement navigation to Home with the campaign query retained. It sends no customer identity and makes no local variant choice. Home's LIVE native **Westfield next chapter campaign** decision uses **Profile data → UTM Campaign → Is equal to → next_chapter** to replace its `CampaignHero` datasource with **Next chapter campaign**. The targeted heading is **A new chapter. Protection for what’s next.** The original Hero remains the no-UTM control.

The earlier direct-to-Home **UTM Campaign** test returned the original Hero first, then matched after the page view and reload. The verified design restores that native profile rule and places the acknowledged anonymous VIEW before Home. Preview acceptance at `c344ff72feb1774eb922d519567ec61232b9539e` passed a fresh `/demo` reset → actual Instagram ad click → `/campaign` → first Home document with campaign experience `77f8d59b…` and the correct datasource/heading. Fresh `unrelated_control` campaign entry and fresh plain Home visits selected the original Hero. A cold direct Home URL with only UTM parameters is outside this demonstrated first-arrival path.

| Native contract | Identity |
| --- | --- |
| Home page | `27da11a8-e0dc-42d4-9e3f-b4073306679b` |
| Home CampaignHero component UID | `dffe19de-2a6f-533e-aa5d-5891b093c491` |
| Campaign datasource | `a275f458-496b-40cc-8448-454980cfc4be` at `/sitecore/content/Westfield/westfield/Home/Data/Next chapter campaign` |
| Campaign experience | `77f8d59b-99dd-4451-9ecb-61d97905f04f` |

The preview first-document evidence above verifies this configured contract through the entry route. Production release evidence is recorded separately in the handoff and deployment metadata. Home's separate nonpersonalized coverage promotion is **Protection for wherever life takes you** / **Explore home and auto**, linking to the public reference `https://www.westfieldinsurance.com/home-and-auto`.

Existing customers use the Header **Log in** link to reach the SSO-style local demo `/login`; header/footer navigation preserves allowed campaign parameters. Use `casey@example.com` or `jordan@example.com`, with the literal password `password`. This synthetic local acceptance gate is not production authentication. The password remains in the browser and is never serialized into a request or URL. After acceptance, the Cloud SDK establishes a fresh browser identity and sends the matching existing native identifier: `westfield-demo-unenrolled@example.invalid` for Casey or `westfield-demo-enrolled@example.invalid` for Jordan. Navigation waits for the native identity response and retains campaign attribution.

The destination remains `/paperless`, the existing native page now containing general MyWestfield account content. Its native false/true UDL-derived decision recommends **Sign up for paperless billing** to Casey and **Keep your coverage in step with life** to Jordan. The frontend does not store or submit an enrollment flag. Restart through `/demo` before rehearsing the other account.

Both Westfield stylesheets are imported from the Pages Router `_app.tsx` after the starter stylesheet. Roboto fonts are served from `public/westfield-assets`. Styling is scoped to the Westfield components; native layout fields and placeholders remain intact.

## Personalization boundary

The starter middleware composes MultisiteMiddleware, RedirectsMiddleware and PersonalizeMiddleware. The two native synthetic imports (2/2), Published Boolean custom value, LIVE customer decision and native campaign attribution were verified previously. This revision's `c344ff72` preview acceptance additionally passed Casey's first `/paperless` document (`8b9a9b8e…`, Paperless offer, **Sign up for paperless billing**) and Jordan's (`901e3b8f…`, Paperless enrolled, **Keep your coverage in step with life**). All six supported UTMs survived Instagram → entry → Home → Header login → account, and both Vercel preview checks passed. These are bounded preview results; production release evidence belongs to the handoff and deployment metadata.

Inherited CMS-page SDK initialization and page-view events are disabled in development and Sitecore editing/preview modes. The tested Vercel preview serves a normal website session; the application entry initializes the Events SDK explicitly. No UDL connector, fake customer-profile fixture, or real enrollment transaction is implemented in this frontend.

The native `westfieldPaperlessEnrolled` extension and native rule select the CMS datasource and finite presentation export. `Default` and `Quiet` do not encode customer state. The demo form supplies only an allowlisted synthetic identity after local acceptance; it does not authenticate against the real MyWestfield service.

## Ownership and removal

All frontend, login assets and Instagram prop files remain inside this Westfield head. Developer-only profile preparation, docs and Instagram provenance are under the repository's `demo/westfield`. Normal builds do not import/reset profiles or seed authored content. Use `node scripts/sites.mjs plan-remove westfield` from the repository root to inspect the separate source/native/media/hosting/profile/DAM boundaries before any deliberate retirement; preserve shared environment resources and later author changes.

The owned custom condition **Westfield next chapter arrival** (`ccecd5b4-d31b-46c1-862a-db6b23e21106`, friendly ID `westfield_next_chapter_arrival`) remains Published but unused by the active Home decision, with native usage count zero verified. Retain it in the cleanup inventory and recheck references before a separate unpublish/retirement. Its developer source is not imported by the frontend.
