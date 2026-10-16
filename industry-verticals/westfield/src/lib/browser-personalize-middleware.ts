import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import '@sitecore-cloudsdk/personalize/server';
import { PersonalizeMiddleware } from '@sitecore-content-sdk/nextjs/middleware';
import type { NextRequest, NextResponse } from 'next/server';

/** Keep the native rule decision bound to the current browser after a demo sign-in. */
export class BrowserPersonalizeMiddleware extends PersonalizeMiddleware {
  protected async initPersonalizeServer({
    hostname,
    siteName,
    request,
    response,
  }: {
    hostname: string;
    siteName: string;
    request: NextRequest;
    response: NextResponse;
  }): Promise<void> {
    // Cloud SDK 0.5.8 can reuse a previous request's cached guest when this demo's
    // identity reset leaves a browser cookie without a personalize cookie. Let
    // Sitecore resolve the current browser ID instead. Stock native decisions,
    // variant validation and routing stay in the base middleware. This demo
    // demonstrates rule targeting; it does not demonstrate A/B/n assignment.
    await CloudSDK(request, response, {
      sitecoreEdgeUrl: this.config.edgeUrl,
      sitecoreEdgeContextId: this.config.contextId || this.config.clientContextId || '',
      siteName,
      cookieDomain: hostname,
      enableServerCookie: true,
    })
      .addPersonalize({ enablePersonalizeCookie: false })
      .initialize();
  }
}
