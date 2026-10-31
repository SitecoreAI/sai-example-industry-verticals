# Westfield customer demo

This independent head starts from `industry-verticals/starter` at repository revision `6c7c2a890d18abfc0a856e6f334c2a64ac54c067`. It retains the starter's Next.js Pages Router, SitecoreProvider, native Placeholders, editing endpoints, component-map generation, and PersonalizeMiddleware.

The package ranges remain those supplied by the starter. The inherited lockfile records Next.js 15.5.9, React 19.2.3, Content SDK/CLI 1.3.0, and Cloud SDK Core/Events 0.5.8. Dependency installation and deployment are separate steps.

## Native component contracts

| Component | Datasource fields | Presentation exports |
| --- | --- | --- |
| CampaignHero | Eyebrow, Heading, Body, Image | Default, Home |
| CampaignAction | Heading, Body, Link | Default, Quiet |
| CampaignContent | Heading, Body | Default, HomeLegal |
| SiteHeader | Logo; native navigation/login links; BusinessLinks, HomeAutoLinks, AboutLinks, CareersLinks | Default |
| SiteFooter | Logo, Address, Phone, ContactLink, AccountLink, PrivacyLink, TermsLink, Copyright; ProductsTitle, CompanyTitle, ConnectTitle, LegalBody; ProductsLinks, CompanyLinks, ConnectLinks, SocialLinks, LegalLinks | Default |
| ArticleHeader | Route Title, pageSummary, Topic, ReadTime, HeroImage | Default |
| ArticleBodyLayout | No datasource; native article-content placeholder | Default |
| ArticleText (Section) | Section heading, Text (Heading, Body) | Default |
| AdviceListing | No datasource; route Title/pageSummary and published article API | Default |
| SearchResults | No datasource; route Title/pageSummary and published website search API | Default |
| HomeSection | Eyebrow, Heading, Body, Link; native home-cards dynamic placeholder | Default, Services, Account, Benefits, News |
| HomeCard | Eyebrow, Heading, Body, Image, Link | Default |
| HomeFeature | Eyebrow, Heading, Body, Image, Link, VideoUrl | Default, Video, MyWestfield, About |

Components receive original Content SDK fields. Native fields supply authored copy and destinations; the fixed Customer login label and generic control labels are interface copy. Links preserve their original SDK field objects and editing metadata. `CampaignAction.Quiet` is a presentation option; it does not encode customer status. Header/footer content is intended for shared partials. Ordinary campaign content belongs in page-local Data.

The Advice Article branch starts with one blank **Section** in its native article-content placeholder. Each Section contains **Section heading** and **Text**, has its own page-local datasource, and can be repeated or reordered. The same placeholder also permits an optional **Action**. Technical ArticleText names and IDs remain stable; ordinary releases do not reseed the branch or overwrite existing articles.

## Application setup

Copy the appropriate `.env.*.example` to `.env.local` and supply the authorized target environment values. The examples identify `westfield` and English; all credentials and Edge context IDs are blank. Keep actual credentials outside source control.

The root deployment configuration and native Westfield definitions must be configured before deploying this head. Do not run all other verticals' content seeding against an existing shared authoring environment as part of an ordinary Westfield code release.

The standard build runs component-map generation and Sitecore metadata/site/import-map generation before Next.js. The inherited `.sitecore` maps will be regenerated from this head's components during that process.

## Campaign entry and styles

`/demo` is a preparation-only guide. Its existing reset controls can open Home or Instagram, while **Prepare anonymous browsing session** stays on the guide after reset and exposes the installed SDK’s `getBrowserId()` as a copyable native Client ID. Readback occurs only after initialization; a missing ID produces a retry message. The guide contains no profile data, scoring, or audience logic. Prepare Home, Articles, Instagram, the matching native Profiles tab, and Page Builder before the meeting. The live order is Home, browsing affinity, Instagram, Casey/Jordan, and authoring, with no return to `/demo`.

