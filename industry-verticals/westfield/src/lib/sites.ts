import siteMetadata from '.sitecore/sites.json';
import scConfig from 'sitecore.config';

// Each customer head resolves only its configured site from native SDK metadata.
export default siteMetadata.filter((site) => site.name === scConfig.defaultSite);
