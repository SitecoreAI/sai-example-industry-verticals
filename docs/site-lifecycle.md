# Site inventory and retirement

`sites.manifest.json` records 18 independent frontend heads, source provenance, source-configured rendering-host keys, serialization module mappings and shared dependencies. Remote bindings remain `unverified` until checked against the actual environment. Westfield's collection/site identity, 71 serialized native definition item identities and four native CMS media IDs/paths are verified. API content seeding, scoped publication, two synthetic profile imports and the public Vercel deployment are verified. Authenticated Page Builder UI, editing-host readiness, the native profile-derived first-render decision and DAM selection remain unverified. Null IDs and empty ownership lists mean unknown; they do not mean that resources are absent.

The new Westfield head comes from the neutral starter. Its independent source-configured host key is `westfield`, with app path `industry-verticals/westfield`; the native editing host is created with deployment in progress, and the separate Vercel live site is verified. The original `starter` directory is a scaffold with no source-configured rendering host. The old Westfield luxury-retail branch is excluded.

## Read-only tools

Run these commands from the repository root:

```sh
node scripts/sites.mjs list
node scripts/sites.mjs check
node scripts/sites.mjs plan-remove westfield
```

The tool reads repository files only. It does not contact Sitecore or a hosting service, show environment secrets, modify files or the Git index, remove resources, create hosts or implement remote lifecycle automation. `plan-remove` prints a bounded inventory and review plan; it executes nothing.

`check` verifies unique site/app/host ownership, the build configuration's exact host mappings, module file/namespace mappings, declared dependencies, definition deployment inclusion, overlapping exclusive ownership claims and separation of ordinary deployment from seed content. Site-owned module includes must stay within the declared definition scopes. It exits nonzero for structural/configuration errors. Remote `unverified` states are reported as warnings, never promoted to verified by a passing source check. Missing host mappings, missing definition deployment or ordinary seed post-actions are errors.

The deprecated `scripts/setup-editing-hosts.js` now accepts only `--site <site-id>` for read-only guidance, or `--help`. It never invokes a CLI/API, reads secrets, creates hosts or sets environment variables. It prints the exact manifest host key and a manual creation-command template requiring a verified authoring environment ID; inspect installed CLI help and existing hosts before running any separate command. There is no all-sites or noninteractive creation default.

## Release ownership

Keep frontend deployment, developer-owned native definitions, and authored content/publication as separate release paths. Ordinary code/definition releases must not push initial content/media seed modules. Seed or restore content only through a separate, deliberate operation with an exact module/site boundary and a recoverable baseline.

The imported sites retain their shared `Project.IndustryVerticals` dependency. Westfield has its independent `Project.Westfield.Definitions` module under `authoring/items/westfield`, covering its templates, branches and renderings beneath their `Project/Westfield` roots. Its three developer-owned placeholder definitions are the exact `Header`, `Main` and `Footer` items under `/sitecore/content/Westfield/westfield/Presentation/Placeholder Settings`, each with a narrow `singleItem` include. The module excludes the former global Westfield placeholder root and does not deploy a broad Presentation subtree. It has no inherited IndustryVerticals module dependency. Shared platform/SXA definitions still remain outside Westfield ownership.

Westfield's verified collection path is `/content/Westfield`; its native site path is `/sitecore/content/Westfield/westfield`. The verified CMS Media folder is `/sitecore/content/Westfield/westfield/Media`. The verified asset upload folder is `/sitecore/media library/Project/Westfield/westfield` (ID `021d0cbd-401f-47d2-a9d1-3c8dd7a223ea`). Its four uploaded assets are recorded individually in the manifest. The Authoring API identity audit confirms all 71 serialized definition items in master, including 29 datasource fields across five components. The initial scoped Experience Edge publication finished successfully with 255 processed items. Native field rendering and media delivery are separately verified; existence, API save/reload and publication do not prove Page Builder editing UI. Existing initial seed modules are inventoried with unassigned site ownership because a module label alone does not prove which frontend consumes it. Inspect native site grouping, rendering-host and datasource references before assigning ownership.

The generated site Placeholder Settings context folder is `11b33eb2-44e2-4447-a6ea-4a49a1972b7d`. It is outside the definition include and definition-only retirement boundary. The serialized placeholders are only the exact Header, Main and Footer descendants. The old global folder ID `0048bf16-24ee-491e-ac28-9ca82eeb912f` is not a site-folder binding and is not part of this package. The contracts inventory follows the current `siteHeader`, `siteMain` and `siteFooter` source include paths.

When adding a head, record its actual app path, exact configured host key, source branch/commit, module dependencies, proven owned resources and remote verification evidence. Do not derive native paths or IDs from the frontend directory name. Update the manifest when adding a module or changing a binding. Keep credentials outside the manifest and documentation.

