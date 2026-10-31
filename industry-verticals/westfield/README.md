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

`/demo` is a preparation-only guide. First choose **Prepare anonymous browsing session** and copy the installed SDK’s native Client ID. The reset initializes the cookie and calls public `getBrowserId()` but sends no VIEW, so a profile may not exist yet. Next choose **Open Home** in that same public-site session to record the baseline VIEW. Then use **Optimization → Profiles** inside the existing signed-in Sitecore app tab: select Client ID, paste the full value, press Enter, and open the matching profile. The direct Profiles URL is a backup because a new tab can stall while establishing its Sitecore session. After finding the profile, prepare Articles and the static Instagram feed; opening the feed sends no VIEW. Keep Page Builder ready separately.

Client ID readback occurs only after initialization; a missing ID produces a retry message. The guide contains no profile data, scoring, or audience logic. The live order is Home, browsing affinity, Instagram, Casey/Jordan, and authoring, with no return to `/demo`.

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

The current sign-in destination is Home’s MyWestfield section (`/#mywestfield`), retaining the six allowlisted campaign parameters before the fragment. This supersedes the former `/paperless` destination. Home’s existing **MyWestfield** feature presents **Sign up for paperless billing** with **Explore paperless billing** to Casey, and **Keep your coverage in step with life** with **Find your agent** to Jordan. The native false/true paperless-status decision selects the CMS content; the frontend does not store or submit an enrollment flag. The anonymous section and the separate Hero’s campaign/affinity decisions stay independent. `/paperless` is no longer the customer-personalization surface.

For the live loop, choose **Login → Customer**, sign in as Casey, and show the MyWestfield section where Home opens. Choose **Logout**, then **Login → Customer**, and sign in as Jordan. Show the different recommendation in the same homepage section. Logout starts an anonymous demo session, returns Home, and restores Login. No step returns to `/demo`.

Configured native bindings: the existing HomeFeature UID `ceb6d59c-ed55-55ea-adeb-db03545ef0ea` has saved `RenderingIdentifier=mywestfield`. The native **Westfield customer recommendations** table has been cloned and started. Its false rule uses experience `df9c0468-68ab-478c-afdf-b610877c4376` with Home’s page-local offer datasource `2be1df85-fa1a-49f5-bcbc-c637add16adf`; its true rule uses experience `1f9ec6a9-48da-4cd6-bf61-ecd2fcc34dc5` with enrolled datasource `ab765ace-3f93-4dbc-821b-195ce920a62a`. The original HomeFeature datasource remains the anonymous fallback. The Authoring API verified the saved datasources and anchor.

The former **Westfield paperless enrollment** table is paused. Only its personalized rules were removed from `/paperless` final presentation; the page’s neutral shared presentation remains intact. The HomeFeature sidebar now shows **PERSONALIZED LIVE**.

Current status: **native-live-preview-verified**. Actual public-preview UI checks at `5f8181db71850b73f0c56aeec0cb759051f27ff4` observed original anonymous Home, Casey’s first Home arrival at `#mywestfield` with the paperless offer, refresh persistence, and Logout restoring anonymous Home and Login. Jordan’s sign-in returned to the same homepage section with the coverage recommendation and retained it after refresh; `/paperless` showed neutral content for Jordan. Both customer experiences retained the original **MyWestfield** presentation without experience-level variant overrides.

Current preview regression: normal teen-driver → water-damage → storm-article navigation selected the Home-interest hero. The actual Instagram entry retained its UTM parameters, but the first Home document still showed that interest message. After profile attribution propagated, one reload of the same URL selected the campaign hero, approximately two minutes later in this run. The Hero table stayed Live with campaign row 1 and affinity row 2; its rules were unchanged. This does not verify an immediate first-document campaign change or a guaranteed delay. For rehearsal recovery, show the prepared native campaign rule, then return to Home and reload once after attribution has caught up. Production deployment and stable-host acceptance are recorded separately in the release handoff; this preview evidence does not establish those results.

Both Westfield stylesheets are imported from the Pages Router `_app.tsx` after the starter stylesheet. Roboto fonts are served from `public/westfield-assets`. Styling is scoped to the Westfield components; native layout fields and placeholders remain intact.

## Browsing affinity

Native page assignments use `westfield_interest:auto` for `/advice/new-driver-family-conversation` and `westfield_interest:home` for `/advice/water-leak-home-checkup` and `/advice/storm-season-household-checklist`. These are native affinity assignments, distinct from the Topic filter. Existing `CdpPageView` tracking remains unchanged.

