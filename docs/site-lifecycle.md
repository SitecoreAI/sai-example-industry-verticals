# Site inventory and retirement

`sites.manifest.json` records 18 independent frontend heads, source provenance, source-configured rendering-host keys, serialization module mappings and shared dependencies. Remote bindings remain `unverified` until checked against the actual environment. Westfield's collection/site identity and CMS Media folder are verified; definition deployment, editing/live hosts, publication, asset media-library ownership, profiles and DAM remain unverified. Null IDs and empty ownership lists mean unknown; they do not mean that resources are absent.

The new Westfield head comes from the neutral starter. Its independent source-configured host key is `westfield`, with app path `industry-verticals/westfield`; the remote editing/live host remains unverified. The original `starter` directory is a scaffold with no source-configured rendering host. The old Westfield luxury-retail branch is excluded.

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

Westfield's verified collection path is `/content/Westfield`; its native site path is `/sitecore/content/Westfield/westfield`. The verified CMS Media folder is `/sitecore/content/Westfield/westfield/Media`. The actual media-library asset path/ownership is still unknown. Definition roots are source-declared scopes, not proof of live deployment. Existing initial seed modules are inventoried with unassigned site ownership because a module label alone does not prove which frontend consumes it. Inspect native site grouping, rendering-host and datasource references before assigning ownership.

When adding a head, record its actual app path, exact configured host key, source branch/commit, module dependencies, proven owned resources and remote verification evidence. Do not derive native paths or IDs from the frontend directory name. Update the manifest when adding a module or changing a binding. Keep credentials outside the manifest and documentation.

## Retire one site

Generate `plan-remove <site>` and resolve every unknown binding before preparing a concrete removal change. Preserve a restorable source/native baseline and the authored content that needs retaining. Inventory references from other sites and languages before treating content, definitions or media as exclusive.

Prepare the source change around the single app directory, exact host mapping, manifest entry and proven exclusively owned modules. Shared definitions, shared media, common serialization roots, shared profile scopes and DAM assets stay in place. A site path nested beneath a shared serialization root requires reviewing the module's include/rule scopes; deleting a folder does not automatically establish a safe native deletion boundary.

Review native site content and publication separately from code. Review media references separately from the content tree. Verify the live/editing-host project, aliases and DNS before any hosting removal. For profiles and personalization, identify this site's actual scope, decisions, experiments and synthetic records; avoid unrelated records and shared scopes. If DAM is used, verify concrete collections/assets and all consumers before retiring exclusive resources.

After authorized removal, check surviving sites, native editing, publication/search references and remaining host aliases. Record completed actions, retained dependencies, verification evidence and restoration steps. The repository tools provide the inventory and plan; remote operations remain separate actions with their own verified targets.

## Westfield synthetic profile tooling

Developer-only profile import preparation is scoped to `demo/westfield`. The two JSONL inputs and validator accept only the two fixed synthetic `example.invalid` identities and the Boolean extension `westfieldPaperlessEnrolled`. The script is outside frontend assets and ordinary builds. Its offline validation makes no network request; remote import/reset commands are separate deliberate operations after native schema, identity provider and API access are verified. No private environment file is copied into the repository.

## Consolidated native source definitions

The shared foundation manifest records every imported source path, native item path and item ID for 150 added definitions: 10 from Allianz, 134 from Cenovus and 6 from Textron. These exact additions preserve source IDs and source commit provenance. Existing files, the modified shared PageHeader rendering and authored Presentation snapshots were excluded. Source import does not prove native deployment.

The existing shared PageHeader rendering keeps main's direct field resolver. Luxury Retail, Cenovus, MNP and Worley consume `Title`/`Content` fields with native route-field fallback. Textron additionally accepts its GraphQL datasource and `Page Title`/`Page Content` field formats, then falls back to those legacy fields and native route fields. The retail head does not currently register a PageHeader component. Any future shared GraphQL/datasource-template migration requires compatible field handling and native authoring verification across the affected heads; a separate Textron-scoped rendering can isolate that contract.

Textron's imported global `headless-main` placeholder is a source definition with broad allowed controls. Its actual native site binding remains unverified. Do not treat the shared module's contribution paths as permission to change another site's placeholder binding or to delete shared definitions during retirement.
