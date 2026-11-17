import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { JSX, useId, useRef, useState } from 'react';
import { getBrowserId } from '@sitecore-cloudsdk/core/browser';
import { resetDemoBrowserIdentity } from 'lib/demo-persona';

const siteUrl = 'https://thlt-westfield-demo.vercel.app';
const portalUrl = 'https://portal.sitecorecloud.io/';
const pageBuilderHomeUrl =
  'https://pages.sitecorecloud.io/editor?tenantName=sitecoresaae681-thltkirklan3127-kirklandaut0200&organization=org_JypIqqJsbEly6gh2&sc_itemid=27da11a8-e0dc-42d4-9e3f-b4073306679b&sc_lang=en&sc_site=westfield&sc_version=1';
const brandResourcesUrl =
  'https://app.sitecorecloud.io/brand-context?organization=org_JypIqqJsbEly6gh2&tenantName=sitecoresaae681-thltkirklan3127-kirklandaut0200';
const prosperaRecommendationsUrl =
  'https://app.sitecorecloud.io/channels/collection/45177ac3175042dc9bc748d76ba0858a/sites/d4c417d9-0acf-44f9-aec8-c94730b872bb/aeo-opportunities/readability?organization=org_vDtrEzJHxeuuB9cD&tenantName=sitecoresaa7acd-agverticals97fd-agvertsc3b5';
