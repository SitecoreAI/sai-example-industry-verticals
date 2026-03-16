# Westfield content snapshot

This folder contains a **content snapshot** of the Westfield insurance demo content. You can use either the JSON snapshot here or **Sitecore Cloud serialization** (`sitecore ser`) to serialize and manually deserialize later.

## Option A: Sitecore Cloud serialization (`sitecore ser`)

Westfield has a serialization module so you can use the standard Sitecore CLI. It is **not** included in deployment: `xmcloud.build.json` does not list `Project.Westfield-Content` in `postActions.scsModules.modules`, so normal deploys will **not** push Westfield content.

### Setup

1. **Connect your environment** (if not already):
   ```bash
   dotnet sitecore cloud login
   dotnet sitecore cloud environment connect --environment-id <envId> --allow-write true
   ```

2. **Pull** Westfield content from the cloud into YAML under `authoring/`:
   ```bash
   sitecore ser pull
   ```
   This pulls all configured modules, including the new Westfield module at  
   `authoring/items/industry-verticals/sites/westfield/` (namespace `Project.Westfield-Content`). Items under `/sitecore/content/industry-verticals/westfield/Home` and `.../westfield/Data` are serialized as YAML there.

3. **Push** only when you want to re-apply Westfield content (e.g. to the same or another environment):
   ```bash
   sitecore ser push
   ```
   Pushing is manual; it is not part of the XM Cloud build/deploy pipeline.

### Module location

- **Module file**: `authoring/items/industry-verticals/sites/westfield/westfield-content.module.json`
- **Included paths**: `.../westfield/Home` and `.../westfield/Data` (descendants only)

To have Westfield content deployed automatically with the rest of the site content, you would add `Project.Westfield-Content` to `xmcloud.build.json` → `postActions.scsModules.modules`. Leaving it out keeps “serialize for manual deserialize later” behavior.

---

## Option B: JSON snapshot (this folder)

A field-only JSON export for backup or API/MCP-based re-apply. Not used by `sitecore ser`.

### Files

| File | Purpose |
|------|--------|
| `content-snapshot.json` | Field-only export of updated Westfield items (path, itemId, template, fields). |
| `content-snapshot.schema.json` | Optional JSON schema for the snapshot format. |

### When to use

- **Backup**: Version the demo content in git without SCS YAML.
- **Restore via MCP/API**: Re-apply using Marketer MCP or your own script (see below).

### How to deserialize (re-apply) the JSON snapshot

**Marketer MCP (Cursor):**  
For each entry in `content-snapshot.json` → `items`, call **update_content** with `itemId`, `siteName`: `"westfield"`, `language`: `"en"`, and `fields`.

**Script/API:**  
Read the JSON and call your content API to update each item by `itemId` and `fields`.

### Updating the JSON snapshot

Re-export the items (e.g. from MCP or API) into the same structure and replace `content-snapshot.json`. No automatic export is set up.
