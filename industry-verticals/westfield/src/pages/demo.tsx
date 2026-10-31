import Head from 'next/head';
import { JSX, useRef, useState } from 'react';
import { getBrowserId } from '@sitecore-cloudsdk/core/browser';
import { resetDemoBrowserIdentity } from 'lib/demo-persona';

const authoringUrl =
  'https://pages.sitecorecloud.io/editor?tenantName=sitecoresaae681-thltkirklan3127-kirklandaut0200&organization=org_JypIqqJsbEly6gh2&sc_itemid=91e93020-4ee9-4cfa-8904-8f19c8c8e4f1&sc_lang=en&sc_site=westfield&sc_version=1';
const damUrl = 'https://thlt-demo.sitecoresandbox.cloud/en-us/sitecore-dam-connect/approved-assets';
const profilesUrl =
  'https://app.sitecorecloud.io/optimization/profiles?organization=org_JypIqqJsbEly6gh2&tenantId=76ac4984-cff8-4b3d-3071-08ded696f4f5';
const flows = [
  { id: 'familiar-experience', title: 'A familiar Westfield experience', time: '1 minute' },
  { id: 'affinity', title: 'Reading builds an interest profile', time: '5 minutes' },
  { id: 'campaign', title: 'The message continues from the ad', time: '2 minutes' },
  { id: 'customers', title: 'Known customer information changes the offer', time: '5 minutes' },
  { id: 'authoring', title: 'Create a page with confidence', time: '9 minutes' },
] as const;
const rehearsalItems = [
  'Home, menus and mobile layout are ready to show.',
  'The anonymous Client ID opens the correct native profile.',
  'Each article VIEW appears before its updated affinity is presented.',
  'Home interest changes the Home hero after the documented browsing sequence.',
  'The Instagram campaign still selects its matching Home hero after the affinity loop.',
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
  const [busy, setBusy] = useState<'prepare' | 'home' | 'instagram' | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState('');
  const [error, setError] = useState(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const launch = async (destination: 'prepare' | 'home' | 'instagram') => {
    if (launching.current) return;
    launching.current = true;
    setBusy(destination);
    setError(false);
    setClientId(null);
    setCopyStatus('');
    setStatus('Starting a fresh anonymous session…');
    try {
      await resetDemoBrowserIdentity();
      const currentClientId = getBrowserId();
      if (!currentClientId) {
        throw new Error('The visitor session is not ready. Please prepare it again.');
      }
      setClientId(currentClientId);
      if (destination === 'prepare') {
        setStatus('Anonymous session ready. Copy its Client ID, then open the direct demo tabs.');
        launching.current = false;
        setBusy(null);
        return;
      }
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

  const copyClientId = async (): Promise<void> => {
    if (!clientId) return;
    try {
      await navigator.clipboard.writeText(clientId);
      setCopyStatus('Client ID copied. Search for this value in Sitecore Profiles.');
    } catch {
      setCopyStatus('Copy is unavailable. Select the Client ID above and copy it manually.');
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
              Start with the Westfield experience customers know. Browse articles to build an
              anonymous interest profile, follow the Instagram ad, recognize two existing customers,
              then create useful content with native authoring guardrails. These five loops occupy
              minutes 10–32 of the 50-minute presentation. The full session includes a separate
              10-minute question period. Prepare the direct tabs before presenting; the live
              demonstration does not require returning to this guide.
            </p>
          </div>
          <div className="westfield-demo__launch-panel">
            <p className="westfield-demo__eyebrow">Optional preparation</p>
            <h2>Prepare a fresh visitor session</h2>
            <p>
              Before presenting, use a fresh public-site browser session. These optional controls
              restart this browser’s visitor session. Prepare Home, Articles, Instagram, and the
              matching native profile before presenting. Show browsing interest before Instagram,
              then Casey and Jordan. Returning here during the live demonstration is unnecessary.
            </p>
            <button
              className="westfield-demo__button"
              type="button"
              disabled={busy !== null}
              onClick={() => void launch('prepare')}
            >
              {busy === 'prepare' ? 'Preparing…' : 'Prepare anonymous browsing session'}
              <span aria-hidden="true">→</span>
            </button>
            <button
              className="westfield-demo__button westfield-demo__button--secondary"
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
            {clientId ? (
              <div className="westfield-demo__client-id">
                <p>
                  <strong>Current anonymous Client ID</strong>
                </p>
                <code>{clientId}</code>
                <button
                  className="westfield-demo__clear"
                  type="button"
                  onClick={() => void copyClientId()}
                >
                  Copy Client ID
                </button>
                <p aria-live="polite">{copyStatus}</p>
                <a href={profilesUrl} target="_blank" rel="noreferrer">
                  Open Sitecore Profiles ↗
                </a>
                <p className="westfield-demo__fine-print">
                  Search Profiles for this Client ID and prepare the matching profile tab. Keep the
                  same public-site browser session for browsing. A customer sign-in creates a new
                  demo identity, so this ID applies to the anonymous loop only.
                </p>
              </div>
            ) : (
              <p className="westfield-demo__fine-print">
                Prepare the browsing session to display its Client ID. No profile data or affinity
                scores are stored or shown by this guide.
              </p>
            )}
            <div className="westfield-demo__links">
              <a href="/" target="_blank" rel="noreferrer">
                Open Home ↗
              </a>
              <a href="/advice" target="_blank" rel="noreferrer">
                Open Articles ↗
              </a>
              <a href="/instagram/index.html" target="_blank" rel="noreferrer">
                Open Instagram ↗
              </a>
            </div>
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
              Sitecore and Content Hub session. Prepare Home, Articles, Instagram, and the matching
              native profile in advance. Show browsing interest before the Instagram campaign, and
              both anonymous examples before Casey and Jordan sign in. Each customer sign-in starts
              a fresh demo identity automatically.
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
              . Choose a unique article name for the authoring exercise. In Sitecore, open the
              actual <strong>Editor</strong> link in a new tab (<strong>Meta-click</strong> on Mac)
              and allow the canvas to load. Do not refresh it. Close unused rehearsal tabs.
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
                  customer sign-in for loop 4. Use Articles for the browsing-interest loop next.
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
              id="affinity"
              aria-labelledby="affinity-title"
            >
              <FlowHeading index={1} />
              <div className="westfield-demo__readiness" role="note">
                <strong>Native browsing and customer journeys verified October 31</strong>
                <p>
                  A fresh anonymous visitor saw the standard Home, built the profile below through
                  normal article navigation, then saw the Home-interest hero on return. The same
                  visitor’s Instagram click selected the campaign hero. Casey and Jordan then
                  received their correct first-arrival messages. The Westfield Home messages
                  personalization is Live.
                </p>
              </div>
              <p className="westfield-demo__say">
                “Before we know this visitor’s identity, the articles they read tell us something
                about their interests. Sitecore can use that interest to choose more relevant
                content.”
              </p>
              <ol className="westfield-demo__steps">
                <li>
                  Keep the fresh anonymous session used for the standard Home page. Open the normal
                  <strong> Articles</strong> page. In <strong>Article Tags</strong>, select
                  <strong> Auto</strong> and read
                  <strong> A Guide to First-Time Auto Insurance for Your Teenager</strong>.
                </li>
                <li>
                  Switch to the matching native <strong>Profiles</strong> tab prepared with this
                  visitor’s Client ID. Check the new VIEW in <strong>Engagement</strong>, then open
                  <strong> Overview → Top affinities</strong>. The recorded rehearsal showed
                  <strong> Auto: 1 view, score 1.00</strong>.
                </li>
                <li>
                  Return through the article’s <strong>Articles</strong> breadcrumb. Select
                  <strong> Home</strong> and read
                  <strong> How To Help Prevent Water Damage in Your Home or Business</strong>.
                  Inspect the same profile again. The recorded result was
                  <strong> Auto: 1 view, score 0.50; Home: 1 view, score 0.50</strong>.
                </li>
                <li>
                  Return through Articles and read
                  <strong> How To Prepare Your Home and Family for a Spring Thunderstorm</strong>.
                  Inspect the same profile once more. The recorded result was
                  <strong> Home: 2 views, score 0.67; Auto: 1 view, score 0.33</strong>. Show how
                  the browsing history changes the balance of interest.
                </li>
                <li>
                  Wait until the storm VIEW and Home’s second view appear before returning to the
                  website. Choose the <strong>Westfield logo</strong> to open Home. Compare the hero
                  with the original message. In the prepared Page Builder tab, explain the native
                  Home-interest rule and its selected content. Continue to Instagram without
                  resetting the visitor.
                </li>
              </ol>
              <div className="westfield-demo__expected">
                <p className="westfield-demo__eyebrow">Profile growth and resulting content</p>
                <p>
                  The same anonymous profile records one Auto article and two Home articles. Once
                  Home’s second view is recorded, the native rule can select
                  <strong> Protection for the place you call home.</strong> The native profile and
                  rule explain the change; the website does not calculate a local audience score.
                  The fresh browsing sequence, following Instagram campaign, and both customer first
                  arrivals passed.
                </p>
              </div>
              <details className="westfield-demo__details">
                <summary>What information does this example use?</summary>
                <p>
                  The configured page affinities are <code>westfield_interest:auto</code> on the
                  teen-driver article and <code>westfield_interest:home</code> on the water and
                  thunderstorm articles. The article Topic filter helps navigation; the separate
                  native affinity assignment controls collection. Run this loop before Instagram so
                  campaign context does not mask the behavior example.
                </p>
                <p>
                  Profile updates are near real time. In rehearsal, updates took several seconds to
                  about a minute. If a new VIEW is missing, use
                  <strong> Engagement → Reload sessions</strong>, then return to
                  <strong> Overview</strong>. If needed, return to Profiles and reopen this same
                  profile by its Client ID. Wait for the event and updated values rather than
                  claiming an immediate change. The scores above are observed examples, not a
                  promised scoring formula or fixed increment.
                </p>
                <p>
                  The Home decision keeps the Instagram campaign first and the Home-affinity rule
                  second. The latter uses <strong>Top Affinity</strong> with value
                  <strong> home</strong>, name <strong>westfield_interest</strong>, and
                  <strong> Is true</strong>. If the fresh rehearsal or regression checks fail, use
                  captured screens as a clearly identified walkthrough. A successful VIEW alone does
                  not prove the selected content.
                </p>
              </details>
              <div className="westfield-demo__links">
                <a href="/advice" target="_blank" rel="noreferrer">
                  Browse Articles ↗
                </a>
                <a href={profilesUrl} target="_blank" rel="noreferrer">
                  Open native Profiles ↗
                </a>
                <a href="/search?q=water" target="_blank" rel="noreferrer">
                  Search “water” ↗
                </a>
              </div>
              <p className="westfield-demo__fine-print">
                Full-article search remains available through the normal header. Optional body
                searches include Yiddish for the teen-driver article and trampoline for the policy
                review article. Search is supporting navigation rather than a separate timed loop.
              </p>
            </section>

            <section
              className="westfield-demo__flow"
              id="campaign"
              aria-labelledby="campaign-title"
            >
              <FlowHeading index={2} />
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
              <FlowHeading index={3} />
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
                illustrates relevance and does not enroll anyone or change billing, policy, or
                consent preferences. The imported records stand in for customer information from
                another system. Discuss CRM data at product level; this demo does not show a live
                CRM connection or ongoing synchronization.
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
              id="authoring"
              aria-labelledby="authoring-title"
            >
              <FlowHeading index={4} />
              <div className="westfield-demo__readiness" role="note">
                <strong>Current authoring rehearsal · October 29, 2026</strong>
                <p>
                  Fresh Edge tabs completed the native editing flow. All 16 placeholder settings and
                  the branch with one blank Section passed fresh checks. Page details, two separate
                  Sections, Layers Plus insertion and whole-Section Move up were saved. The embedded
                  Brand → Westfield picker supplied the Family at home HomePageHero image and its
                  alternative text. Desktop and mobile preview passed. Actions → Publish approved
                  and queued the page; its live page, Articles listing, title search and a unique
                  body-phrase search then passed. Actual mouse drag and visual invalid-drop
                  rejection remain unconfirmed.
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
                  <strong> Article image</strong>. Wait for <strong>Saved</strong>.
                </li>
                <li>
                  Select the starting <strong>Section</strong>. In its right{' '}
                  <strong>Content</strong> tab, enter <strong>Section heading</strong> and{' '}
                  <strong>Text</strong>. Wait for <strong>Saved</strong>.
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
                  Section. Remove empty placements, then wait for <strong>Saved</strong>. Open the
                  actual <strong>Editor</strong> link in one new tab and select the same article.
                  Confirm the page details, image and alternative text, and both complete Sections
                  in their saved order.
                </li>
                <li>
                  Preview desktop and mobile. Publish only the completed rehearsal article using{' '}
                  <strong>Actions → Publish</strong>. With the agreed admin account, this approves
                  the page and queues publication. Wait for the publishing job to finish, then open
                  its live URL in a new tab. Find it in the Articles list and search for a unique
                  phrase from its body. Allow time for the listing and search to update. Unpublish
                  the practice page after rehearsal before removing it.
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