const damUrl = 'https://thlt-demo.sitecoresandbox.cloud/en-us/sitecore-dam-connect/approved-assets';
const graphQlExplorerUrl = 'https://edge.sitecorecloud.io/api/graphql/ide';
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
  | { kind: 'graphql-headers' }
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
    goal: 'Keep the Westfield experience familiar as its content becomes more relevant.',
    context: 'Home tab · anonymous visitor · fresh public-site session',
    blocks: [
      { kind: 'copy', label: 'Home tab', value: `${siteUrl}/`, url: true },
      {
        kind: 'say',
        text: 'Start with the website Westfield customers recognize, then follow how its content adapts to the visitor.',
      },
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
      {
        kind: 'say',
        text: 'Westfield can offer more relevant content within the same familiar brand experience. First, let us use browsing interest to choose the message.',
      },
      { kind: 'return', title: 'Browsing interests change the message' },
    ],
  },
  {
    id: 'affinity',
    code: 'P2',
    title: 'Reading builds an interest profile',
    time: '5 minutes',
    goal: 'Use browsing interest to help an anonymous visitor find relevant advice.',
    context: 'Home and Profiles tabs · same anonymous visitor as P1 · before Instagram',
    blocks: [
      { kind: 'copy', label: 'Home tab', value: `${siteUrl}/`, url: true },
      {
        kind: 'say',
        text: 'This visitor has not signed in. The advice they read gives Sitecore a signal about their interests.',
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
        title:
          'Read “How To Help Prevent Water Damage in Your Home or Business,” then “How To Prepare Your Home and Family for a Spring Thunderstorm.” Check the profile after each visit.',
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
        ],
      },
      {
        kind: 'result',
        text: 'The same anonymous profile records one Auto article and two Home articles. Home shows “Protection for the place you call home.”',
      },
      {
        kind: 'say',
        text: 'Westfield can guide visitors toward relevant advice before sign-in. Next, use the message that brought a visitor to the site.',
      },
      { kind: 'return', title: 'The website continues the Instagram message' },
    ],
  },
  {
    id: 'campaign',
    code: 'P3',
    title: 'The message continues from the ad',
    time: '2 minutes',
    goal: 'Give a prospective customer a consistent message from the ad to the website.',
    context: 'Instagram tab · same anonymous session as P2 · no customer sign-in yet',
    blocks: [
      { kind: 'copy', label: 'Instagram tab', value: `${siteUrl}/instagram/index.html`, url: true },
      {
        kind: 'say',
        text: 'This Instagram example uses the campaign that brought the visitor here to choose the website message.',
      },
      {
        kind: 'do',
        id: 'P3.1',
        title: 'Follow the Westfield ad to its matching Home message',
        actions: [
          'Switch to the prepared Instagram tab. Point out the Westfield sponsored post among unrelated friend posts.',
          'On “A new chapter. Protection for what’s next.” choose Learn more.',
          'Let the campaign entry open Home, then point out the matching message and imagery.',
        ],
      },
      {
        kind: 'result',
        text: 'The ad and Home both show “A new chapter. Protection for what’s next.” The visitor remains signed out.',
      },
      {
        kind: 'say',
        text: 'Westfield can continue the ad’s message on the website. Now sign in and use a customer’s known preference.',
      },
      { kind: 'return', title: 'Paperless status changes the message after sign-in' },
    ],
  },
  {
    id: 'customers',
    code: 'P4',
    title: 'Known customer information changes the offer',
    time: '7 minutes',
    goal: 'Match the service message to each customer’s existing paperless preference, then show how the team chooses each message.',
    context:
      'Home and Page Builder tabs · Casey, then Jordan · paste each email into both sign-in fields',
    blocks: [
      { kind: 'copy', label: 'Home tab', value: `${siteUrl}/`, url: true },
      {
        kind: 'say',
        text: 'After sign-in, a known customer preference helps Westfield choose a useful next step. Casey has not enrolled in paperless billing.',
      },
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
        ],
      },
      {
        kind: 'result',
        text: 'Casey receives the paperless offer. Jordan receives the coverage message. The header shows Logout while each customer is signed in.',
      },
      {
        kind: 'say',
        text: 'You have seen browsing interests, campaign context, and customer information change the message. Now see how the team chooses who sees each message in Page Builder.',
      },
      {
        kind: 'copy',
        label: 'Westfield Home in Page Builder',
        value: pageBuilderHomeUrl,
        url: true,
      },
      {
        kind: 'do',
        id: 'P4.3',
        title: 'Show the campaign and browsing-interest rules, then preview their Home messages',
        actions: [
          'Switch to the prepared Westfield Home in Page Builder tab. Stay in Editor; use the component controls rather than the top Personalize tab. On the canvas, select “Reliable Insurance, Real Peace of Mind.”',
          'In the right panel, choose Edit personalization rules. In Westfield Home messages, point out row 1: UTM Campaign → Is equal to → next_chapter, and row 2: Top Affinity → Is true. Top Affinity is the Home-interest check used in P2.',
          'Explain that the first matching rule chooses the message. The campaign is first, so its message takes priority over browsing interest. Choose Cancel to leave the rules unchanged.',
          'Open the component’s variant dropdown showing Original. Choose “1 UTM Campaign is equal to next_chapter” and show “A new chapter. Protection for what’s next.” Reopen the same dropdown and choose “2 Top Affinity is true” to show “Protection for the place you call home.”',
          'Restore Original before selecting the MyWestfield section. This previews the prepared experiences; leave the live rules unchanged.',
        ],
      },
      {
        kind: 'do',
        id: 'P4.4',
        title: 'Show the paperless-status rules and preview Casey’s and Jordan’s messages',
        actions: [
          'Scroll to MyWestfield on the Page Builder canvas and select “Your Personalized Insurance Hub.” In the right panel, choose Edit personalization rules.',
          'In Westfield customer recommendations, show Westfield paperless status → Is false for the paperless invitation and Is true for the coverage message. The original MyWestfield content is the fallback when neither rule matches. Choose Cancel.',
          'Open the component’s variant dropdown showing Original. Choose “1 Westfield paperless status is false” and show “Sign up for paperless billing.” Reopen the same dropdown and choose “2 Westfield paperless status is true” to show “Keep your coverage in step with life.”',
          'Restore Original. Leave the rules and content unchanged; no Save, Pause, or Publish is needed for this walkthrough.',
        ],
      },
      {
        kind: 'result',
        text: 'The Page Builder rules connect all three kinds of visitor information to the messages already seen on Home. The two paperless-status rules select Casey’s invitation and Jordan’s coverage message.',
      },
      {
        kind: 'say',
        text: 'The team can choose a message and its audience in Page Builder. Westfield can keep the paperless invitation relevant and give enrolled customers a useful alternative. Next, create the content behind these experiences.',
      },
      { kind: 'return', title: 'Creating an article in Page Builder' },
    ],
  },
  {
    id: 'authoring',
    code: 'P5',
    title: 'Create a page with confidence',
    time: '12 minutes',
    goal: 'Give authors a repeatable way to create useful advice, with brand guidance and editorial approval.',
    context:
      'Page Builder and Brand resources tabs · agreed presenter account · Westfield site · own new article',
    blocks: [
      { kind: 'copy', label: 'Sitecore Portal', value: portalUrl, url: true },
      { kind: 'phase', id: 'P5.1', title: 'Create the article' },
      {
        kind: 'say',
        text: 'Start with one new advice article. Its prepared structure lets the author focus on the message, image, and sections.',
      },
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
        text: 'Brand Context gives AI background about Westfield: its business, audiences, products, and messages.',
      },
      {
        kind: 'say',
        text: 'A Brand Kit gathers guidance for voice, writing, and visual style. Content Copilot uses the site’s selected kit to guide the article’s writing.',
      },
      { kind: 'copy', label: 'Brand resources tab', value: brandResourcesUrl, url: true },
      {
        kind: 'do',
        id: 'P5.brand.1',
        title: 'Show the context and writing guidance',
        actions: [
          'Switch to the prepared Brand resources tab. In Brand Context, open Westfield.',
          'Expand Content Guidelines, then double-click Style Guide. Point out the company knowledge and guidance available to Agentic Studio.',
          'Choose Design → Brand kits and open the existing Westfield kit. Open Sections → Tone of Voice.',
          "Choose Back to sections → Dos and Dont's. Point out the plain-language guidance and the limits on coverage and savings claims.",
          'Explain their main purposes: Brand Context helps AI understand Westfield and the task; a Brand Kit guides how AI communicates for Westfield. Both can be selected in Agentic Studio.',
          'For this article, Content Copilot uses the kit’s Brand Context, Tone of Voice, and Dos and Don’ts sections. The kit’s Brand Context section is separate from the company resource shown first. Return to the new article in Page Builder.',
        ],
      },
      {
        kind: 'result',
        text: 'The Westfield background in Brand Context and the writing guidance in the Brand Kit are visible. The article’s AI guidance comes from the site’s associated kit.',
      },
      { kind: 'phase', id: 'P5.2', title: 'Select an approved image' },
      {
        kind: 'say',
        text: 'Choose an approved Westfield image from the article’s image field, keeping asset selection within the author’s normal work.',
      },
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
          'Point out the retained paragraph in the first Section and confirm the workflow status is still Draft.',
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
          'In Layers, select the second complete Section and use Move up to place it above the first.',
          'Wait for Saved and confirm each Section’s heading and body moved together.',
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
        text: 'The approved article is live with its saved image and Section order. Visitors can find it through Articles and Search.',
      },
      {
        kind: 'say',
        text: 'Westfield authors have a repeatable path from an idea to published advice, with AI assistance, approved assets, and review in the same process.',
      },
      { kind: 'return', title: 'Choosing a message for each visitor' },
    ],
  },
  {
    id: 'ai-search',
    code: 'P6',
    title: 'Review content recommendations for AI search',
    time: '3 minutes',
    goal: 'Show how an AI-search recommendation can lead to a focused editorial review, using Prospera Bank as the example.',
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
        text: 'This separate Prospera Bank example connects an AI-search recommendation with the content an author can improve.',
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
        text: 'The suggested rewrite and its matching live description are visible together in Page Builder.',
      },
      {
        kind: 'say',
        text: 'Westfield could use this approach to turn an AI-search recommendation into a specific content review. Next, show how approved content can also support a future mobile app.',
      },
      { kind: 'return', title: 'Shared content for a Westfield mobile app' },
    ],
  },
  {
    id: 'shared-app-content',
    code: 'P7',
    title: 'Request shared content through GraphQL',
    time: '2 minutes',
    goal: 'Show how Westfield could reuse approved website content in a future mobile app.',
    context: 'Slide 15 · Home and Sitecore GraphQL explorer tabs · read-only published content',
    blocks: [
      { kind: 'copy', label: 'Home tab', value: `${siteUrl}/`, url: true },
      {
        kind: 'say',
        text: 'Westfield asked how Sitecore could support a mobile app. Start with a published article, then request its content through the built-in explorer.',
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
        label: 'Sitecore GraphQL explorer tab',
        value: graphQlExplorerUrl,
        url: true,
      },
      {
        kind: 'say',
        text: 'Run one prepared query for this article’s title, summary, and image.',
      },
      { kind: 'graphql-headers' },
      { kind: 'copy', label: 'Article content query', value: articleForAppQuery },
      {
        kind: 'do',
        id: 'P7.2',
        title: 'Run the query and compare the returned content',
        actions: [
          'Switch to the Sitecore GraphQL explorer tab.',
          'Choose HTTP HEADERS below the query pane and replace its contents with the complete GraphQL HTTP Headers copy card, including the API key.',
          'Replace the query pane contents with the Article content query.',
          'Choose the play button labeled Execute Query (Ctrl-Enter).',
          'Compare the returned title and summary with the article. Point out the matching image address and alternative text.',
        ],
      },
      {
        kind: 'result',
        text: 'The response contains the same published title, summary, and image used by the article on the website.',
      },
      {
        kind: 'say',
        text: 'Westfield can maintain approved advice once and make it available to the website and a future app. Each channel can present that content in its own screens.',
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
  'Page Builder shows the campaign, browsing-interest, and paperless-status rules; each variant previews its matching message and returns to Original without changing the live setup.',
  'A new Advice Article starts blank and retains its independent content.',
  'The Westfield Brand Context and Brand Kit open with the intended writing guidance.',
  'Content Copilot uses the selected Westfield Brand Kit; the reviewed paragraph saves in the intended Section.',
  'The Westfield DAM picker, permitted components, and Section reorder work.',
  'The article moves from Draft through Awaiting approval to Approved, then appears in Articles and Search.',
  'The Prospera Scrunch recommendation opens its matching Page Builder field without applying a change.',
  'The HTTP Headers copy card and query work in Sitecore’s GraphQL explorer and return the published claims-checklist title, summary, and image.',
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

function Script({
  block,
  graphQlApiKey,
}: {
  block: ScriptBlock;
  graphQlApiKey: string;
}): JSX.Element {
  switch (block.kind) {
    case 'copy':
      return <CopyValue {...block} />;
    case 'graphql-headers':
      return graphQlApiKey ? (
        <CopyValue
          label="GraphQL HTTP Headers"
          value={JSON.stringify({ sc_apikey: graphQlApiKey }, null, 2)}
        />
      ) : (
        <div className="westfield-demo__block westfield-demo__block--say" role="alert">
          <p className="westfield-demo__block-label">GraphQL HTTP Headers unavailable</p>
          <p>The demo’s Delivery API key has not been configured on this host.</p>
        </div>
      );
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

type DemoLaunchProps = {
  graphQlApiKey: string;
};

export const getServerSideProps: GetServerSideProps<DemoLaunchProps> = async ({ res }) => {
  res.setHeader('Cache-Control', 'private, no-store');
  return {
    props: {
      graphQlApiKey: process.env.WESTFIELD_DEMO_DELIVERY_API_KEY?.trim() || '',
    },
  };
};

export default function DemoLaunch({ graphQlApiKey }: DemoLaunchProps): JSX.Element {
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
          <p className="westfield-demo__eyebrow">Seven live loops · 32 minutes</p>
          <h1>Keep the next step in view.</h1>
          <p className="westfield-demo__lede">
            Show the website and native Sitecore tools to the audience. Keep this reference on a
            separate screen. Prepare the tabs first, then follow P1–P7 without returning here during
            the presentation.
          </p>
          <p className="westfield-demo__download">
            <a
              href="/demo/westfield-demo-cheat-sheet.pdf"
              download="Westfield Demo Cheat Sheet.pdf"
            >
              Download Kindle cheat sheet (PDF, 3 pages)
            </a>
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
                For P7, open Sitecore’s built-in GraphQL explorer and paste the complete HTTP
                Headers block and query from P7. The headers already include the API key. Confirm
                the article response before presenting. Keep the Home tab available for the website
                comparison. This two-minute loop fits within slide 15’s existing three-minute
                discussion at minutes 40–43.
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
              <h3>Publishing recovery</h3>
              <p>
                If approval does not start an automatic publishing job, choose Publish. Keep Page
                and Current language (English) selected, select Subpages to include this article’s
                local Data, and clear All references. Confirm that only your article and its local
                Data are in scope, choose Start publish, and wait for completion before showing the
                visitor result.
              </p>
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
                    <Script
                      key={`${flow.code}-${index}`}
                      block={block}
                      graphQlApiKey={graphQlApiKey}
                    />
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