## Retire one site

Generate `plan-remove <site>` and resolve every unknown binding before preparing a concrete removal change. Preserve a restorable source/native baseline and the authored content that needs retaining. Inventory references from other sites and languages before treating content, definitions or media as exclusive.

Prepare the source change around the single app directory, exact host mapping, manifest entry and proven exclusively owned modules. Shared definitions, shared media, common serialization roots, shared profile scopes and DAM assets stay in place. A site path nested beneath a shared serialization root requires reviewing the module's include/rule scopes; deleting a folder does not automatically establish a safe native deletion boundary.

Review native site content and publication separately from code. Review media references separately from the content tree. Verify the live/editing-host project, aliases and DNS before any hosting removal. For profiles and personalization, identify this site's actual scope, decisions, experiments and synthetic records; avoid unrelated records and shared scopes. If DAM is used, verify concrete collections/assets and all consumers before retiring exclusive resources.

After authorized removal, check surviving sites, native editing, publication/search references and remaining host aliases. Record completed actions, retained dependencies, verification evidence and restoration steps. The repository tools provide the inventory and plan; remote operations remain separate actions with their own verified targets.

## Westfield synthetic profile tooling

Developer-only profile import preparation is scoped to `demo/westfield`. The two JSONL inputs and validator accept only the two fixed synthetic `example.invalid` identities and the Boolean extension `westfieldPaperlessEnrolled`. The script is outside frontend assets and ordinary builds. Its offline validation makes no network request; remote import/reset commands are separate deliberate operations after native schema, identity provider and API access are verified. No private environment file is copied into the repository.

## Consolidated native source definitions

The shared foundation manifest records every stored source path, native item path and item ID for 150 added definitions: 10 from Allianz, 134 from Cenovus and 6 from Textron. Of these, 148 remain in active definition source. Textron's two legacy global placeholder items are stored under `demo/textron/legacy-definitions`, outside active serialization, with their original source paths retained in the manifest. The YAML bytes and original native paths/IDs remain unchanged for provenance. Existing files, the modified shared PageHeader rendering and authored Presentation snapshots were excluded. Source import does not prove native deployment.

The existing shared PageHeader rendering keeps main's direct field resolver. Luxury Retail, Cenovus, MNP and Worley consume `Title`/`Content` fields with native route-field fallback. Textron additionally accepts its GraphQL datasource and `Page Title`/`Page Content` field formats, then falls back to those legacy fields and native route fields. The retail head does not currently register a PageHeader component. Any future shared GraphQL/datasource-template migration requires compatible field handling and native authoring verification across the affected heads; a separate Textron-scoped rendering can isolate that contract.

Textron's legacy global `headless-main` placeholder has broad allowed controls and conflicts with existing global layout-key usage. Both it and its `Layout Placeholders` parent item are quarantined. They must stay outside the active definition package until the actual Textron site binding is inspected and an explicitly scoped replacement is prepared. No Textron native site path is inferred. The checker validates active imported parents using active source only; isolated quarantined parents may resolve against their quarantined set or the active baseline. Do not treat contribution paths as permission to change another site's placeholder binding or to delete shared definitions during retirement.

## Westfield native media and shared DAM

These are native CMS media uploads from public reference assets, not Content Hub DAM uploads. Binary sizes and source hashes were verified; native dimensions match for PNG/JPEG. SVG dimensions come from its source attributes/viewBox. The upload receipts did not publish assets by themselves. The later initial scoped publication finished successfully with 255 processed items; all four distinct native Edge image GETs returned 200 and native field images loaded in the public browser. Direct authoring Image picker selection and DAM Image selection remain unverified.

| Asset | Native CMS media ID | Source dimensions |
| --- | --- | --- |
| Home hero | `04ed27e2-8b90-42d3-96cf-daf6f81d307f` | 590 × 469 |
| MyWestfield | `e7e77f20-5f33-4a7d-b33e-4976391e3ca9` | 690 × 512 |
| Header logo | `894ad5a1-0e80-4c08-a2f5-d1713d822a49` | 288 × 56 |
| Footer logo | `01566ecc-9bc3-4281-8c50-9ccedc59c4b0` | 210 × 41 |

The selected DAM target is the existing shared `https://thlt-demo.sitecoresandbox.cloud` instance, with new Westfield-only collections and assets. The CM connector remains unchanged. The active head's `demo/dam-assets.json` is planning/provenance metadata with four core assets in its initial upload scope; null DAM IDs, approval, public delivery and native DAM selection are unverified. Both the configured service-account password grant and one authorized demo-password grant returned HTTP 401 at `/oauth/token`. No Content Hub API reads or mutations succeeded. Do not infer upload permissions or credential validity from the presence of CM connector settings.

