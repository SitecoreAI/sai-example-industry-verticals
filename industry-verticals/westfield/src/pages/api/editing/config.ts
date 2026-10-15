import { EditingConfigMiddleware } from '@sitecore-content-sdk/nextjs/editing';
import components from '.sitecore/component-map';
import metadata from '.sitecore/metadata.json';

/**
 * This Next.js API route is used by Sitecore Editor in XM Cloud
 * to determine feature compatibility and configuration.
 */

// Westfield does not use Component Builder or Forms integrations in Page Builder.
const editingComponents = new Map(components);
editingComponents.delete('FEaaSWrapper');
editingComponents.delete('BYOCWrapper');
editingComponents.delete('Form');

const handler = new EditingConfigMiddleware({
  components: editingComponents,
  metadata,
}).getHandler();

export default handler;
