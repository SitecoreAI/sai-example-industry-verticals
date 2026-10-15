# Site inventory and retirement

`sites.manifest.json` records 18 independent frontend heads, source provenance, source-configured rendering-host keys, serialization module mappings and shared dependencies. Remote bindings remain `unverified` until checked against the actual environment. Westfield's collection/site identity, 72 serialized native definition identities and four native CMS media IDs/paths are verified. API seeding/publication, two synthetic profile imports and the public deployment are verified. Native Page Builder field editing, page insertion, order restore and one actual DAM Image selection passed. Native LIVE personalization is proven in both synthetic-persona initial documents, with native Profiles identity/pageView and Instagram campaign attribution. The selected DAM image is published and renders at desktop/mobile widths. Null IDs and empty ownership lists mean unknown; they do not mean that resources are absent.

The new Westfield head comes from the neutral starter. Its independent source-configured host key is `westfield`, with app path `industry-verticals/westfield`; the original native editing host failed startup. The effective external editing fallback is READY/API-verified and is bound only to Westfield; the separate Vercel public site is verified. The original `starter` directory is a scaffold with no source-configured rendering host. The old Westfield luxury-retail branch is excluded.

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

The imported sites retain their shared `Project.IndustryVerticals` dependency. Westfield has its independent `Project.Westfield.Definitions` module under `authoring/items/westfield`, covering its templates, branches and renderings beneath their `Project/Westfield` roots, plus one exact external rendering-host leaf as a `singleItem` include. Its three developer-owned placeholder definitions are the exact `Header`, `Main` and `Footer` items under `/sitecore/content/Westfield/westfield/Presentation/Placeholder Settings`, each with a narrow `singleItem` include. The module excludes the former global Westfield placeholder root and does not deploy a broad Presentation subtree. It has no inherited IndustryVerticals module dependency. Shared platform/SXA definitions still remain outside Westfield ownership.

Westfield's verified collection path is `/content/Westfield`; its native site path is `/sitecore/content/Westfield/westfield`. The verified CMS Media folder is `/sitecore/content/Westfield/westfield/Media`. The verified asset upload folder is `/sitecore/media library/Project/Westfield/westfield` (ID `021d0cbd-401f-47d2-a9d1-3c8dd7a223ea`). Its four uploaded assets are recorded individually in the manifest. The Authoring API identity audit confirms all 72 source-declared native definition identities in master (the original 71 plus the external rendering-host leaf), including 29 datasource fields across five components. The initial scoped Experience Edge publication finished successfully with 255 processed items. Native field rendering and media delivery are separately verified; existence, API save/reload and publication do not prove Page Builder editing UI. Existing initial seed modules are inventoried with unassigned site ownership because a module label alone does not prove which frontend consumes it. Inspect native site grouping, rendering-host and datasource references before assigning ownership.

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

These are native CMS media uploads from public reference assets, not Content Hub DAM uploads. Binary sizes and source hashes were verified; native dimensions match for PNG/JPEG. SVG dimensions come from its source attributes/viewBox. The upload receipts did not publish assets by themselves. The later initial scoped publication finished successfully with 255 processed items; all four distinct native Edge image GETs returned 200 and native field images loaded in the public browser. Direct native CMS media-library picker selection was not separately tested. The distinct actual DAM picker selection on Paperless Hero retained its native opaque `dam-id`, Original `src` and descriptive alt through save/readback and publication. Live rendering loaded the 690 × 512 image with `object-fit: cover` at desktop 1440px and mobile 390px without horizontal overflow. This is responsive CSS cropping of the Original; no separately saved DAM crop is claimed. The shared-header logo remains native CMS media.

| Asset | Native CMS media ID | Source dimensions |
| --- | --- | --- |
| Home hero | `04ed27e2-8b90-42d3-96cf-daf6f81d307f` | 590 × 469 |
| MyWestfield | `e7e77f20-5f33-4a7d-b33e-4976391e3ca9` | 690 × 512 |
| Header logo | `894ad5a1-0e80-4c08-a2f5-d1713d822a49` | 288 × 56 |
| Footer logo | `01566ecc-9bc3-4281-8c50-9ccedc59c4b0` | 210 × 41 |

The existing shared `https://thlt-demo.sitecoresandbox.cloud` DAM now holds all 12 owned visual assets with metadata save/read-back, processed Originals and actual native workflow approval. Every explicitly created Original public URL returned unauthenticated HTTP 200 with an exact source-file SHA-256 match, including all nine SVGs. The actual Review workflow is the approval proof; the “All required actions complete for Approved” banner describes readiness only. Three Westfield-only collections have exact memberships and existing owned covers: imagery `128923` has hero/MyWestfield (2), cover hero `128421`; paperless campaign `128925` has logo/MyWestfield/account icon (3), cover MyWestfield `128422`; brand assets `128927` has two logos/eight icons (10), cover primary logo `128420`. No duplicate cover binary, global connector/theme/schema/taxonomy/access change or collection public sharing was required. Native Brand relations remain unverified because the asset detail UI did not expose an editable Brand field; no relation was guessed. Existing tenant processing generated additional smart-crop public links, which remain untouched and must be included in later reference review.

