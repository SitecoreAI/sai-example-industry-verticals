import Head from 'next/head';
import { JSX, useId, useRef, useState } from 'react';
import { getBrowserId } from '@sitecore-cloudsdk/core/browser';
import { resetDemoBrowserIdentity } from 'lib/demo-persona';

const siteUrl = 'https://thlt-westfield-demo.vercel.app';
const portalUrl = 'https://portal.sitecorecloud.io/';
const brandResourcesUrl =
  'https://app.sitecorecloud.io/brand-context?organization=org_JypIqqJsbEly6gh2&tenantName=sitecoresaae681-thltkirklan3127-kirklandaut0200';
const prosperaRecommendationsUrl =
  'https://app.sitecorecloud.io/channels/collection/45177ac3175042dc9bc748d76ba0858a/sites/d4c417d9-0acf-44f9-aec8-c94730b872bb/aeo-opportunities/readability?organization=org_vDtrEzJHxeuuB9cD&tenantName=sitecoresaa7acd-agverticals97fd-agvertsc3b5';
const damUrl = 'https://thlt-demo.sitecoresandbox.cloud/en-us/sitecore-dam-connect/approved-assets';
const graphQlSandboxUrl = 'https://studio.apollographql.com/sandbox/explorer';
const articleForAppQuery = `query WestfieldArticleForApp {
  item(
    path: "/sitecore/content/Westfield/westfield/Home/advice/home-inventory-checklist"
    language: "en"
  ) {
    title: field(name: "Title") { value }
    summary: field(name: "pageSummary") { value }
    image: field(name: "HeroImage") { jsonValue }
  }
}`;

const contentCopilotPrompt =
  'Write one short paragraph of 50–70 words for an advice article titled A simple home checkup. Encourage homeowners to record changes around their home and prepare questions for their independent insurance agent. Follow the selected Westfield brand kit. Do not invent coverage details or savings claims. Return only the paragraph, without a heading.';