The static Instagram prop preserves the supplied appearance: one Westfield prospect ad appears among unrelated friend stories, concert/weekend posts and suggestions. All presented friend names and corresponding accessible labels use human-friendly names with spaces. The ad says **A new chapter. Protection for what’s next.**, with **Explore home and auto coverage for wherever life takes you.** Its **Learn more** CTA opens `/campaign?utm_source=instagram&utm_medium=social&utm_campaign=next_chapter`. It contains no identity or paperless-status logic and does not lead directly to login. Feed interactions are illustrative. Reused-image provenance is recorded in `demo/westfield/instagram-asset-provenance.json` at the repository root.

The generic `/campaign` entry awaits a native anonymous VIEW acknowledgement with status OK and a ref, then uses replacement navigation to Home with the campaign query retained. It sends no customer identity and makes no local variant choice. Home’s LIVE native **Westfield Home messages** decision keeps the campaign rule first. It uses **Profile data → UTM Campaign → Is equal to → next_chapter** to replace its `CampaignHero` datasource with **Next chapter campaign**. The targeted heading is **A new chapter. Protection for what’s next.** The original Hero remains the no-UTM control.

The earlier direct-to-Home **UTM Campaign** test returned the original Hero first, then matched after the page view and reload. The verified design restores that native profile rule and places the acknowledged anonymous VIEW before Home. Preview acceptance at `c344ff72feb1774eb922d519567ec61232b9539e` passed a fresh `/demo` reset → actual Instagram ad click → `/campaign` → first Home document with campaign experience `77f8d59b…` and the correct datasource/heading. Fresh `unrelated_control` campaign entry and fresh plain Home visits selected the original Hero. A cold direct Home URL with only UTM parameters is outside this demonstrated first-arrival path.

| Native contract | Identity |
| --- | --- |
| Home page | `27da11a8-e0dc-42d4-9e3f-b4073306679b` |
| Home CampaignHero component UID | `dffe19de-2a6f-533e-aa5d-5891b093c491` |
| Campaign datasource | `a275f458-496b-40cc-8448-454980cfc4be` at `/sitecore/content/Westfield/westfield/Home/Data/Next chapter campaign` |
| Campaign experience | `77f8d59b-99dd-4451-9ecb-61d97905f04f` |

The preview first-document evidence above verifies this configured contract through the entry route. Production release evidence is recorded separately in the handoff and deployment metadata. The original Home now uses the official reference replica with nine native main placements and fourteen cards. Unsupported demo navigation destinations are authored as `#`; supported `/login`, `/advice` and `/search` journeys remain available. The existing native campaign UID, datasource and final rendering rules are retained. Frontend release and browser acceptance are recorded separately in handover evidence; the preview evidence above remains historical.

Existing customers use the Header **Login → Customer** option to reach the SSO-style local demo `/login`; header/footer navigation preserves allowed campaign parameters. Use `casey@example.com` or `jordan@example.com`, with the literal password `password`. This synthetic local acceptance gate is not production authentication. The password remains in the browser and is never serialized into a request or URL. After acceptance, the Cloud SDK establishes a fresh browser identity and sends the matching existing native identifier: `westfield-demo-unenrolled@example.invalid` for Casey or `westfield-demo-enrolled@example.invalid` for Jordan. Navigation waits for the native identity response and retains campaign attribution.

The destination remains `/paperless`, the existing native page now containing general MyWestfield account content. Its native false/true UDL-derived decision recommends **Sign up for paperless billing** to Casey and **Keep your coverage in step with life** to Jordan. The frontend does not store or submit an enrollment flag. Each accepted sign-in resets its browser identity automatically; sign in as the other customer through Login → Customer without returning to `/demo`.

Both Westfield stylesheets are imported from the Pages Router `_app.tsx` after the starter stylesheet. Roboto fonts are served from `public/westfield-assets`. Styling is scoped to the Westfield components; native layout fields and placeholders remain intact.

## Browsing affinity

Native page assignments use `westfield_interest:auto` for `/advice/new-driver-family-conversation` and `westfield_interest:home` for `/advice/water-leak-home-checkup` and `/advice/storm-season-household-checklist`. These are native affinity assignments, distinct from the Topic filter. Existing `CdpPageView` tracking remains unchanged.

