import Head from 'next/head';
import { JSX, useRef, useState } from 'react';
import { resetDemoBrowserIdentity } from 'lib/demo-persona';

const authoringUrl =
  'https://pages.sitecorecloud.io/editor?tenantName=sitecoresaae681-thltkirklan3127-kirklandaut0200&organization=org_JypIqqJsbEly6gh2&sc_itemid=91e93020-4ee9-4cfa-8904-8f19c8c8e4f1&sc_lang=en&sc_site=westfield&sc_version=1';
const damUrl = 'https://thlt-demo.sitecoresandbox.cloud/en-us/sitecore-dam-connect/approved-assets';
const flows = [
  { id: 'familiar-experience', title: 'A familiar Westfield experience', time: '1 minute' },
  { id: 'campaign', title: 'A relevant first visit', time: '3 minutes' },
  { id: 'customers', title: 'The right next step for each customer', time: '6 minutes' },
  { id: 'discovery', title: 'Useful content, easy to find', time: '3 minutes' },
  { id: 'authoring', title: 'Create a page with confidence', time: '9 minutes' },
] as const;
const rehearsalItems = [
  'Home, menus and mobile layout are ready to show.',
  'Instagram opens anonymously and the ad changes the Home hero.',
  'Casey sees the paperless offer on first arrival.',
  'Jordan sees the coverage review offer on first arrival.',
  'Search finds the full article and its images load.',
  'Page Builder, the blank article and permitted components are ready.',
  'Content Hub is signed in and Westfield assets are available.',
];

function FlowHeading({ index }: { index: number }): JSX.Element {
  const flow = flows[index];
  return (
    <div className="westfield-demo__flow-heading">
      <span className="westfield-demo__flow-number">0{index + 1}</span>
      <div>
        <p className="westfield-demo__eyebrow">
          Flow 0{index + 1} · {flow.time}
        </p>
        <h2 id={`${flow.id}-title`}>{flow.title}</h2>
      </div>
    </div>
  );
}

