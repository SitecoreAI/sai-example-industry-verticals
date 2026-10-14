# Site inventory and retirement

`sites.manifest.json` records 18 independent frontend heads, source provenance, source-configured rendering-host keys, serialization module mappings and shared dependencies. Remote bindings remain `unverified` until checked against the actual environment. Westfield's collection/site identity, 72 serialized native definition item identities and four native CMS media IDs/paths are verified. API content seeding, scoped publication, two synthetic profile imports and the public Vercel deployment are verified. External editing-host readiness is API-verified; authenticated Page Builder UI, the native profile-derived first-render decision and DAM selection remain unverified. Null IDs and empty ownership lists mean unknown; they do not mean that resources are absent.

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

These are native CMS media uploads from public reference assets, not Content Hub DAM uploads. Binary sizes and source hashes were verified; native dimensions match for PNG/JPEG. SVG dimensions come from its source attributes/viewBox. The upload receipts did not publish assets by themselves. The later initial scoped publication finished successfully with 255 processed items; all four distinct native Edge image GETs returned 200 and native field images loaded in the public browser. Direct authoring Image picker selection and DAM Image selection remain unverified.

| Asset | Native CMS media ID | Source dimensions |
| --- | --- | --- |
| Home hero | `04ed27e2-8b90-42d3-96cf-daf6f81d307f` | 590 × 469 |
| MyWestfield | `e7e77f20-5f33-4a7d-b33e-4976391e3ca9` | 690 × 512 |
| Header logo | `894ad5a1-0e80-4c08-a2f5-d1713d822a49` | 288 × 56 |
| Footer logo | `01566ecc-9bc3-4281-8c50-9ccedc59c4b0` | 210 × 41 |

The selected DAM target is the existing shared `https://thlt-demo.sitecoresandbox.cloud` instance, with new Westfield-only collections and assets. The CM connector remains unchanged. The active head's `demo/dam-assets.json` remains a planning/provenance manifest with 12 selected visuals and four core images prioritized. The lifecycle manifest and private receipt hold the actual upload identities; approved/public delivery/native CMS selection are recorded separately. Both prior service-account password-grant attempts returned HTTP 401 at `/oauth/token`; no server OAuth retry was made. The later normal user login succeeded and four new core assets were uploaded through signed-in UI. Logo asset 128420 metadata, Approved state and five renditions are verified; the other three processing/approval checks remain pending. No collections, public delivery links or CMS DAM Image selection have been completed. Browser control stalled before a Public link click was dispatched, and the Mac subsequently relocked; no file chooser or upload modal remains open. Do not infer upload permissions or credential validity from the presence of CM connector settings.

