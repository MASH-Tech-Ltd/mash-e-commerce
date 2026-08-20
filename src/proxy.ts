import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Get hostname (e.g., 'abcstore.myplatform.com' or 'localhost:3000')
  const hostname = request.headers.get('host') || '';
  
  // Exclude static files and API routes from proxy
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Parse tenant slug from hostname
  // For dev: support formats like slug.localhost:3000
  let currentHost = hostname;
  // Remove port if exists
  if (currentHost.includes(':')) {
    currentHost = currentHost.split(':')[0];
  }

  let tenantSlug = '';
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'localhost';

  if (currentHost === baseDomain) {
    // It's the main landing page, no tenant
    tenantSlug = 'main';
  } else if (currentHost.endsWith(`.${baseDomain}`)) {
    // It's a subdomain (e.g. mikes.localhost -> mikes)
    tenantSlug = currentHost.replace(`.${baseDomain}`, '');
  } else {
    // It's a custom domain (e.g. mycoolstore.com)
    // We pass the full host as the slug to resolve on backend
    tenantSlug = currentHost;
  }

  // Rewrite the URL to include the tenant slug dynamically in the path
  // We don't want to actually show this path to the user, so we use rewrite
  // Next.js App Router doesn't perfectly support dynamic param injection from middleware without rewrite
  // We'll pass the tenantSlug via headers so Server Components can read it
  
  const response = NextResponse.next();
  response.headers.set('x-tenant-slug', tenantSlug);
  return response;
}
