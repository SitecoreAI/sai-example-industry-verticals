import Head from 'next/head';
import { JSX, useId, useRef, useState } from 'react';
import { getBrowserId } from '@sitecore-cloudsdk/core/browser';
import { resetDemoBrowserIdentity } from 'lib/demo-persona';

const siteUrl = 'https://thlt-westfield-demo.vercel.app';
const portalUrl = 'https://portal.sitecorecloud.io/';
const damUrl = 'https://thlt-demo.sitecoresandbox.cloud/en-us/sitecore-dam-connect/approved-assets';

type ScriptBlock =
  | { kind: 'say'; text: string }
  | { kind: 'do'; id: string; title: string; actions: string[] }
  | { kind: 'copy'; label: string; value: string; url?: boolean }
  | { kind: 'phase'; id: string; title: string }
  | { kind: 'result'; text: string }
  | { kind: 'return'; title: string };

type DemoFlow = {
  id: string;
  code: string;
  title: string;
  time: string;
  goal: string;
  context: string;
  blocks: ScriptBlock[];
};

const flows: DemoFlow[] = [
  {
    id: 'familiar-experience',
    code: 'P1',
    title: 'A familiar Westfield experience',
    time: '1 minute',
    goal: 'Establish the familiar website before its message changes.',
    context: 'Home tab · anonymous visitor · fresh public-site session',
    blocks: [
      { kind: 'copy', label: 'Home tab', value: `${siteUrl}/`, url: true },
      { kind: 'say', text: 'Start with the Westfield experience customers recognize.' },
      {
        kind: 'do',
        id: 'P1.1',
        title: 'Show the standard Home page and its navigation',
        actions: [
          'Switch to the prepared Home tab in the anonymous visitor session.',
          'Point out “Reliable Insurance, Real Peace of Mind,” the imagery, and the shared navigation.',
          'Open About Us and locate Articles. Point out Login → Customer, keeping sign-in for P4.',
        ],
      },
      {
        kind: 'result',
        text: 'Home shows “Reliable Insurance, Real Peace of Mind.” The header offers Login.',
      },
      { kind: 'return', title: 'Browsing interests change the message' },
    ],
  },
  {
    id: 'affinity',
    code: 'P2',
    title: 'Reading builds an interest profile',
    time: '5 minutes',
    goal: 'Show how browsing provides a useful signal before the visitor signs in.',
    context: 'Home and Profiles tabs · same anonymous visitor as P1 · before Instagram',
    blocks: [
      { kind: 'copy', label: 'Home tab', value: `${siteUrl}/`, url: true },
      {
        kind: 'say',
        text: 'Article visits help Sitecore infer which topics interest this visitor.',
      },
      {
        kind: 'do',
        id: 'P2.1',
        title: 'Read the teen-driver article and show its recorded visit',
        actions: [
          'From Home, choose About Us → Articles.',
          'Under Article Tags, select Auto. Open “A Guide to First-Time Auto Insurance for Your Teenager.”',
          'Switch to the prepared native Profiles tab for this visitor. In Engagement, wait for the article VIEW.',
          'Open Overview → Top affinities and point out the Auto interest. Read the values shown in the profile.',
        ],
      },
      {
        kind: 'say',
        text: 'Now read advice about the home and watch that interest grow in the same profile.',
      },
      {
        kind: 'do',
        id: 'P2.2',
        title: 'Read two Home articles and compare the profile after each visit',
        actions: [
          'Return to the website tab. Use the Articles breadcrumb, select Home, and open “How To Help Prevent Water Damage in Your Home or Business.”',
          'In the same native profile, wait for this VIEW and inspect Top affinities again.',
          'Use the Articles breadcrumb to open “How To Prepare Your Home and Family for a Spring Thunderstorm.”',
          'Wait for the storm VIEW and Home’s second article visit. Read the current Home and Auto values rather than assuming a fixed score.',
        ],
      },
      {
        kind: 'do',
        id: 'P2.3',
        title: 'Return Home and connect the new message to the browsing interest',
        actions: [
          'Once the visits appear in the profile, return to the website and choose the Westfield logo.',
          'Compare the Home hero with the original message from P1.',
          'In the prepared Page Builder tab, select the Home hero and show its Home-interest experience and native condition.',
        ],
      },
      {
        kind: 'result',
        text: 'The same anonymous profile records one Auto article and two Home articles. Home shows “Protection for the place you call home.”',
      },
      { kind: 'return', title: 'The website continues the Instagram message' },
    ],
  },
  {
    id: 'campaign',
    code: 'P3',
    title: 'The message continues from the ad',
    time: '2 minutes',
    goal: 'Continue an acquisition message from Instagram onto the website.',
    context: 'Instagram tab · same anonymous session as P2 · no customer sign-in yet',
    blocks: [
      { kind: 'copy', label: 'Instagram tab', value: `${siteUrl}/instagram/index.html`, url: true },
      {
        kind: 'say',
        text: 'The campaign supplies visit context while the visitor remains anonymous.',
      },
      {
        kind: 'do',
        id: 'P3.1',
        title: 'Follow the Westfield ad to its matching Home message',
        actions: [
          'Switch to the prepared Instagram tab. Point out the Westfield sponsored post among unrelated friend posts.',
          'On “A new chapter. Protection for what’s next.” choose Learn more.',
          'Let the campaign entry open Home, then point out the matching message and imagery.',
          'In the prepared Page Builder tab, select the Home hero and show Next chapter campaign, with UTM Campaign equal to next_chapter.',
        ],
      },
      {
        kind: 'result',
        text: 'Home shows “A new chapter. Protection for what’s next.” The header still offers Login.',
      },
      { kind: 'return', title: 'Paperless status changes the message after sign-in' },
    ],
  },
  {
    id: 'customers',
    code: 'P4',
    title: 'Known customer information changes the offer',
    time: '5 minutes',
    goal: 'Offer a useful next step that respects each customer’s paperless preference.',
    context: 'Home tab · Casey, then Jordan · use the sign-in password in the private deck notes',
    blocks: [
      { kind: 'copy', label: 'Home tab', value: `${siteUrl}/`, url: true },
      { kind: 'say', text: 'A known customer fact helps the site choose a useful next step.' },
      { kind: 'copy', label: 'Casey email', value: 'casey@example.com' },
      {
        kind: 'do',
        id: 'P4.1',
        title: 'Sign in as Casey and show the paperless offer on Home',
        actions: [
          'From Home, choose Login → Customer.',
          'On Sign into My Westfield, enter Casey’s email and the password from the private presenter notes. Choose SIGN IN.',
          'Home opens at the top. Point out Logout in the header, then scroll to the MyWestfield section.',
          'Show “Sign up for paperless billing.”',
        ],
      },
      {
        kind: 'say',
        text: 'Jordan already uses paperless billing, so the same place on Home has a different message.',
      },
      { kind: 'copy', label: 'Jordan email', value: 'jordan@example.com' },
      {
        kind: 'do',
        id: 'P4.2',
        title: 'Sign in as Jordan and compare the same section',
        actions: [
          'Choose Logout, then Login → Customer.',
          'Sign in with Jordan’s email and the password from the private presenter notes.',
          'From the top of Home, scroll to the MyWestfield section. Show “Keep your coverage in step with life.”',
          'In Page Builder, select this Home section and show its native personalization using Westfield paperless status.',
        ],
      },
      {
        kind: 'result',
        text: 'Casey receives the paperless offer. Jordan receives the coverage message. The header shows Logout while each customer is signed in.',
      },
      { kind: 'return', title: 'Creating an article in Page Builder' },
    ],
  },
  {
    id: 'authoring',
    code: 'P5',
    title: 'Create a page with confidence',
    time: '9 minutes',
    goal: 'Create useful content within a prepared, consistent article structure.',
    context: 'Page Builder tab · agreed presenter account · Westfield site · own new article',
    blocks: [
      { kind: 'copy', label: 'Sitecore Portal', value: portalUrl, url: true },
      { kind: 'phase', id: 'P5.1', title: 'Create the article' },
      { kind: 'say', text: 'The prepared structure lets the author concentrate on content.' },
      {
        kind: 'do',
        id: 'P5.1.1',
        title: 'Create an Advice Article with one blank Section',
        actions: [
          'Switch to the prepared Page Builder tab for Westfield.',
          'Under advice, choose Create a page → Advice Article. Give it a unique name and press Enter.',
          'If prompted, choose Reload tree. Expand Home → advice and select the new article.',
          'Confirm the page structure is present with one blank Section, ready for content.',
        ],
      },
      { kind: 'copy', label: 'Article title', value: 'A simple home checkup' },
      {
        kind: 'copy',
        label: 'Article summary',
        value: 'A short household checklist to help prepare questions for your insurance agent.',
      },
      {
        kind: 'do',
        id: 'P5.1.2',
        title: 'Populate the article’s details',
        actions: [
          'Open Content. Under Content, set Title. Under Metadata, set Summary.',
          'Under Article, set Topic to Home and choose today’s Publication date.',
          'Leave Reading time blank for automatic calculation. Wait for Saved.',
        ],
      },
      {
        kind: 'result',
        text: 'The new article has its own title and metadata within the prepared page structure.',
      },
      { kind: 'phase', id: 'P5.2', title: 'Select an approved image' },
      { kind: 'say', text: 'Authors can choose approved images within their normal editing flow.' },
      {
        kind: 'do',
        id: 'P5.2.1',
        title: 'Find a Westfield image in the Content Hub picker',
        actions: [
          'In Content → Article → Article image, choose Browse media library → Content hub.',
          'In Approved assets, choose Brand → Show all → Westfield. Close the Brand list if it remains open.',
          'Open Family at home. Select the HomePageHero rendition, then Select.',
          'In the parent media dialog, choose Add selected.',
        ],
      },
      { kind: 'copy', label: 'Image alt text', value: 'A family relaxing together at home.' },
      {
        kind: 'do',
        id: 'P5.2.2',
        title: 'Describe the image and retain the selection',
        actions: [
          'Return to Content → Article and set Image alt text for Article image.',
          'Wait for Saved. Reopen the article and confirm the image and alternative text remain.',
        ],
      },
      {
        kind: 'result',
        text: 'The article retains the selected Westfield image and its description.',
      },
      { kind: 'phase', id: 'P5.3', title: 'Add and reorder Sections' },
      { kind: 'say', text: 'A Section keeps its heading and text together.' },
      { kind: 'copy', label: 'First Section heading', value: 'Questions for your agent' },
      {
        kind: 'copy',
        label: 'First Section text',
        value:
          'Review the changes around your home and bring your questions to your insurance agent.',
      },
      {
        kind: 'do',
        id: 'P5.3.1',
        title: 'Populate the starting Section and add another permitted Section',
        actions: [
          'Select the starting Section. In its Content tab, set Section heading and Text. Wait for Saved.',
          'In Layers, expand headless-main → Partial design content → article-content-2.',
          'Use Plus → Insert into. Confirm the location-specific picker offers Section and Action.',
          'Choose Section → Assign content item. Select this article’s Data folder, then Create new → Section.',
          'Name it Follow-up Section, press Enter, wait for creation, and choose Assign.',
        ],
      },
      { kind: 'copy', label: 'Second Section heading', value: 'Start with a household checklist' },
      {
        kind: 'copy',
        label: 'Second Section text',
        value:
          'Keep a Westfield household checkup list of changes to discuss at your next policy review.',
      },
      {
        kind: 'do',
        id: 'P5.3.2',
        title: 'Reorder the complete Sections and confirm their saved content',
        actions: [
          'Populate the second Section’s heading and Text, then wait for Saved.',
          'In Layers, select the second complete Section and use its native Move up control to place it above the first.',
          'Wait for Saved, reopen the same article, and confirm both headings and bodies follow the saved order.',
          'Remove empty placements from this article before publication. Keep useful components in the library.',
        ],
      },
      {
        kind: 'result',
        text: 'Both complete Sections retain their own content and saved order. The article placeholder offers only its permitted components.',
      },
      { kind: 'phase', id: 'P5.4', title: 'Preview, publish, and find the article' },
      { kind: 'say', text: 'Publication makes the completed content available to visitors.' },
      {
        kind: 'do',
        id: 'P5.4.1',
        title: 'Review the page and publish the completed article',
        actions: [
          'Preview Mobile (370 px) and Desktop Small (1024 px). Check the image, alternative text, links, required fields, and Section order.',
          'For your new draft article, choose Actions → Publish. Confirm the status changes to Approved.',
          'Choose the top Publish control. Keep Page and Current language (English) selected, select Subpages to include this article’s local Data, and clear All references.',
          'Confirm only your article and its local Data are in scope, then choose Start publish.',
          'Choose Open publishing jobs and wait for the job to finish before showing the visitor result.',
        ],
      },
      {
        kind: 'copy',
        label: 'Home tab for the published article',
        value: `${siteUrl}/`,
        url: true,
      },
      {
        kind: 'do',
        id: 'P5.4.2',
        title: 'Find the published article through the website',
        actions: [
          'Switch to the visitor Home tab. Choose About Us → Articles.',
          'Find the new title and choose Read article. Confirm its image and saved Section order.',
          'Open the normal header Search to find words in the published article content.',
        ],
      },
      { kind: 'copy', label: 'Article body search', value: 'Westfield household checkup' },
      {
        kind: 'do',
        id: 'P5.4.3',
        title: 'Find content from the article body',
        actions: [
          'Enter the body search phrase and submit it.',
          'Allow the listing and search to update, then open the matching new article.',
        ],
      },
      {
        kind: 'result',
        text: 'The live article retains its image and Sections and can be found through Articles and Search.',
      },
      { kind: 'return', title: 'Choosing a message for each visitor' },
    ],
  },
];