The [documented password grant](https://doc.sitecore.com/ch/en/developers/cloud-dev/oauth-tokens.html#resource-owner-password-credentials-grant) authenticates before [Content Hub REST operations](https://doc.sitecore.com/ch/en/developers/cloud-dev/rest-apis.html). [Upload API security](https://api-docs.sitecore.com/ch/upload-api) depends on access to the configured upload entity. Normal browser access has been established separately from the still-unverified service integration. UI work resumes only after the physical Mac session is unlocked and browser control is handed back safely. No account, global theme/Brand Kit, shared taxonomy, access configuration or connector change is included in the site asset scope.

## Westfield retirement boundary at this audit

`plan-remove westfield` remains a review plan. It must preserve the shared authoring environment, Content Hub instance, CM DAM connector/service account, platform/SXA definitions, global theme/Brand Kit, access settings and all unrelated assets/sites. The collection root `/sitecore/content/Westfield` is not a blanket deletion scope; inspect collection references and surviving sites before considering its retention/removal.

Source review covers only `industry-verticals/westfield`, `authoring/items/westfield`, `demo/westfield`, the exact `westfield` rendering-host mapping and Westfield's manifest/module records. Review the three definition roots and exact site placeholder descendants separately from authored site content. Recheck each native ID/path and inbound references in every relevant language/version; export a recoverable baseline before any authorized retirement.

Media review starts with the four IDs above and their dedicated upload folder, then checks CMS image fields, other sites, public links and any DAM copies. A matching hash does not establish exclusive ownership. DAM retirement now has four created asset IDs (128420, 128421, 128422 and 128426), and no created collection IDs. They remain separate from the four native CMS media IDs above. Check exact memberships, public links and CMS consumers before retiring any of these owned DAM uploads. If later added, record their exact IDs and references before retiring only exclusive Westfield resources. Preserve all shared connector/settings and unrelated collection memberships.

The verified public host/project/deployment, two imported synthetic profile IDs and two alternate datasource IDs are now in the manifest. Recheck them and all references at retirement time. The original native editing-host startup failed; the effective external fallback is API-ready and bound only to Westfield. Authenticated native editing UI, profile/session hydration and native personalization decisions remain unresolved. Retain shared profiles and scopes. Source checks or a successful media upload never authorize remote deletion or establish that host/DAM/personalization cleanup is complete.

## Handoff verification snapshot — 2026-10-14 23:28 UTC

The public site is [thlt-westfield-demo.vercel.app](https://thlt-westfield-demo.vercel.app), currently `READY` at main commit `86448f8c93a0d3b066dc72f9b4d05cdfe024dbb9`, deployment `dpl_47VKT7rY5q1pX9MxtcAc3pEXGa64`. Earlier HTTP/native field/media and bounded browser evidence retains its recorded scope; a source or deployment status does not establish new UI checks.

The effective authoring fallback is [thlt-westfield-editing.vercel.app](https://thlt-westfield-editing.vercel.app). Its SDK metadata and native-field HTML rendering proofs are verified through API. Read-only Authoring API inspection confirmed item `a2a4cd2c-0dcd-4937-aeaf-20ea8cd3a740`, template `bc71d442-3e4f-46ba-887c-746e54f9bb83`, all four nonsecret host field IDs/values, and the Westfield Site Grouping `RenderingHost` value `westfield-external`. Authenticated Page Builder UI remains unverified.

| Area | Proven evidence | Remaining proof |
| --- | --- | --- |
| Definitions and initial content | 72 native item identities: original 71 plus one external host; 29 datasource fields; partials, palette, five variant groups/six variants, page design and page branch provisioned through API | New host leaf source release; Page Builder palette/datasource/variant UI and fresh author Create page |
| Authoring | External fallback READY, SDK metadata/native-field HTML proof, exact native item and Westfield-only binding; initial API field save/reload and branch Data identity checks | Authenticated text/RichText/Link/Image editing, direct pickers, UI save/reload and republish |
| Publication and CMS media | Original initial publication FINISHED, 255 processed, no failure; four native image GETs 200 and public images loaded | Direct authoring Image picker; external host is CM configuration and is not counted as a newly published Edge item |
| Live browser | Desktop Home → Explore paperless proof; Home/Paperless mobile overflow/navigation checks; both Casey/Jordan gated fresh SDK identity-event redirects to Instagram | Final production entry-path regression retains partial status until separately proven |
| Profiles and personalization | Two synthetic profiles imported (2/2); two alternate native datasources saved/reloaded and separately published (2 processed), layout unchanged | Profile/session flag hydration, native first-render decision and attribution; campaign remains neutral until configured |
| DAM | Four new core uploads: 128420 logo, 128421 hero, 128422 MyWestfield, 128426 footer logo; one logo metadata/Approved/five-rendition proof | Three processing/approval checks, eight further uploads, three collections, public delivery and actual CMS picker Image identity XML; UI work paused after CDP deadline and Mac relock |

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

API provision/publication proof does not clear UI proof. Default/Quiet are finite presentation variants; prepared alternate datasource copies and imported flags do not implement or prove a native personalization decision. A successful DAM user login likewise does not establish the shared connector's service-account authentication. Global DAM connector/theme/Brand Kit/schema/accounts/access and unrelated customer assets remain untouched.