The [documented password grant](https://doc.sitecore.com/ch/en/developers/cloud-dev/oauth-tokens.html#resource-owner-password-credentials-grant) authenticates before [Content Hub REST operations](https://doc.sitecore.com/ch/en/developers/cloud-dev/rest-apis.html). [Upload API security](https://api-docs.sitecore.com/ch/upload-api) depends on access to the configured upload entity. Working native UI and CMS DAM picker SSO are verified separately from service integration: both historical password-grant attempts returned 401, and no further attempt was made. No account, global theme/Brand Kit, shared taxonomy, access configuration or connector change is included in the site asset scope.

## Westfield retirement boundary at this audit

`plan-remove westfield` remains a review plan. It must preserve the shared authoring environment, Content Hub instance, CM DAM connector/service account, platform/SXA definitions, global theme/Brand Kit, access settings and all unrelated assets/sites. The collection root `/sitecore/content/Westfield` is not a blanket deletion scope; inspect collection references and surviving sites before considering its retention/removal.

Source review covers only `industry-verticals/westfield`, `authoring/items/westfield`, `demo/westfield`, the exact `westfield` rendering-host mapping and Westfield's manifest/module records. Review the three definition roots and exact site placeholder descendants separately from authored site content. Recheck each native ID/path and inbound references in every relevant language/version; export a recoverable baseline before any authorized retirement.

Media review starts with the four native CMS media IDs above and their dedicated upload folder, then checks CMS image fields, other sites, public links and DAM copies. A matching hash does not establish exclusive ownership. DAM retirement now has 12 created asset IDs: `128420`, `128421`, `128422`, `128426`, `128723`, `128721`, `128722`, `128729`, `128728`, `128727`, `128745` and `128746`; the three created collection IDs are `128923`, `128925` and `128927`. They are separate from the four native CMS media IDs. Check exact memberships, public links and CMS consumers before retiring owned uploads. Preserve all shared connector/settings, existing Brand values, unrelated collection memberships and assets.

The verified public host/project/deployment, two imported synthetic profile IDs and two alternate datasource IDs are in the manifest. Recheck them and all references at retirement time. The original native editing-host startup failed; the effective external fallback is ready, bound only to Westfield and verified in native Page Builder. Both synthetic-persona initial-document decisions, native event/UTM attribution and one saved/published/live CMS DAM Image selection passed. Exact Optimization flow/decision identity remains unknown; friendly and experience IDs do not replace it. Retain shared profiles and scopes. Source checks or successful upload/publication do not authorize remote deletion.

## Handoff verification snapshot — 2026-10-15 02:46 UTC

Public and editing frontends are READY at main `9283668092233d577a7bf93419ed006d61bb4bbb`. [Public site](https://thlt-westfield-demo.vercel.app) deployment is `dpl_CgMH1BZNsh1KZyWxA8BMdPHcdeFm`; [external editing host](https://thlt-westfield-editing.vercel.app) deployment is `dpl_FHWRxNik1zSNRAHEdiQi3Sn2tYB2`. The PR6 HTML MIME correction is verified. The Chrome canvas stall was separately resolved by detaching automation debugging, after which native Page Builder loaded and editing QA continued.

| Area | Proven evidence | Remaining proof |
| --- | --- | --- |
| Definitions/content | 72 post-deployment identities/paths/parents/templates; 29 datasource fields; external host’s four nonsecret fields and Westfield binding preserved | Shared platform and other sites remain outside Westfield ownership |
| Authoring | Native Campaign Page insertion; Heading/RichText/Link edit, save/reload; component reorder/restore; scoped publish/unpublish; actual Paperless Hero DAM Image picker selection passed | One DAM selection is proven; the shared-header logo stays native CMS media |
| QA page | Digital service preview and children retained, Never publish set; final public route 404 | No deletion authorized; preserve author changes |
| Personalization | Published Boolean custom value; native LIVE false→offer/Default and true→enrolled/Quiet; initial-document payloads match DOM; first public native Chrome visit and cookie-free server response neutral | Exact Optimization flow/decision ID remains unknown; one transient neutral reload around publication was not reproduced, and its cause remains unconfirmed |
| Analytics | Native `en`→`westfield` mapping; both synthetic Profiles identity/pageView client linkage and Instagram/social/paperless UTM; prefilled 30-minute UI timeout observed | Analytics identifier is not a private UDL scope; 400ms SDK network timeouts are separate. Identity-event heading shows Undefined Undefined despite verified profile/client linkage |
| DAM | 12 owned uploads/metadata/processed Originals/actual Approved; 12 Original HTTP 200/source-hash matches; three collections, 15 memberships and three existing-asset covers; one native Image selection published to Edge and live desktop/mobile | Native Brand relations remain unverified; no shared taxonomy or connector changes |
| Palette | Seven reversible site-local field edits passed full native reload: Campaigns (3) and Shared layout (2) retained; unused local groups removed from sidebar | Shared legacy Commerce → Two product teaser remains visible and is preserved outside this head's ownership |

The picker’s `Westfield` title/filename search returned four relevant names, not all 12. Search by the exact intended title, such as `MyWestfield on a laptop`, or use the scoped collections. Extra-information indexing is not established. Collection memberships are symbolic asset references; covers reuse owned assets. Native Brand facet values do not authorize changing shared taxonomy or guessing asset relations.

The exact seven additional native IDs/paths are in the manifest: QA page, its Data folder and three datasource children, plus two generated `var2`/`var3` copies. Those copies are unused by the current Paperless shared/final layout only; global reference exclusivity is unverified. Keep initial seed count 25 as a historical receipt, not a current total. Retirement must resolve the exact Optimization flow/decision ID; SDK friendly and experience IDs are not substitutes.

## Exact external host definition and retirement

`Project.Westfield.Definitions` includes only `/sitecore/system/Settings/Services/Rendering Hosts/westfield-external` with `singleItem` scope, in both the industry and actual CM authoring repositories. Its native item uses the existing shared platform `RenderingHost` template; the shared Rendering Hosts parent and other hosts are not owned or serialized. The source has exactly four nonsecret shared fields:

| Native field | Value |
| --- | --- |
| AppName | westfield |
| ServerSideRenderingEngineApplicationUrl | https://thlt-westfield-editing.vercel.app/ |
| ServerSideRenderingEngineEndpointUrl | https://thlt-westfield-editing.vercel.app/api/editing/render |
| ServerSideRenderingEngineConfigUrl | https://thlt-westfield-editing.vercel.app/api/editing/config |

No editing secret or credential is serialized. The authored Site Grouping item `/sitecore/content/Westfield/westfield/Settings/Site Grouping/westfield` is outside the developer-definition includes; its successful native binding is recorded as evidence, not a replayable content snapshot. Before retiring the external host, inspect all consumers, retain the shared parent/template, and restore or remove only a still-owned Westfield binding through a separate authored configuration operation. Retain the original binding receipt for recovery and do not overwrite later author changes.

The original native deployment remains a historical failed attempt (build 2, deployment 3, post-action 0; completed 2026-10-14T23:01:34.5927642Z), trace `3e2d9f98-564a-4566-873f-0604ed322ce7`; [official deployment logs](https://deploy.sitecorecloud.io/environment/6Is64ZrdfzLpF1nDBtUSxd/logs/types). It is separate from the effective external fallback. The normal latest native environment-log command returned an empty list while the deployment-stage receipt recorded startup failure.

API provision/publication proof remains separate from UI proof. Default/Quiet are finite presentation variants; the current native decision supplies the profile-dependent datasource and presentation actions. Both synthetic-persona initial documents and matching DOM now prove those native decisions; generated content/profile records alone would not. A successful DAM user login likewise does not establish the shared connector's service-account authentication. Global DAM connector/theme/Brand Kit/schema/accounts/access and unrelated customer assets remain untouched.

Westfield palette curation passed API readback and a full native Page Builder reload. Only six exact site-local OOTB group `Renderings` fields were cleared, retaining their items; the exact site `Available Renderings` root grouping flag was enabled. The manifest retains each original field value and the root's empty baseline, covering all seven reversible changes. Before a deliberate restore, re-read the exact fields, compare them with the recorded after values and preserve later author changes. Ordinary deployment does not replay or restore these authored settings.

The sidebar now contains owned Campaigns (3) and Shared layout (2), plus shared Commerce → Two product teaser. That legacy Component builder entry has no implementation in this head and is outside Westfield ownership. Component builder libraries are [project-scoped across environments](https://doc.sitecore.com/sai/en/users/sitecoreai/design-components/components/get-started-with-the-component-builder/shared-libraries.html); [staged components appear by collection](https://doc.sitecore.com/sai/en/users/sitecoreai/design-components/components/using-components-in-a-webpage/staging-and-publishing-components.html). Sitecore's [palette restriction guidance](https://support.sitecore.com/kb?id=kb_article_view&sysparm_article=KB1003502) notes that solution-supplied Components/Forms may still appear. No documented exact site-only exclusion for this legacy entry was established. The shared library, Modules, globals and unrelated customer resources remain unchanged.