The anonymous loop keeps one prepared visitor identity and inspects its native profile after each article: teen-driver Auto, water damage Home, then spring thunderstorm Home. The recorded native values were **Auto: 1 view / score 1.00**, then **Auto: 1 / 0.50 and Home: 1 / 0.50**, then **Home: 2 / 0.67 and Auto: 1 / 0.33**. Show the VIEW in Engagement and the changing values under Overview → Top affinities at each step. These are recorded observations, not a promised scoring formula.

Updates are near real time; the observed processing delay was about 60 seconds. Use Engagement → Reload sessions, then Overview, or return to Profiles and reopen the same Client ID if the event has not appeared. Wait for the storm VIEW and Home’s second view before returning Home with the logo. The authored **Home interest** Hero datasource (`c7a71385-78d1-43ae-a756-fdcb5c60b953`) contains **Protection for the place you call home.** The **Westfield Home messages** personalization is Live: the preserved Instagram campaign is rule 1, and rule 2 uses **Top Affinity**, name `westfield_interest`, value `home`, **Is true**. Run affinity before Instagram so campaign context does not mask the behavior example.

**Observed:** native profile collection and growth, a matching Home-affinity rule, and the Home-interest hero in a fresh Home response and browser view, plus the Live Westfield Home messages configuration. **Acceptance still pending:** a fresh complete browsing rehearsal, reload and neutral/Auto controls, campaign precedence after the affinity loop, and Casey/Jordan regressions. Keep those checks distinct from the successful collection observations. No custom analytics payload, localStorage score, or frontend variant choice was added.

The imported Casey/Jordan records stand in for customer information from another system. CRM integration is discussed at product level; no live CRM connector or synchronization workflow is demonstrated. See `demo/westfield/README.md` for the scoped native inventory and presenter sequence.

## Personalization boundary

The starter middleware composes MultisiteMiddleware, RedirectsMiddleware and PersonalizeMiddleware. The two native synthetic imports (2/2), Published Boolean custom value, LIVE customer decision and native campaign attribution were verified previously. This revision's `c344ff72` preview acceptance additionally passed Casey's first `/paperless` document (`8b9a9b8e…`, Paperless offer, **Sign up for paperless billing**) and Jordan's (`901e3b8f…`, Paperless enrolled, **Keep your coverage in step with life**). All six supported UTMs survived Instagram → entry → Home → Header login → account, and both Vercel preview checks passed. These are bounded preview results; production release evidence belongs to the handoff and deployment metadata.

Inherited CMS-page SDK initialization and page-view events are disabled in development and Sitecore editing/preview modes. The tested Vercel preview serves a normal website session; the application entry initializes the Events SDK explicitly. No UDL connector, fake customer-profile fixture, or real enrollment transaction is implemented in this frontend.

The native `westfieldPaperlessEnrolled` extension and native rule select the CMS datasource and finite presentation export. `Default` and `Quiet` do not encode customer state. The demo form supplies only an allowlisted synthetic identity after local acceptance; it does not authenticate against the real MyWestfield service.

## Ownership and removal

All frontend, login assets and Instagram prop files remain inside this Westfield head. Developer-only profile preparation, docs and Instagram provenance are under the repository's `demo/westfield`. Normal builds do not import/reset profiles or seed authored content. Use `node scripts/sites.mjs plan-remove westfield` from the repository root to inspect the separate source/native/media/hosting/profile/DAM boundaries before any deliberate retirement; preserve shared environment resources and later author changes.

For the browsing-interest addition, the lifecycle inventory records the three exact page affinity assignments, the new Home decision rule, and the page-local Home interest datasource. Review `sites.manifest.json` → Westfield → `bindings.profiles.browsingAffinity` before retirement. Preserve the original Home/campaign rules and content, the existing articles, unrelated affinity values, shared profiles, and the built-in Top Affinity condition. See `demo/westfield/README.md` for the removal boundary.

The owned custom condition **Westfield next chapter arrival** (`ccecd5b4-d31b-46c1-862a-db6b23e21106`, friendly ID `westfield_next_chapter_arrival`) remains Published but unused by the active Home decision, with native usage count zero verified. Retain it in the cleanup inventory and recheck references before a separate unpublish/retirement. Its developer source is not imported by the frontend.