The anonymous loop keeps one prepared visitor identity and inspects its native profile after each article: teen-driver Auto, water damage Home, then spring thunderstorm Home. The recorded native values were **Auto: 1 view / score 1.00**, then **Auto: 1 / 0.50 and Home: 1 / 0.50**, then **Home: 2 / 0.67 and Auto: 1 / 0.33**. Show the VIEW in Engagement and the changing values under Overview → Top affinities at each step. These are recorded observations, not a promised scoring formula.

Updates are near real time; rehearsal updates took several seconds to about a minute, with no guaranteed delay. Use Engagement → Reload sessions, then Overview, or return to Profiles and reopen the same Client ID if the event has not appeared. Wait for the storm VIEW and Home’s second view before returning Home with the logo. The authored **Home interest** Hero datasource (`c7a71385-78d1-43ae-a756-fdcb5c60b953`) contains **Protection for the place you call home.** The **Westfield Home messages** personalization is Live: the preserved Instagram campaign is rule 1, and rule 2 uses **Top Affinity**, name `westfield_interest`, value `home`, **Is true**. Run affinity before Instagram so campaign context does not mask the behavior example.

**Historical acceptance, October 31, before the homepage customer-message change:** a second fresh anonymous visitor saw the neutral Home, navigated through all three articles with matching native profile growth, and returned through the logo to the Home-interest hero. The same browser then followed the actual Instagram ad and saw the campaign hero on the first Home arrival. The native Westfield Home messages configuration is Live. Casey’s following first arrival at the former `/paperless` destination showed the paperless offer and Explore paperless billing action; Jordan’s next sign-in showed the coverage message and Find your agent action. The native Auto filter returned the single teen-driver article, and Home returned four matching articles including water damage and spring thunderstorm. These browser observations are separate from the frontend guide release checks. No custom analytics payload, localStorage score, or frontend variant choice was added.

The imported Casey/Jordan records stand in for customer information from another system. CRM integration is discussed at product level; no live CRM connector or synchronization workflow is demonstrated. See `demo/westfield/README.md` for the scoped native inventory and presenter sequence.

## Personalization boundary

The starter middleware composes MultisiteMiddleware, RedirectsMiddleware and PersonalizeMiddleware. The two native synthetic imports (2/2), Published Boolean custom value, LIVE customer decision and native campaign attribution were verified previously. Historical `c344ff72` preview acceptance additionally passed Casey's first `/paperless` document (`8b9a9b8e…`, Paperless offer, **Sign up for paperless billing**) and Jordan's (`901e3b8f…`, Paperless enrolled, **Keep your coverage in step with life**). All six supported UTMs survived Instagram → entry → Home → Header login → account, and both Vercel preview checks passed. These bounded preview results describe the former destination; they do not establish acceptance of the current homepage customer-message change. Current production release evidence belongs to the handoff and deployment metadata.

Inherited CMS-page SDK initialization and page-view events are disabled in development and Sitecore editing/preview modes. The tested Vercel preview serves a normal website session; the application entry initializes the Events SDK explicitly. No UDL connector, fake customer-profile fixture, or real enrollment transaction is implemented in this frontend.

The native `westfieldPaperlessEnrolled` extension and native rule select the homepage MyWestfield datasource. The `MyWestfield` rendering variant supplies its presentation; it does not encode customer state. `Default` and `Quiet` remain independent CampaignAction presentation options. The demo form supplies only an allowlisted synthetic identity after local acceptance; it does not authenticate against the real MyWestfield service.

## Ownership and removal

All frontend, login assets and Instagram prop files remain inside this Westfield head. Developer-only profile preparation, docs and Instagram provenance are under the repository's `demo/westfield`. Normal builds do not import/reset profiles or seed authored content. Use `node scripts/sites.mjs plan-remove westfield` from the repository root to inspect the separate source/native/media/hosting/profile/DAM boundaries before any deliberate retirement; preserve shared environment resources and later author changes.

For the browsing-interest addition, the lifecycle inventory records the three exact page affinity assignments, the new Home decision rule, and the page-local Home interest datasource. Review `sites.manifest.json` → Westfield → `bindings.profiles.browsingAffinity` before retirement. Preserve the original Home/campaign rules and content, the existing articles, unrelated affinity values, shared profiles, and the built-in Top Affinity condition. See `demo/westfield/README.md` for the removal boundary.

The owned custom condition **Westfield next chapter arrival** (`ccecd5b4-d31b-46c1-862a-db6b23e21106`, friendly ID `westfield_next_chapter_arrival`) remains Published but unused by the active Home decision, with native usage count zero verified. Retain it in the cleanup inventory and recheck references before a separate unpublish/retirement. Its developer source is not imported by the frontend.
