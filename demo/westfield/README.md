# Westfield synthetic demo journey and profile tooling

This developer-only folder is separate from the frontend and ordinary build/deployment commands. It contains no credential or private environment file.

## Presenter journey

The 22-minute demonstration runs **Home (1 minute), browsing affinity (5 minutes), Instagram (2 minutes), Casey/Jordan (5 minutes), and authoring (9 minutes)**. The presentation remains 50 minutes plus 10 minutes for questions. `/demo` is a preparation guide, not a destination used during the live demonstration.

Before presenting, use a fresh public-site browser session, separate from signed-in Sitecore and Content Hub. On `/demo`, **Prepare anonymous browsing session** uses the existing session reset, then reads the installed SDK’s public `getBrowserId()` after initialization. Copy that native **Client ID** and search for it in [Sitecore Profiles](https://app.sitecorecloud.io/optimization/profiles?organization=org_JypIqqJsbEly6gh2&tenantId=76ac4984-cff8-4b3d-3071-08ded696f4f5). Prepare Home, Articles, Instagram, the matching profile, and Page Builder tabs. The guide displays no profile or score, and stores no audience logic. The anonymous Client ID is no longer the active identity after customer sign-in, which deliberately creates a fresh browser identity.

1. Show the fresh standard Home hero: **Reliable Insurance, Real Peace of Mind**.
2. From Articles, use **Article Tags → Auto** and open **A Guide to First-Time Auto Insurance for Your Teenager**. Inspect this same native profile in **Engagement** for its VIEW, then **Overview → Top affinities**. The recorded result was **Auto: 1 view, score 1.00**.
3. Return through the article’s Articles breadcrumb. Select **Home** and open **How To Help Prevent Water Damage in Your Home or Business**. Inspect the same profile again. The recorded result was **Auto: 1 view, score 0.50; Home: 1 view, score 0.50**.
4. Return through Articles and open **How To Prepare Your Home and Family for a Spring Thunderstorm**. Inspect the same profile once more. The recorded result was **Home: 2 views, score 0.67; Auto: 1 view, score 0.33**. These are observed values from the native rehearsal, not a promised scoring formula or fixed increment. Show the profile after each article so the audience can follow its growth.
5. Wait until the storm VIEW and Home’s second view are recorded, then return Home with the Westfield logo. The Home-interest hero is **Protection for the place you call home.** Explain the native rule in the prepared Page Builder tab. The rule matched the same native profile, and a fresh Home response and browser view showed that hero. **Remaining acceptance:** a fresh complete browsing rehearsal, reload and neutral/Auto controls, and existing campaign/customer regressions.
6. Switch to the prepared Instagram feed. Find the single sponsored Westfield prospect post among unrelated friend posts. Click **Learn more** on **A new chapter. Protection for what’s next.** The entry at `/campaign?utm_source=instagram&utm_medium=social&utm_campaign=next_chapter` awaits an acknowledged native anonymous VIEW, then opens Home. The existing native campaign rule selects its matching Hero. Keep this after browsing affinity so retained campaign context does not mask the interest example. Its precedence still needs a regression check against the now-populated affinity profile.
7. On Home, choose **Login → Customer**. Enter `casey@example.com` and `password`, then show **Sign up for paperless billing**. Choose Login and Customer again and enter `jordan@example.com` with the same password. Show **Keep your coverage in step with life**. Each accepted login resets its browser identity automatically; there is no mid-demo visit to `/demo`.
8. Use the native Advice Article authoring loop: create the blank article, choose approved DAM media, fill and reorder independent Sections, preview, publish, and find the live page through Articles or search. This remains the nine-minute authoring slot.

Profile updates are near real time. The observed processing delay was about 60 seconds. If the next VIEW is missing, use **Engagement → Reload sessions**, then return to **Overview**. If needed, return to Profiles and reopen the same profile using its full Client ID. Wait for the new event and updated values before describing the change; do not promise instant processing.

CRM integration is a product discussion. The two imported synthetic records represent customer information from another system; the demonstration does not show a live HubSpot connection, ongoing synchronization, or a completed billing transaction. Header search and complete source articles remain available as supporting navigation rather than a separate timed search loop.

## Browsing-affinity configuration and acceptance

The native page assignments use the Westfield-scoped affinity name `westfield_interest`:

| Page | Native item ID | Value |
| --- | --- | --- |
| Teen-driver article | `5d45a5c5-330e-46e2-a9db-fe61347537d3` | `auto` |
| Water-damage article | `970c651f-631b-484f-ba98-8db6ea753501` | `home` |
| Spring-thunderstorm article | `5f12387e-a1b9-45b8-b2ed-77d98e5649f4` | `home` |

These assignments are separate from the articles’ Topic filter. Existing native CMS-page VIEW events carry their page-variant identity; this revision does not add a custom tracker, browser score, or local audience condition.

The page-local **Home interest** datasource is `c7a71385-78d1-43ae-a756-fdcb5c60b953`, at `/sitecore/content/Westfield/westfield/Home/Data/Home interest`, using the existing CampaignHero template. It contains **Protection for the place you call home.** and a copy of the original Hero image binding. Keep the original Home and existing campaign datasource intact. The native **Westfield Home messages** personalization is Live. Its existing campaign rule remains first; the new Home-interest rule is second and uses **Condition → Top Affinity**, value `home`, name `westfield_interest`, **Is true**. The affinity rule UID is `00861e65-3c63-4600-b766-7c981922f382` and its experience ID is `f1161705-8ce9-497b-9b41-20a517a28c3b`. The Home page is `27da11a8-e0dc-42d4-9e3f-b4073306679b`, and its CampaignHero component UID remains `dffe19de-2a6f-533e-aa5d-5891b093c491`. The exact Optimization flow ID is not yet verified; rule, experience, and datasource IDs are not substitutes for it.

Current state: **native profile growth, matching Home rule, and returned Home-interest hero observed; Westfield Home messages Live**. The same anonymous profile recorded `auto:1 / score:1.00`, then `auto:1 / 0.50` and `home:1 / 0.50`, then `home:2 / 0.67` and `auto:1 / 0.33`. The same profile matched rule 2, and a fresh Home response and browser view showed its Home-interest hero. **Still pending:** a fresh complete browsing rehearsal, reload and neutral/Auto controls, campaign precedence after the interest loop, and Casey/Jordan regression acceptance. A successful VIEW or a stored affinity alone does not establish every returned-content and regression check. If those checks fail, identify retained screens as a walkthrough.

The original Home now uses the official reference replica with nine native main placements and fourteen cards. Unsupported demo navigation destinations are authored as `#`; supported account, Advice and search journeys remain available. The existing native campaign rule and datasource are retained. Frontend release and browser acceptance are recorded separately in handover evidence; the preview evidence above remains historical. The prospect ad does not ask for a login or pitch paperless enrollment.

| Demo login | Existing native email identifier | Native Boolean | Expected recommendation |
| --- | --- | --- | --- |
| `casey@example.com` | `westfield-demo-unenrolled@example.invalid` | false | Sign up for paperless billing |
| `jordan@example.com` | `westfield-demo-enrolled@example.invalid` | true | Keep your coverage in step with life |

The login is a synthetic local acceptance gate, not production authentication. The password is checked in the browser and never placed in a network payload or URL. Successful local acceptance triggers a real Sitecore Cloud SDK identity event containing only the allowlisted native identifier. It does not create an authenticated production account session. The `westfieldPaperlessEnrolled` value stays on the native profile; the frontend does not store, submit or choose a local copy of that flag. Native personalization evaluates it to select the CMS datasource/presentation.

After the single identity event is acknowledged, the demo waits for the fresh browser's native guest reference to change from its anonymous reference before opening the account page. It uses the installed SDK's public [getGuestId lookup](https://doc.sitecore.com/sdk/en/developers/005/cloud-sdk/cloud-sdk-reference/cloud-sdk-core/cloud-sdk-core-browser/functions/cloud-sdk-core-browser-getguestid.html), with a six-second deadline and retry backoff. A timeout keeps the login form open with a retry message. This guard assumes both demo accounts already have imported profiles. The lookup is documented for testing/debugging; it does not prove that every downstream decision read is ready, so first-arrival browser checks remain required. No enrollment flag, component variant, or destination is chosen by this guard.

The native profile imports (2/2), Boolean custom-value tests and LIVE customer decisions were verified previously. This revision's preview acceptance at `c344ff72` also passed fresh campaign first-Home targeting, mismatched-campaign and plain-Home controls, and both Casey/Jordan first account documents. All six supported UTM parameters were preserved through Instagram → entry → Home → Header login → account. Both Vercel preview checks passed. Production release evidence is recorded separately in the handoff and deployment metadata. Exact native campaign identifiers are recorded in the Westfield head README.

The earlier direct-to-Home profile-based UTM test returned the original Hero first and matched after a page view and reload. The verified design retains the native profile UTM rule and records the anonymous VIEW through `/campaign` before Home. A cold direct Home URL with only UTM parameters is outside the demonstrated first-arrival path; no local content switch substitutes for the native decision.

`instagram-asset-provenance.json` records the eight unchanged friend-story/post assets reused from the supplied ZIP. They are static prop assets, separate from the CMS/DAM asset inventory.

## Profile preparation

`tools/profile-import.mjs` accepts exactly these two synthetic identities:

- `westfield-demo-unenrolled@example.invalid`
- `westfield-demo-enrolled@example.invalid`

The only profile extension accepted is the Boolean `westfieldPaperlessEnrolled`. Initial contacts use the fixed synthetic names in the allowlist. The reset input restores the two baseline flags; it does not delete profiles.

With Node.js 24 or later, run offline validation from any directory:

```sh
node demo/westfield/tools/profile-import.mjs validate --provider OFFLINE_VALIDATION_ONLY
```

This validates the files and prints checksums without a remote request. The example provider proves syntax only. Actual imports require the exact provider from an existing native identity rule, a published Boolean extension schema, the verified tenant Profile Import endpoint, and `SITECORE_PROFILE_IMPORT_API_KEY` in the process environment. Keep that private key outside source control, public/browser variables and command-line arguments.

Use `--help` to inspect deliberate upload/reset/status/results commands. No remote import is performed by validation, normal frontend builds or lifecycle inventory tooling. A queued batch is not proof of profile synchronization: inspect its results, the native profiles, identity linkage and live component decisions before claiming success.

The tool and input files were ported from the earlier working demo checkout; they contain no runtime personalization fixture. The existing target's native identity/schema/import bindings were verified in the prior release. Recheck the actual environment and provider before any deliberate repeat import/reset; ordinary releases do not run these commands.

## Ownership and removal

This folder, the independent `industry-verticals/westfield` head and its `public/instagram` prop are all Westfield-scoped. The lifecycle manifest records native resources separately. Removing source files does not authorize deleting profiles, CMS content, DAM assets or shared environment resources; use the read-only site removal plan and resolve references first.

For browsing-affinity retirement, inventory only the `westfield_interest` assignments on the three exact article IDs above, rule 2 of the Home CampaignHero decision, and the **Home interest** datasource `c7a71385-78d1-43ae-a756-fdcb5c60b953`. Recheck current consumers and inbound references before changing them. Remove the added rule or its dependent input only when no retained rule uses it; preserve the original Home, existing campaign rule and datasource, the article pages, unrelated affinity assignments, shared profiles, and shared settings. The rule uses the shared built-in Top Affinity condition; that built-in condition is not Westfield-owned. The exact lifecycle inventory is under `bindings.profiles.browsingAffinity` in `sites.manifest.json`.

The owned custom condition **Westfield next chapter arrival** (`ccecd5b4-d31b-46c1-862a-db6b23e21106`, friendly ID `westfield_next_chapter_arrival`) is retained unused and Published at this snapshot, with native usage count zero verified. It is not part of the active Home rule. Recheck references before any separate unpublish/retirement; its developer source is not imported by the frontend.