const rehearsalItems = [
  'The fresh Home session and matching native profile are ready.',
  'All three article visits appear in the same profile before Home changes.',
  'The Instagram ad opens its matching Home message after the affinity loop.',
  'Casey and Jordan receive their different offers on Home, and Logout works.',
  'A new Advice Article starts blank and retains its independent content.',
  'The Westfield DAM picker, permitted components, and Section reorder work.',
  'The completed article can be published and found through Articles and Search.',
];

function CopyValue({
  label,
  value,
  url = false,
}: {
  label: string;
  value: string;
  url?: boolean;
}): JSX.Element {
  const fieldId = useId();
  const [status, setStatus] = useState('');
  const [copying, setCopying] = useState(false);
  const copy = async (): Promise<void> => {
    setCopying(true);
    setStatus('');
    try {
      await navigator.clipboard.writeText(value);
      setStatus(`${label} copied.`);
    } catch {
      setStatus('Copy is unavailable. Select the text above and copy it manually.');
    } finally {
      setCopying(false);
    }
  };
  return (
    <div className="westfield-demo__block westfield-demo__block--copy">
      <p className="westfield-demo__block-label">{url ? 'Copy URL' : 'Copy / paste'}</p>
      <div className="westfield-demo__copy-heading">
        <p id={`${fieldId}-label`}>{label}</p>
        <button
          type="button"
          className="westfield-demo__copy-button"
          aria-label={url ? `Copy URL for ${label}` : `Copy ${label}`}
          disabled={copying}
          onClick={() => void copy()}
        >
          {copying ? 'Copying…' : url ? 'Copy URL' : 'Copy text'}
        </button>
      </div>
      <pre
        id={fieldId}
        className="westfield-demo__copy-value"
        tabIndex={0}
        role="textbox"
        aria-readonly="true"
        aria-multiline="true"
        aria-labelledby={`${fieldId}-label`}
      >
        {value}
      </pre>
      <p className="westfield-demo__copy-status" role="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

function Script({ block }: { block: ScriptBlock }): JSX.Element {
  switch (block.kind) {
    case 'copy':
      return <CopyValue {...block} />;
    case 'say':
      return (
        <div className="westfield-demo__block westfield-demo__block--say">
          <p className="westfield-demo__block-label">Say / point out</p>
          <p>{block.text}</p>
        </div>
      );
    case 'do':
      return (
        <details className="westfield-demo__block westfield-demo__block--do" id={block.id}>
          <summary>
            <span className="westfield-demo__block-label">{block.id} · Do</span>
            <span>{block.title}</span>
            <span className="westfield-demo__expand">Click-by-click</span>
          </summary>
          <ol>
            {block.actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ol>
        </details>
      );
    case 'phase':
      return (
        <h3 className="westfield-demo__phase" id={block.id}>
          <span>{block.id}</span> {block.title}
        </h3>
      );
    case 'result':
      return (
        <div className="westfield-demo__block westfield-demo__block--result">
          <p className="westfield-demo__block-label">Result check</p>
          <p>{block.text}</p>
        </div>
      );
    case 'return':
      return (
        <p className="westfield-demo__return">
          <strong>Return to the deck</strong>
          <span>{block.title}</span>
        </p>
      );
  }
}

export default function DemoLaunch(): JSX.Element {
  const launching = useRef(false);
  const [status, setStatus] = useState('Prepare the visitor session before the presentation.');
  const [busy, setBusy] = useState<'prepare' | 'home' | 'instagram' | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const launch = async (destination: 'prepare' | 'home' | 'instagram') => {
    if (launching.current) return;
    launching.current = true;
    setBusy(destination);
    setError(false);
    setClientId(null);
    setStatus('Starting a fresh anonymous session…');
    try {
      await resetDemoBrowserIdentity();
      const currentClientId = getBrowserId();
      if (!currentClientId)
        throw new Error('The visitor session is not ready. Please prepare it again.');
      setClientId(currentClientId);
      if (destination === 'prepare') {
        setStatus('Copy the Client ID, open Home, then find the matching profile in Sitecore.');
        launching.current = false;
        setBusy(null);
        return;
      }
      setStatus('Anonymous session ready. Opening the website…');
      window.location.assign(destination === 'instagram' ? '/instagram/index.html' : '/');
    } catch (cause) {
      setError(true);
      setStatus(cause instanceof Error ? cause.message : 'The demo session could not be started.');
      launching.current = false;
      setBusy(null);
    }
  };

  return (
    <>
      <Head>
        <title>Westfield presenter guide</title>
        <meta name="description" content="Presenter reference for the Westfield demonstration." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="westfield-demo" id="top">
        <a className="westfield-demo__skip" href="#flows">
          Skip to demo flows
        </a>
        <header className="westfield-demo__masthead">
          <p className="westfield-demo__brand">
            Westfield <span>Presenter guide</span>
          </p>
          <p>50-minute presentation + 10 minutes for questions</p>
        </header>
        <div className="westfield-demo__intro">
          <p className="westfield-demo__eyebrow">Five live loops · 22 minutes</p>
          <h1>Keep the next step in view.</h1>
          <p className="westfield-demo__lede">
            Show the website and native Sitecore tools to the audience. Keep this reference on a
            separate screen. Prepare the tabs first, then follow P1–P5 without returning here during
            the presentation.
          </p>
        </div>
        <details className="westfield-demo__preparation">
          <summary>Before the demo · prepare tabs, accounts, and the visitor session</summary>
          <div className="westfield-demo__preparation-body">
            <ol>
              <li>
                Keep a fresh public-site visitor session separate from the signed-in Sitecore and
                Content Hub session. Use the same anonymous visitor for P1, P2, and P3.
              </li>
              <li>
                In Sitecore Portal, open Sales Engineers 2 → thlt-demo → thlt-authoring → Westfield.
                Prepare Page Builder and Profiles. Use the agreed presenter account and the private
                deck notes for sign-in details.
              </li>
              <li>
                Sign in to the shared DAM before opening its picker. Choose a unique name for your
                own new article. Leave other authors’ drafts alone.
              </li>
            </ol>
            <CopyValue label="Sitecore Portal" value={portalUrl} url />
            <CopyValue label="Shared Content Hub" value={damUrl} url />
            <div className="westfield-demo__preparation-controls">
              <h2>Prepare the anonymous profile</h2>
              <p>
                Prepare once, copy the Client ID, then open Home to record its first page view. In
                the existing Sitecore app, choose Optimization → Profiles, search Client ID, press
                Enter, and open the matching profile. Keep that tab ready for P2.
              </p>
              <button
                type="button"
                className="westfield-demo__button"
                disabled={busy !== null}
                onClick={() => void launch('prepare')}
              >
                {busy === 'prepare' ? 'Preparing…' : 'Prepare anonymous browsing session'}
              </button>
              <p
                className={error ? 'westfield-demo__error' : 'westfield-demo__prep-status'}
                role={error ? 'alert' : 'status'}
                aria-live="polite"
              >
                {status}
              </p>
              {clientId && <CopyValue label="Current anonymous Client ID" value={clientId} />}
              <CopyValue label="Home tab" value={`${siteUrl}/`} url />
              <p>
                After Home, prepare Articles and the static Instagram feed in this visitor session.
                Run browsing interest before Instagram, and both anonymous loops before customer
                sign-in. Do not reset between those live loops.
              </p>
            </div>
            <details className="westfield-demo__support">
              <summary>Recovery and cleanup outside the live sequence</summary>
              <ul>
                <li>
                  If Page Builder stalls, preserve saved work, refresh once or reopen it in the same
                  signed-in browser, and close the unused tab.
                </li>
                <li>
                  If a profile visit is missing, choose Engagement → Reload sessions, then inspect
                  Overview again. Wait for the recorded visit before describing a changed affinity.
                </li>
                <li>
                  If a result is still pending, say so. Use the matching hidden presenter guide as a
                  clearly identified walkthrough, then continue the presentation.
                </li>
                <li>
                  The accounts and campaign are synthetic. The sign-in example does not change a
                  policy or billing preference, and no live CRM connection is demonstrated. Keep
                  account passwords in the private deck notes.
                </li>
                <li>
                  This rehearsal uses the agreed presenter account. It does not establish the
                  permissions of a restricted author account.
                </li>
                <li>
                  After rehearsal, unpublish only your practice article before removing it. Follow
                  the private baseline record for restoration, preserving later author edits.
                </li>
                <li>Close unused tabs. Restore any temporary viewport changes.</li>
              </ul>
              <p>Use these visitor-session resets only before rehearsal, not between live loops.</p>
              <div className="westfield-demo__reset-buttons">
                <button
                  type="button"
                  className="westfield-demo__button westfield-demo__button--secondary"
                  disabled={busy !== null}
                  onClick={() => void launch('home')}
                >
                  {busy === 'home' ? 'Starting…' : 'Reset and open plain Home'}
                </button>
                <button
                  type="button"
                  className="westfield-demo__button westfield-demo__button--secondary"
                  disabled={busy !== null}
                  onClick={() => void launch('instagram')}
                >
                  {busy === 'instagram' ? 'Starting…' : 'Start anonymous Instagram journey'}
                </button>
              </div>
            </details>
            <details className="westfield-demo__support">
              <summary>
                Rehearsal checklist · {checkedItems.length} of {rehearsalItems.length}
              </summary>
              <fieldset className="westfield-demo__checklist">
                <legend>Check these after trying the current flow</legend>
                {rehearsalItems.map((item, index) => (
                  <label key={item} htmlFor={`rehearsal-${index}`}>
                    <input
                      id={`rehearsal-${index}`}
                      type="checkbox"
                      checked={checkedItems.includes(item)}
                      onChange={() =>
                        setCheckedItems((previous) =>
                          previous.includes(item)
                            ? previous.filter((value) => value !== item)
                            : [...previous, item]
                        )
                      }
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </fieldset>
              <button
                className="westfield-demo__clear"
                type="button"
                disabled={checkedItems.length === 0}
                onClick={() => setCheckedItems([])}
              >
                Clear checklist
              </button>
            </details>
          </div>
        </details>
        <div className="westfield-demo__workspace" id="flows">
          <aside className="westfield-demo__rail">
            <nav aria-label="Demo flows">
              <p className="westfield-demo__eyebrow">Presentation order</p>
              <ol>
                {flows.map((flow) => (
                  <li key={flow.id}>
                    <a href={`#${flow.id}`}>
                      <span>{flow.code}</span>
                      {flow.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
          <div className="westfield-demo__flows">
            {flows.map((flow) => (
              <section
                className="westfield-demo__flow"
                id={flow.id}
                key={flow.id}
                aria-labelledby={`${flow.id}-title`}
              >
                <div className="westfield-demo__flow-heading">
                  <span className="westfield-demo__flow-number">{flow.code}</span>
                  <div>
                    <p className="westfield-demo__eyebrow">{flow.time}</p>
                    <h2 id={`${flow.id}-title`}>{flow.title}</h2>
                  </div>
                </div>
                <p className="westfield-demo__goal">{flow.goal}</p>
                <p className="westfield-demo__context">{flow.context}</p>
                <div className="westfield-demo__script">
                  {flow.blocks.map((block, index) => (
                    <Script key={`${flow.code}-${index}`} block={block} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
        <footer className="westfield-demo__footer">
          <p>Westfield · Presenter reference</p>
          <a href="#top">Back to top</a>
        </footer>
      </main>
    </>
  );
}
