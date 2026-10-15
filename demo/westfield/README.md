# Westfield synthetic demo journey and profile tooling

This developer-only folder is separate from the frontend and ordinary build/deployment commands. It contains no credential or private environment file.

## Presenter journey

1. Open `/demo` and start a fresh anonymous session. The presenter reset obtains a new Sitecore browser identity before opening the static Instagram prop.
2. Find the single sponsored Westfield prospect post in an unrelated friend feed. The campaign is **A new chapter. Protection for what’s next.**, promoting home and auto coverage. Friend stories, posts, suggestions, alt text and display names use human-friendly names with spaces.
3. Click **Learn more**. The ad opens the public Home page at `/?utm_source=instagram&utm_medium=social&utm_campaign=next_chapter`.
4. The configured native **Westfield next chapter campaign** decision uses the built-in **UTM Campaign → Is equal to → next_chapter** condition on Home's `CampaignHero`. Its campaign datasource supplies **A new chapter. Protection for what’s next.** The original Hero remains the no-UTM control. Live first-response verification for this revision remains pending.
5. Existing customers can then use the Header **Log in** link to open the SSO-style local demo `/login`. Header/footer navigation preserves the allowed campaign parameters. Enter one of the two synthetic demo accounts below, using the literal password `password`.
6. After the Cloud SDK confirms the matching native identity, continue to `/paperless` with campaign parameters retained. This existing native page presents general MyWestfield account content and the appropriate native recommendation.

Home also retains a separate, nonpersonalized coverage promotion: **Protection for wherever life takes you** with **Explore home and auto**, linking to the public Westfield home-and-auto reference page. The prospect ad does not ask for a login or pitch paperless enrollment.

| Demo login | Existing native email identifier | Native Boolean | Expected recommendation |
| --- | --- | --- | --- |
| `casey@example.com` | `westfield-demo-unenrolled@example.invalid` | false | Sign up for paperless billing |
| `jordan@example.com` | `westfield-demo-enrolled@example.invalid` | true | Keep your coverage in step with life |

The login is a synthetic local acceptance gate, not production authentication. The password is checked in the browser and never placed in a network payload or URL. Successful local acceptance triggers a real Sitecore Cloud SDK identity event containing only the allowlisted native identifier. It does not create an authenticated production account session. The `westfieldPaperlessEnrolled` value stays on the native profile; the frontend does not store, submit or choose a local copy of that flag. Native personalization evaluates it to select the CMS datasource/presentation.

The prior release verified both native profile imports (2/2), Boolean custom-value tests, LIVE customer initial-document decisions and campaign attribution. The revised prospect entry, Home UTM decision/control and subsequent login/account journey require their own deployment and end-to-end QA; those earlier results do not establish this revision's first-response or journey QA status. Exact native campaign identifiers are recorded in the Westfield head README.

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
