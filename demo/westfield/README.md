# Westfield synthetic profile preparation

This developer-only folder is separate from the frontend and ordinary build/deployment commands. It contains no credential or private environment file.

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

The tool and input files were ported from the earlier working demo checkout; they contain no runtime personalization fixture. Native identity/schema/endpoint bindings remain pending for the new Westfield environment.