const contentCopilotRefinementPrompt =
  'Make this paragraph 35–45 words. Keep the household-checkup and independent-agent message, use plain language, and follow the selected Westfield brand kit. Return only the revised paragraph.';

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
    context: 'Home tab · Casey, then Jordan · paste each email into both sign-in fields',
    blocks: [
      { kind: 'copy', label: 'Home tab', value: `${siteUrl}/`, url: true },
      { kind: 'say', text: 'A known customer fact helps the site choose a useful next step.' },
      { kind: 'copy', label: 'Casey email and password', value: 'casey@example.com' },
      {
        kind: 'do',
        id: 'P4.1',
        title: 'Sign in as Casey and show the paperless offer on Home',
        actions: [
          'From Home, choose Login → Customer.',
          'On Sign into My Westfield, paste Casey’s email into both the email and password fields. Choose SIGN IN.',
          'Home opens at the top. Point out Logout in the header, then scroll to the MyWestfield section.',
          'Show “Sign up for paperless billing.”',
        ],
      },
      {
        kind: 'say',
        text: 'Jordan already uses paperless billing, so the same place on Home has a different message.',
      },
      { kind: 'copy', label: 'Jordan email and password', value: 'jordan@example.com' },
      {
        kind: 'do',
        id: 'P4.2',
        title: 'Sign in as Jordan and compare the same section',
        actions: [
          'Choose Logout, then Login → Customer.',
          'Paste Jordan’s email into both the email and password fields, then choose SIGN IN.',
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
    time: '12 minutes',
    goal: 'Use brand guidance and AI assistance to create an article, then review it before publication.',
    context:
      'Page Builder and Brand resources tabs · agreed presenter account · Westfield site · own new article',
    blocks: [
      { kind: 'copy', label: 'Sitecore Portal', value: portalUrl, url: true },
      { kind: 'phase', id: 'P5.1', title: 'Create the article' },
      { kind: 'say', text: 'The prepared structure lets the author concentrate on content.' },
      { kind: 'copy', label: 'Article page name', value: 'home-checkup-demo' },
      {
        kind: 'do',
        id: 'P5.1.1',
        title: 'Create an Advice Article with one blank Section',
        actions: [
          'Switch to the prepared Page Builder tab for Westfield.',
          'Under advice, choose Create a page → Advice Article. Paste the Article page name, then press Enter.',
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
      { kind: 'phase', id: 'P5.brand', title: 'Explain Brand Context and Brand Kit' },
      {
        kind: 'say',
        text: 'Brand Context gives AI background about Westfield: its business, audiences, products, and messaging.',
      },
      {
        kind: 'say',
        text: 'A Brand Kit organizes brand guidance into reusable rules for voice, writing, and visual style. In this article demo, Content Copilot uses the Westfield site’s kit for writing guidance.',
      },
      { kind: 'copy', label: 'Brand resources tab', value: brandResourcesUrl, url: true },
      {
        kind: 'do',
        id: 'P5.brand.1',
        title: 'Show the context and writing guidance',
        actions: [
          'Switch to the prepared Brand resources tab. In Brand Context, open Westfield.',
          'Expand Content Guidelines, then double-click Style Guide. Explain that Brand Context holds editable company knowledge and guidance for Agentic Studio.',
          'Choose Design → Brand kits and open the existing Westfield kit. Open Sections → Tone of Voice.',
          "Choose Back to sections → Dos and Dont's. Point out the plain-language guidance and the limits on coverage and savings claims.",
          'Explain that both resources can be selected in Agentic Studio. The Brand Kit’s own Brand Context section belongs to the kit; it is separate from the Brand Context resource shown first.',
          'Explain that Content Copilot reads three sections from the site’s associated Brand Kit: Brand Context, Tone of Voice, and Dos and Don’ts. For this task, it uses those sections and does not search the full uploaded brand documents. Return to the Page Builder tab for your new article.',
        ],
      },
      {
        kind: 'result',
        text: 'The separate Brand Context and Brand Kit are visible. The Brand Kit sections used by Content Copilot are identified.',
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
      {
        kind: 'say',
        text: 'A Section keeps its heading and text together. AI can help draft the text.',
      },
      { kind: 'copy', label: 'First Section heading', value: 'Questions for your agent' },
      {
        kind: 'do',
        id: 'P5.3.1',
        title: 'Set the heading and open Content Copilot for the text',
        actions: [
          'Select the starting Section. In Content, paste the First Section heading into Heading and wait for Saved.',
          'In Layers, select this Section’s Text. In the Text panel, choose Optimize with AI.',
          'Keep the first Section’s Text selected. Content Copilot uses the Westfield site’s associated Brand Kit.',
        ],
      },
      { kind: 'copy', label: 'Content Copilot draft prompt', value: contentCopilotPrompt },
      {
        kind: 'do',
        id: 'P5.3.1-ai',
        title: 'Generate a paragraph and review it before applying the change',
        actions: [
          'Paste the Content Copilot draft prompt into Ask AI for content improvements, then choose Generate content. Wait until Ready! appears.',
          'Read the proposed paragraph. Check its meaning, plain language, and independent-agent message; confirm it adds no unsupported coverage or savings claims.',
          'Choose Keep optimized to retain the reviewed paragraph in this Section’s Text, then wait for Saved.',
          'Reopen the same article. Confirm the paragraph remains in the first Section and the workflow status is still Draft.',
        ],
      },
      {
        kind: 'result',
        text: 'Content Copilot has generated the first Section’s paragraph. The author has reviewed and saved it; the article is still a draft.',
      },
      { kind: 'copy', label: 'New Section name', value: 'Follow-up Section' },
      {
        kind: 'do',
        id: 'P5.3.1-add',
        title: 'Add another permitted Section with its own content item',
        actions: [
          'In Layers, expand headless-main → Partial design content → article-content-2.',
          'Use Plus → Insert into. Confirm the location-specific picker offers Section and Action.',
          'Choose Section → Assign content item. Select this article’s Data folder, then Create new → Section.',
          'Paste the New Section name, press Enter, wait for creation, and choose Assign.',
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
          'Paste the Second Section heading and Second Section text into their matching fields, then wait for Saved.',
          'In Layers, select the second complete Section and use its native Move up control to place it above the first.',
          'Wait for Saved, reopen the same article, and confirm both headings and bodies follow the saved order.',
          'Remove empty placements from this article before publication. Keep useful components in the library.',
        ],
      },
      {
        kind: 'result',
        text: 'Both complete Sections retain their own content and saved order. The article placeholder offers only its permitted components.',
      },
      { kind: 'phase', id: 'P5.4', title: 'Review, approve, and publish the article' },
      { kind: 'say', text: 'A draft goes through review before it becomes available to visitors.' },
      {
        kind: 'do',
        id: 'P5.4.1',
        title: 'Check the draft before sending it for review',
        actions: [
          'Preview Mobile (370 px) and Desktop Small (1024 px). Check the image, alternative text, links, required fields, and Section order.',
          'Return to the article and confirm its workflow status is Draft.',
        ],
      },
      { kind: 'copy', label: 'Review submission comment', value: 'Ready for editorial review.' },
      {
        kind: 'do',
        id: 'P5.4.1-submit',
        title: 'Submit the article for approval',
        actions: [
          'Choose Actions → Submit for approval.',
          'In Comment, paste the Review submission comment into Enter a comment, then choose Submit.',
          'Confirm the article now shows Awaiting approval.',
        ],
      },
      {
        kind: 'result',
        text: 'The article is Awaiting approval. Sending a draft for review does not publish it.',
      },
      { kind: 'say', text: 'Approval records that the reviewed content is ready for publication.' },
      { kind: 'copy', label: 'Approval comment', value: 'Approved for publication.' },
      {
        kind: 'do',
        id: 'P5.4.1-approve',
        title: 'Approve the reviewed article and publish it',
        actions: [
          'Using the agreed presenter account for this review, choose Actions → Approve.',
          'In Comment, paste the Approval comment into Enter a comment, then choose Submit.',
          'Confirm the workflow status is Approved.',
          'Open publishing jobs and wait for the automatic publishing job to finish before showing the visitor result.',
          'Only if no publishing job starts, choose the top Publish control. Keep Page and Current language (English) selected, select Subpages to include this article’s local Data, and clear All references.',
          'For this fallback, confirm only your article and its local Data are in scope, choose Start publish, then wait for the job to finish.',
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
  {
    id: 'ai-search',
    code: 'P6',
    title: 'Review content recommendations for AI search',
    time: '3 minutes',
    goal: 'Use the Prospera Bank example to connect a Scrunch recommendation with the content an author can review.',
    context:
      'After the website-reporting discussion · Prospera recommendations and Page Builder tabs · Sales Engineers 1 · agverticals / agverts · read-only example',
    blocks: [
      {
        kind: 'copy',
        label: 'Prospera Scrunch recommendations tab',
        value: prosperaRecommendationsUrl,
        url: true,
      },
      {
        kind: 'say',
        text: 'This Prospera Bank example shows how Scrunch recommendations can help an author review content for AI search.',
      },
      {
        kind: 'do',
        id: 'P6.1',
        title: 'Open a Scrunch recommendation for the Prospera home page',
        actions: [
          'Switch to the prepared Prospera Scrunch recommendations tab in Sales Engineers 1 → agverticals → agverts.',
          'Confirm the site is Prospera and the category is Readability & Clarity.',
          'On the Home row, choose Review, then find Cards · Description. Leave Select unchanged.',
          'Compare Original content and Suggested content. Point out how the suggestion makes the credit-card description clearer.',
        ],
      },
      {
        kind: 'say',
        text: 'The author can compare the suggestion with the matching field in Page Builder before deciding whether to change it.',
      },
      {
        kind: 'do',
        id: 'P6.2',
        title: 'Review the matching content in Page Builder',
        actions: [
          'Use the Open in Page Builder icon beside Select for the Cards · Description recommendation.',
          'In Page Builder’s AEO opportunities panel, point out Powered by Scrunch.',
          'For Cards · Description, choose Show live content. Compare Recommended | Rewritten with Live content.',
          'Choose Scroll to content and point out the outlined Features Carousel → Description field.',
          'Leave this example unchanged. Do not choose Apply, Dismiss, or Publish.',
        ],
      },
      {
        kind: 'result',
        text: 'The Prospera recommendation and its matching live field are visible in Page Builder. No content has changed.',
      },
      { kind: 'return', title: 'Shared content for a Westfield mobile app' },
    ],
  },
  {
    id: 'shared-app-content',
    code: 'P7',
    title: 'Request shared content through GraphQL',
    time: '2 minutes',
    goal: 'Show how a mobile app can request the same published editorial content as the website.',
    context: 'Slide 15 · Home and prepared Apollo Sandbox tabs · read-only published content',
    blocks: [
      { kind: 'copy', label: 'Home tab', value: `${siteUrl}/`, url: true },
      {
        kind: 'say',
        text: 'The same published article content can support the website and a mobile app.',
      },
      {
        kind: 'do',
        id: 'P7.1',
        title: 'Show the published claims-checklist article',
        actions: [
          'From Home, choose About Us → Articles.',
          'Open “Property Insurance Claims Checklist: What To Do Before and After a Loss.”',
          'Point out the article title, introductory summary, and image.',
        ],
      },
      {
        kind: 'copy',
        label: 'Apollo Sandbox API tab',
        value: graphQlSandboxUrl,
        url: true,
      },
      {
        kind: 'say',
        text: 'This request asks Experience Edge for the article’s title, summary, and image. It does not request the website’s page layout.',
      },
      { kind: 'copy', label: 'Article content query', value: articleForAppQuery },
      {
        kind: 'do',
        id: 'P7.2',
        title: 'Run the query and compare the returned content',
        actions: [
          'Switch to the prepared Apollo Sandbox tab connected to Westfield’s published Experience Edge content.',
          'Replace the Operation editor contents with the Article content query. No query variables are needed.',
          'Choose the play button labeled WestfieldArticleForApp above the Operation editor.',
          'In the response, point out title.value, summary.value, and image.jsonValue.value. Compare the title and summary with the article, then point out the image address and alternative text.',
        ],
      },
      {
        kind: 'say',
        text: 'An app can use these content fields in its own screens. The author maintains the content in Sitecore, while each channel controls its presentation.',
      },
      {
        kind: 'result',
        text: 'The API returns the same published article title, summary, and image used by the website. The request retrieves content without the website’s page layout.',
      },
      { kind: 'return', title: 'Underwriter search has different requirements' },
    ],
  },
];

const rehearsalItems = [
  'The fresh Home session and matching native profile are ready.',
  'All three article visits appear in the same profile before Home changes.',
  'The Instagram ad opens its matching Home message after the affinity loop.',
  'Casey and Jordan receive their different offers on Home, and Logout works.',
  'A new Advice Article starts blank and retains its independent content.',
  'The Westfield Brand Context and Brand Kit open with the intended writing guidance.',
  'Content Copilot uses the selected Westfield Brand Kit; the reviewed paragraph saves in the intended Section.',
  'The Westfield DAM picker, permitted components, and Section reorder work.',
  'The article moves from Draft through Awaiting approval to Approved, then appears in Articles and Search.',
  'The Prospera Scrunch recommendation opens its matching Page Builder field without applying a change.',
  'The prepared Experience Edge GraphQL query returns the published claims-checklist title, summary, and image.',
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
          <p className="westfield-demo__eyebrow">Seven live loops · 30 minutes</p>
          <h1>Keep the next step in view.</h1>
          <p className="westfield-demo__lede">
            Show the website and native Sitecore tools to the audience. Keep this reference on a
            separate screen. Prepare the tabs first, then follow P1–P7 without returning here during
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
                Prepare named Page Builder, Profiles, and Brand resources tabs. In Brand resources,
                open the Westfield Brand Context and Westfield Brand Kit. In the site dashboard,
                confirm Localization → Configuration shows the Westfield Brand kit. Confirm Content
                Copilot is available for the new article’s Section text. Use the agreed presenter
                account and the private deck notes for sign-in details.
              </li>
              <li>
                Sign in to the shared DAM before opening its picker. Confirm home-checkup-demo is
                unused before P5. If your own earlier practice article uses that name, retire only
                that practice content outside the live sequence or prepare another unused name.
                Leave other authors’ drafts alone.
              </li>
              <li>
                For P6, prepare a separate Prospera Scrunch recommendations tab in Sales Engineers 1
                → agverticals → agverts. Confirm the Home recommendation opens its matching Page
                Builder field. Keep the Westfield tabs available. This separate product example
                follows the website-reporting discussion at minutes 37–40.
              </li>
              <li>
                For P7, reuse the prepared Westfield Apollo Sandbox workspace in the same browser
                profile used for rehearsal. Confirm the schema connects and run the article query
                before presenting. Leave the connection configured for the live loop and keep its
                settings outside this guide. Keep the Home tab available for the website comparison.
                This two-minute loop fits within slide 15’s existing three-minute discussion at
                minutes 40–43.
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
                  If a result is still pending, say so. Use this guide on a separate screen to
                  explain the intended flow, then continue the presentation.
                </li>
                <li>
                  The accounts and campaign are synthetic. The sign-in example does not change a
                  policy or billing preference, and no live CRM connection is demonstrated. For
                  these two demo accounts, the password matches the email address.
                </li>
                <li>
                  This rehearsal uses the agreed presenter account. It does not establish the
                  permissions of a restricted author account.
                </li>
                <li>
                  The Westfield brand resources are demo guidance based on public material, not a
                  formally approved Westfield brand book. Agentic Studio can use Brand Context and
                  Brand Kits together. Content Copilot uses the associated kit’s Brand Context, Tone
                  of Voice, and Dos and Don’ts sections, not its full uploaded documents.
                </li>
                <li>
                  After rehearsal, unpublish only your practice article before removing it. Follow
                  the private baseline record for restoration, preserving later author edits.
                </li>
                <li>
                  If the prepared Scrunch recommendation is unavailable, say that the live result is
                  unavailable. Refer to P6 in this guide on a separate screen, and leave Prospera’s
                  existing recommendations and content unchanged.
                </li>
                <li>Close unused tabs. Restore any temporary viewport changes.</li>
              </ul>
              <h3>Optional Content Copilot refinement</h3>
              <CopyValue
                label="Content Copilot refinement prompt"
                value={contentCopilotRefinementPrompt}
              />
              <p>
                If the paragraph needs a shorter version, keep the same Section’s Text selected and
                reopen Optimize with AI. Paste the refinement prompt into Ask AI for content
                improvements and choose Generate content. When Ready! appears, review the new
                paragraph, then choose Keep optimized. Wait for Saved and confirm the article
                remains Draft.
              </p>
              <h3>Prepared text if AI is unavailable</h3>
              <CopyValue
                label="First Section text fallback"
                value="Review the changes around your home and bring your questions to your insurance agent."
              />
              <p>
                State that the AI result is pending. Use this prepared text only to continue the
                authoring demonstration; pasting it does not demonstrate AI generation.
              </p>
              <h3>Optional review revision</h3>
              <CopyValue
                label="Revision request comment"
                value="Please revise the article before publication."
              />
              <p>
                While your practice article is Awaiting approval, choose Actions → Return to draft.
                In Comment, paste the Revision request comment into Enter a comment, then choose
                Submit. Confirm Draft, make the changes, and submit for approval again before
                following the main approval steps.
              </p>
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