export default function DemoLaunch(): JSX.Element {
  const launching = useRef(false);
  const [status, setStatus] = useState(
    'Optional preparation controls. Use the prepared tabs during the presentation.'
  );
  const [busy, setBusy] = useState<'home' | 'instagram' | null>(null);
  const [error, setError] = useState(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const launch = async (destination: 'home' | 'instagram') => {
    if (launching.current) return;
    launching.current = true;
    setBusy(destination);
    setError(false);
    setStatus('Starting a fresh anonymous session…');
    try {
      await resetDemoBrowserIdentity();
      setStatus(
        destination === 'instagram'
          ? 'Anonymous session ready. Opening the Instagram campaign…'
          : 'Anonymous session ready. Opening Westfield Home…'
      );
      window.location.assign(destination === 'instagram' ? '/instagram/index.html' : '/');
    } catch (cause) {
      setError(true);
      setStatus(cause instanceof Error ? cause.message : 'The demo session could not be started.');
      launching.current = false;
      setBusy(null);
    }
  };

  const toggleItem = (item: string) => {
    setCheckedItems((previous) =>
      previous.includes(item) ? previous.filter((value) => value !== item) : [...previous, item]
    );
  };

  return (
    <>
      <Head>
        <title>Westfield demo guide</title>
        <meta
          name="description"
          content="Presenter guide for the Westfield customer experience and native authoring demo."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="westfield-demo" id="top">
        <a className="westfield-demo__skip" href="#flows">
          Skip to demo flows
        </a>
        <header className="westfield-demo__masthead">
          <a className="westfield-demo__brand" href="/" aria-label="Westfield demo Home">
            Westfield<span>Customer demo</span>
          </a>
          <a
            className="westfield-demo__text-link"
            href={authoringUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open Page Builder <span aria-hidden="true">↗</span>
          </a>
        </header>

        <div className="westfield-demo__intro">
          <div>
            <p className="westfield-demo__eyebrow">Presenter guide · 22 minutes of live demos</p>
            <h1>Present the Westfield experience.</h1>
            <p className="westfield-demo__lede">
              Start with the Westfield experience customers know. Follow a prospect from Instagram,
              recognize two existing customers, then create useful content with native authoring
              guardrails. These five loops occupy minutes 10–32 of the 50-minute presentation. The
              full session includes a separate 10-minute question period. Prepare the direct tabs
              before presenting; the live demonstration does not require returning to this guide.
            </p>
          </div>
          <div className="westfield-demo__launch-panel">
            <p className="westfield-demo__eyebrow">Optional preparation</p>
            <h2>Prepare a fresh visitor session</h2>
            <p>
              Before presenting, use a fresh public-site browser session. These optional controls
              restart this browser’s visitor session. Open Home and Instagram in advance, then show
              Home, Instagram, Casey and Jordan in that order.
            </p>
            <button
              className="westfield-demo__button"
              type="button"
              disabled={busy !== null}
              onClick={() => void launch('instagram')}
            >
              {busy === 'instagram' ? 'Starting…' : 'Start anonymous Instagram journey'}
              <span aria-hidden="true">→</span>
            </button>
            <button
              className="westfield-demo__button westfield-demo__button--secondary"
              type="button"
              disabled={busy !== null}
              onClick={() => void launch('home')}
            >
              {busy === 'home' ? 'Starting…' : 'Reset and open plain Home'}
              <span aria-hidden="true">→</span>
            </button>
            <p
              className={`westfield-demo__launch-status${error ? 'westfield-demo__launch-status--error' : ''}`}
              aria-live="polite"
              role={error ? 'alert' : 'status'}
              aria-atomic="true"
            >
              {status}
            </p>
            <p className="westfield-demo__fine-print">
              This resets the visitor session only. It does not change CMS content, profiles or DAM
              assets. Use these controls before the presentation, rather than between live loops.
            </p>
          </div>
        </div>

        <section className="westfield-demo__prepare" aria-labelledby="prepare-title">
          <div>
            <p className="westfield-demo__eyebrow">Before presenting</p>
            <h2 id="prepare-title">Keep the next click ready.</h2>
          </div>
          <ul>
            <li>
              Prepare a fresh browser session for the public website, separate from the signed-in
              Sitecore and Content Hub session. Open Home and Instagram in advance. Show both
              anonymous examples before Casey and Jordan sign in. Each customer sign-in starts a
              fresh demo identity automatically.
            </li>
            <li>
              Sign in to <strong>Sales Engineers 2 → thlt-demo → thlt-authoring</strong>. In Page
              Builder, select the <strong>westfield</strong> site.
            </li>
            <li>
              Sign in to the shared{' '}
              <a href={damUrl} target="_blank" rel="noreferrer">
                Content Hub
              </a>
              . Choose a unique article name for the authoring exercise. Open Page Builder in a new
              tab. If its canvas is blank, open another new tab and select the article there; close
              unused rehearsal tabs.
            </li>
          </ul>
        </section>

        <div className="westfield-demo__workspace" id="flows">
          <aside className="westfield-demo__rail">
            <nav aria-label="Demo flows">
              <p className="westfield-demo__eyebrow">The story</p>
              <ol>
                {flows.map((flow, index) => (
                  <li key={flow.id}>
                    <a href={`#${flow.id}`}>
                      <span>0{index + 1}</span>
                      {flow.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="westfield-demo__rail-note">
              <strong>The point to land</strong>
              <p>
                Relevant experiences and consistent pages come from managed content, native
                decisions and reusable page structure.
              </p>
            </div>
          </aside>

          <div className="westfield-demo__flows">
            <section
              className="westfield-demo__flow"
              id="familiar-experience"
              aria-labelledby="familiar-experience-title"
            >
              <FlowHeading index={0} />
              <p className="westfield-demo__say">
                “We can preserve the experience your customers recognize while giving the content
                team a more flexible way to manage it.”
              </p>
              <ol className="westfield-demo__steps">
                <li>
                  Switch directly to the prepared <strong>Home</strong> tab. Point out the original
                  hero, imagery, product sections and shared navigation.
                </li>
                <li>
                  Open a navigation menu and point out <strong>Login → Customer</strong>. Keep
                  customer sign-in for loop 3 and header search for loop 4.
                </li>
                <li>
                  Show a narrow viewport: navigation becomes a mobile menu, the page stacks and the
                  content remains readable. In Page Builder, the Westfield device presets include{' '}
                  <strong>375, 420, 576, 768, 960, 1200, 1440 and 1920</strong> pixels.
                </li>
              </ol>
              <div className="westfield-demo__expected">
                <p className="westfield-demo__eyebrow">Expected result</p>
                <p>
                  A fresh, non-campaign Home begins{' '}
                  <strong>Reliable Insurance, Real Peace of Mind</strong>. Menus, search and
                  responsive layouts work without horizontal scrolling.
                </p>
              </div>
              <div className="westfield-demo__links">
                <a href="/" target="_blank" rel="noreferrer">
                  Open Home ↗
                </a>
                <a href="/search" target="_blank" rel="noreferrer">
                  Open search ↗
                </a>
              </div>
              <p className="westfield-demo__fine-print">
                Plain links keep the current visitor identity. Links to pages outside the selected
                demo scope use #.
              </p>
            </section>

            <section
              className="westfield-demo__flow"
              id="campaign"
              aria-labelledby="campaign-title"
            >
              <FlowHeading index={1} />
              <p className="westfield-demo__say">
                “Someone planning their next chapter sees a message that continues from the ad to
                the website. We do not need to know who they are yet.”
              </p>
              <ol className="westfield-demo__steps">
                <li>
                  Switch directly to the prepared{' '}
                  <a href="/instagram/index.html" target="_blank" rel="noreferrer">
                    Instagram feed
                  </a>{' '}
                  tab before customer sign-in. Show the Westfield sponsored post among unrelated
                  posts from Sam Reed and Jamie Chen.
                </li>
                <li>
                  On the ad <strong>A new chapter. Protection for what’s next.</strong>, click{' '}
                  <strong>Learn more</strong>. The campaign entry opens the personalized Home.
                </li>
                <li>
                  Point out the matching message and home/auto imagery. In Page Builder, select the
                  Home hero and show its native <strong>Next chapter campaign</strong> experience:{' '}
                  <strong>UTM Campaign → Is equal to → next_chapter</strong>.
                </li>
              </ol>
              <div className="westfield-demo__expected">
                <p className="westfield-demo__eyebrow">Expected result</p>
                <p>
                  The first Home arrival reads{' '}
                  <strong>A new chapter. Protection for what’s next.</strong> The visitor is still
                  anonymous. Compare it with the original Home message shown in loop 1.
                </p>
              </div>
              <details className="westfield-demo__details">
                <summary>What establishes campaign context?</summary>
                <p>
                  The ad carries <code>instagram / social / next_chapter</code> attribution through
                  an anonymous campaign entry. That entry waits for the native event acknowledgement
                  before opening Home. Sitecore selects the hero treatment. A direct Home URL with
                  campaign parameters is not the rehearsed first-visit entry.
                </p>
              </details>
            </section>

            <section
              className="westfield-demo__flow"
              id="customers"
              aria-labelledby="customers-title"
            >
              <FlowHeading index={2} />
              <p className="westfield-demo__say">
                “Once a customer signs in, their existing paperless preference changes the next
                step. We avoid promoting something they have already done.”
              </p>
              <ol className="westfield-demo__steps">
                <li>
                  From Home, choose <strong>Login → Customer</strong>. Show the familiar{' '}
                  <strong>Sign into My Westfield</strong> experience.
                </li>
                <li>
                  Enter Casey’s email below and the password <strong>password</strong>, then choose{' '}
                  <strong>SIGN IN</strong>. Show the account page and its paperless offer.
                </li>
                <li>
                  Open{' '}
                  <a href="/login" target="_blank" rel="noreferrer">
                    the login page
                  </a>{' '}
                  again and sign in as Jordan using the same password. Each accepted demo sign-in
                  establishes a fresh browser identity before identifying the selected customer.
                </li>
                <li>
                  In Page Builder, open <strong>paperless</strong>, select the recommendation and
                  show <strong>Westfield paperless enrollment</strong>. The native decision reads
                  the stored <strong>Westfield paperless status</strong> Boolean.
                </li>
              </ol>
              <div className="westfield-demo__personas">
                <article>
                  <p className="westfield-demo__eyebrow">Casey · not enrolled</p>
                  <h3>Offer paperless billing</h3>
                  <code>casey@example.com</code>
                  <p>
                    <strong>Expected result:</strong> Sign up for paperless billing
                  </p>
                  <p className="westfield-demo__fine-print">Action: Explore paperless billing</p>
                </article>
                <article>
                  <p className="westfield-demo__eyebrow">Jordan · already enrolled</p>
                  <h3>Keep coverage relevant</h3>
                  <code>jordan@example.com</code>
                  <p>
                    <strong>Expected result:</strong> Keep your coverage in step with life
                  </p>
                  <p className="westfield-demo__fine-print">Action: Find your agent</p>
                </article>
              </div>
              <p className="westfield-demo__note">
                Both accounts and the Instagram campaign are synthetic. The password is checked
                locally; the native identity event connects the selected demo profile. This
                illustrates relevance and does not enroll anyone or change billing, policy or
                consent preferences.
              </p>
              <div className="westfield-demo__links">
                <a href="/login" target="_blank" rel="noreferrer">
                  Open customer login ↗
                </a>
                <a href="/paperless" target="_blank" rel="noreferrer">
                  Open current account experience ↗
                </a>
              </div>
            </section>

            <section
              className="westfield-demo__flow"
              id="discovery"
              aria-labelledby="discovery-title"
            >
              <FlowHeading index={3} />
              <p className="westfield-demo__say">
                “The same authored content supports a consistent article experience and useful
                search results. The team can add to it without building a new page from scratch.”
              </p>
              <ol className="westfield-demo__steps">
                <li>
                  From Home, open header search. Search for <strong>water</strong> and open{' '}
                  <strong>How To Help Prevent Water Damage in Your Home or Business</strong>.
                </li>
                <li>
                  Scroll through the full article, including its infographic. Show the heading
                  hierarchy, image, byline/date where supplied, related reading and mobile layout.
                </li>
                <li>
                  Open{' '}
                  <a href="/advice" target="_blank" rel="noreferrer">
                    Articles &amp; insights
                  </a>{' '}
                  to browse the six full source articles. For an optional body-content search, try{' '}
                  <strong>Yiddish</strong> to find the teen-driver article or{' '}
                  <strong>trampoline</strong> to find the policy-review article.
                </li>
              </ol>
              <div className="westfield-demo__expected">
                <p className="westfield-demo__eyebrow">Expected result</p>
                <p>
                  Search opens the relevant live article. The full Westfield source content and
                  images are present, and in-scope related article links stay on the demo site.
                </p>
              </div>
              <div className="westfield-demo__links">
                <a href="/search?q=water" target="_blank" rel="noreferrer">
                  Search “water” ↗
                </a>
                <a href="/advice" target="_blank" rel="noreferrer">
                  Browse all articles ↗
                </a>
                <a href="/advice/water-leak-home-checkup" target="_blank" rel="noreferrer">
                  Open water article ↗
                </a>
              </div>
            </section>

            <section
              className="westfield-demo__flow"
              id="authoring"
              aria-labelledby="authoring-title"
            >
              <FlowHeading index={4} />
              <div className="westfield-demo__readiness" role="note">
                <strong>Current authoring rehearsal · October 29, 2026</strong>
                <p>
                  All 16 placeholder settings and the branch with one blank Section passed fresh
                  checks. Page details, two separate Sections, Layers Plus insertion and
                  whole-Section Move up were saved. The embedded picker showed Brand → Westfield;
                  Family at home’s HomePageHero image and its alternative text were saved in Page
                  Builder. Actions → Publish changed the article from Draft to Approved. Independent
                  publication and live-page checks are still in progress. Actual mouse drag remains
                  unconfirmed.
                </p>
              </div>
              <p className="westfield-demo__say">
                “Authors start with the right structure, write in meaningful fields, and add only
                the components that belong here. The page design takes care of the presentation.”
              </p>
              <p className="westfield-demo__note">
                Keep authoring within 8 minutes and leave 1 minute for the transition. If the new
                page is still publishing, show an existing published article and say the new page is
                pending.
              </p>
              <ol className="westfield-demo__steps">
                <li>
                  In Page Builder, open <strong>Westfield → advice</strong>. Choose{' '}
                  <strong>Create a page → Advice Article</strong>, give it a unique rehearsal name
                  and press <strong>Enter</strong>. When prompted, choose{' '}
                  <strong>Reload tree</strong>, expand <strong>Home → advice</strong> and select the
                  new article. It starts with one blank <strong>Section</strong>.
                </li>
                <li>
                  Open the page’s <strong>Content</strong> view. Expand <strong>Content</strong> to
                  set <strong>Title</strong>, <strong>Metadata</strong> to set{' '}
                  <strong>Summary</strong>, and <strong>Article</strong> to set{' '}
                  <strong>Topic</strong> and <strong>Publication date</strong>. The image fields are
                  also in Article. Leave <strong>Reading time</strong> blank for automatic
                  calculation.
                </li>
                <li>
                  In the <strong>Article</strong> group, for <strong>Article image</strong>, choose{' '}
                  <strong>Browse media library → Content hub</strong>. If prompted, select{' '}
                  <strong>Sign in with SAML</strong>. In Approved assets, choose{' '}
                  <strong>Brand → Show all → Westfield → Close</strong>; the brand contains 12
                  approved assets. Open <strong>Family at home</strong>, choose its{' '}
                  <strong>HomePageHero</strong> rendition at <strong>2000 × 800</strong>, then click{' '}
                  <strong>Select</strong>. In the parent media dialog, click{' '}
                  <strong>Add selected</strong>. Return to the native
                  <strong> Content</strong> tab and set <strong>Image alt text</strong> for
                  <strong> Article image</strong>. Wait for <strong>Saved</strong>, open the same
                  article in a new Page Builder tab and confirm the image and alternative text
                  remain.
                </li>
                <li>
                  Select the starting <strong>Section</strong>. In its right{' '}
                  <strong>Content</strong> tab, enter <strong>Section heading</strong> and{' '}
                  <strong>Text</strong>. Wait for <strong>Saved</strong>, open the same article in a
                  new Page Builder tab and confirm the content remains.
                </li>
                <li>
                  In <strong>Layers</strong>, expand{' '}
                  <strong>headless-main → Partial design content → article-content-2</strong> and
                  use its <strong>Plus → Insert into</strong>. The location-specific picker offers
                  <strong> Section</strong> and <strong>Action</strong>. Choose{' '}
                  <strong>Section → Assign content item</strong>, select this article’s{' '}
                  <strong>Data</strong> folder, then choose <strong>Create new → Section</strong>.
                  Name it <strong>Follow-up Section</strong>, press <strong>Enter</strong> and wait
                  for it to be created, then click <strong>Assign</strong>. Populate its heading and
                  text, then use the native <strong>Move up</strong> control to reorder the whole
                  Section. Wait for <strong>Saved</strong>, open the same article in a new Page
                  Builder tab and confirm both Sections and their order. Remove empty placements
                  before publishing.
                </li>
                <li>
                  Preview desktop and mobile. Publish only the completed rehearsal article using{' '}
                  <strong>Actions → Publish</strong>. Open its live URL, find it in the Articles
                  list, and search for a unique phrase from the body. Allow time for publishing and
                  search/list refresh. Use a unique phrase from the article just created, and
                  unpublish the practice page after rehearsal before removing it.
                </li>
              </ol>
              <div className="westfield-demo__expected">
                <p className="westfield-demo__eyebrow">Expected result</p>
                <p>
                  A new article has prepared page structure and one blank Section. Heading and text
                  stay together as sections are added or reordered. Saved edits remain when the page
                  is reopened. The DAM image renders, and the completed published page is
                  discoverable.
                </p>
              </div>
              <details className="westfield-demo__details">
                <summary>Guardrails and a safe rehearsal</summary>
                <ul>
                  <li>
                    Under advice, the offered page type is <strong>Advice Article</strong>.
                  </li>
                  <li>
                    The article body allows <strong>Section</strong> and <strong>Action</strong>.
                  </li>
                  <li>Shared header, footer and page design stay outside the article exercise.</li>
                  <li>
                    Use only your own rehearsal page. Leave existing Test and author drafts alone.
                  </li>
                  <li>
                    Remove empty placements before publishing. Keep useful components in the
                    library.
                  </li>
                  <li>
                    After presenting, unpublish your practice page before removing it from the CMS.
                  </li>
                </ul>
                <p>
                  This rehearsal uses the available admin account. It demonstrates the content model
                  and authoring controls; permissions for a restricted author role have not been
                  tested.
                </p>
              </details>
              <div className="westfield-demo__links">
                <a href={authoringUrl} target="_blank" rel="noreferrer">
                  Open Advice in Page Builder ↗
                </a>
                <a href={damUrl} target="_blank" rel="noreferrer">
                  Check Westfield DAM assets ↗
                </a>
              </div>
            </section>
          </div>
        </div>

        <section className="westfield-demo__rehearsal" aria-labelledby="rehearsal-title">
          <div>
            <p className="westfield-demo__eyebrow">Your rehearsal</p>
            <h2 id="rehearsal-title">Ready for the room?</h2>
            <p>
              Tick these after trying them in your browser. This checklist records your current
              visit; it is not an automated test result.
            </p>
            <p className="westfield-demo__check-count" aria-live="polite">
              {checkedItems.length} of {rehearsalItems.length} checked
            </p>
            <button
              className="westfield-demo__clear"
              type="button"
              onClick={() => setCheckedItems([])}
              disabled={checkedItems.length === 0}
            >
              Clear checklist
            </button>
          </div>
          <fieldset>
            <legend className="westfield-demo__sr-only">Presenter rehearsal checklist</legend>
            {rehearsalItems.map((item, index) => (
              <label key={item} htmlFor={`rehearsal-${index}`}>
                <input
                  id={`rehearsal-${index}`}
                  type="checkbox"
                  checked={checkedItems.includes(item)}
                  onChange={() => toggleItem(item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </fieldset>
        </section>

        <section className="westfield-demo__verification" aria-labelledby="verification-title">
          <div>
            <p className="westfield-demo__eyebrow">Retained verification · October 15–16, 2026</p>
            <h2 id="verification-title">Earlier visitor and native authoring checks</h2>
          </div>
          <div className="westfield-demo__verification-results">
            <dl>
              <div>
                <dt>Production browser journeys verified</dt>
                <dd>
                  Plain Home after reset; anonymous Instagram → campaign → matching first Home;
                  Casey’s paperless offer on first arrival; Jordan’s different offer after Casey, on
                  first arrival and reload.
                </dd>
              </div>
              <div>
                <dt>Content and configuration checks passed</dt>
                <dd>
                  Six complete article copies and their images; relevant search API results;
                  authoring configuration audit with no mismatches; editing host response; and a new
                  Advice Article with one blank Section.
                </dd>
              </div>
              <div>
                <dt>Native editing and DAM selection verified</dt>
                <dd>
                  The new article’s metadata, first Section and DAM image/alternative text survived
                  save and reopening. The body picker offered only Section and Action. A second
                  independent Section was populated, moved with native Move up and saved; both
                  bodies and their order were verified in native state and on the live page. The
                  375px editing canvas remained readable.
                </dd>
              </div>
              <div>
                <dt>Native publication and discovery verified</dt>
                <dd>
                  Actions → Publish moved the completed article through its native workflow. The
                  live page rendered the selected DAM image, alternative text and saved Section
                  order. Articles → search for a unique body phrase → Read article opened that
                  published page. Separately, the API rehearsal verified incomplete-draft rejection
                  and scoped publication, withdrawal and recoverable cleanup.
                </dd>
              </div>
              <div>
                <dt>Historical drag coverage</dt>
                <dd>
                  A human-assisted whole-Section drag passed on October 16 and survived reopening
                  the canvas. Palette drag insertion and visual invalid-drop rejection were not
                  accepted. The current documented insertion and reorder flow uses Layers Plus and
                  Move up. Restricted-role permissions were not tested; admin rehearsal was agreed.
                </dd>
              </div>
            </dl>
            <p>
              These observations retain their October 15–16 dates. They do not establish today’s
              authoring readiness; the current rehearsal notice above governs that status. The
              presenter checklist records your own rehearsal separately.
            </p>
          </div>
        </section>
        <footer className="westfield-demo__footer">
          <p>Westfield · Presenter guide</p>
          <a href="#top">Back to starting points ↑</a>
        </footer>
      </main>
    </>
  );
}
