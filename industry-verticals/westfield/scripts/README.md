# Presenter cheat sheet

The Kindle PDF uses the current collapsed Do summaries in `src/pages/demo.tsx`. It adds short presenter cues and keeps long prompts, query text, and API credentials in the web guide.

After changing a demo flow or the PDF's cues, install the generator dependency if needed with `python3 -m pip install -r scripts/requirements-demo-pdf.txt`, then run `npm run demo:pdf`. Review the brief cues as well as the automatically copied summaries. Commit the regenerated public PDF and its manifest with the guide changes. `npm run demo:pdf:check` runs during normal builds and rejects a stale or changed PDF. No Python or PDF-generation package is required on the hosting build server.

The downloadable file is `public/demo/westfield-demo-cheat-sheet.pdf`. Keep it to three pages, with readable black text, a single column, and no API key. Render all three pages after regenerating to check wrapping, spacing, and page boundaries.