The [documented password grant](https://doc.sitecore.com/ch/en/developers/cloud-dev/oauth-tokens.html#resource-owner-password-credentials-grant) authenticates before [Content Hub REST operations](https://doc.sitecore.com/ch/en/developers/cloud-dev/rest-apis.html). [Upload API security](https://api-docs.sitecore.com/ch/upload-api) depends on access to the configured upload entity. Supported access must be restored through normal Content Hub login or the authorized service integration before the DAM work can proceed. No account, global theme/Brand Kit, shared taxonomy, access configuration or connector change is included in the site asset scope.

## Westfield retirement boundary at this audit

`plan-remove westfield` remains a review plan. It must preserve the shared authoring environment, Content Hub instance, CM DAM connector/service account, platform/SXA definitions, global theme/Brand Kit, access settings and all unrelated assets/sites. The collection root `/sitecore/content/Westfield` is not a blanket deletion scope; inspect collection references and surviving sites before considering its retention/removal.

Source review covers only `industry-verticals/westfield`, `authoring/items/westfield`, `demo/westfield`, the exact `westfield` rendering-host mapping and Westfield's manifest/module records. Review the three definition roots and exact site placeholder descendants separately from authored site content. Recheck each native ID/path and inbound references in every relevant language/version; export a recoverable baseline before any authorized retirement.

Media review starts with the four IDs above and their dedicated upload folder, then checks CMS image fields, other sites, public links and any DAM copies. A matching hash does not establish exclusive ownership. DAM retirement currently has no created collection or asset IDs to remove. If later added, record their exact IDs and references before retiring only exclusive Westfield resources. Preserve all shared connector/settings and unrelated collection memberships.

The verified public host/project/deployment, two imported synthetic profile IDs and two alternate datasource IDs are now in the manifest. Recheck them and all references at retirement time. Editing-host readiness, authenticated native editing UI, profile/session hydration and native personalization decisions remain unresolved. Retain shared profiles and scopes. Source checks or a successful media upload never authorize remote deletion or establish that host/DAM/personalization cleanup is complete.

## Handoff verification snapshot — 2026-10-14 22:58 UTC

The public site is [thlt-westfield-demo.vercel.app](https://thlt-westfield-demo.vercel.app). Vercel production is `READY`, project `prj_sgKSs3x35g8zI31gBAswDJPznSeo`, deployment `dpl_DvcbsvCBHpUoo9zS3AdpmNNMM7Bq`, built from main commit `7b326c6d1f974b02a10adedd2ac661eb1c7faeb6`. Uncommitted review fixes are outside that deployed commit. The native editing host environment `6Is64ZrdfzLpF1nDBtUSxd` exists; its current deployment is still in progress (build status 2, deployment status 1), so Page Builder readiness is unverified.

| Area | Proven evidence | Remaining proof |
| --- | --- | --- |
| Definitions and initial content | All 71 serialized identities/paths; 29 datasource fields; native rendering datasource/template/parameters fields; five site variant groups/six variants; shared partials, site palette, page design and branch provisioned via API | Page Builder palette/datasource/variant UI and fresh author Create page |
| Authoring | Initial native field save/reload and branch Data identity checks passed through API | Authenticated text/RichText/Link/Image editing, direct pickers, UI save/reload and republish |
| Publication and media | Initial publication `FINISHED`, 255 processed, no failure; four native image GETs 200 and browser images loaded | Direct authoring Image picker; DAM approval/delivery/native selection |
| Live desktop | Five public routes 200; native fields for all five components; width 1440 Home → Explore paperless click, images loaded and no overflow | Final browser regression after pending review fixes |
| Live mobile | Width 390 Home/Paperless no overflow; Main navigation opens and Home click works | Instagram currently overflows: scroll width 712 at viewport 390; overall mobile QA is partial |
| Profiles and launcher | Two synthetic profiles imported successfully (2/2, zero failures); Casey launcher completed a fresh SDK browser identity and identity event before redirecting to Instagram | Profile flag hydration, ingestion/attribution receipts and native first-render decision effects |
| Personalization | Two native CampaignAction datasources saved/reloaded and separately published successfully (2 processed); original layout unchanged | Native profile-derived decision is unconfigured; public campaign correctly remains neutral |
| DAM | Existing shared connector preserved; Westfield-only planning manifest and four source hashes ready | Normal supported Content Hub access: service authentication returned HTTP 401, so no DAM reads/writes or collection/asset IDs exist |

API provision/publication proof clears the earlier pending setup steps for partials, variants, available renderings, page design and page branch. It does not clear UI proof. Default/Quiet are finite presentation variants; the two alternate datasource copies and imported paperless flags do not implement or prove a native personalization decision. First-render enrolled/unenrolled differences and campaign attribution remain unverified until configured and observed through the native authoring/personalization workflow.
