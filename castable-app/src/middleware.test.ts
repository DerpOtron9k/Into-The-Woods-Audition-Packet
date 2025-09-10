import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isProtectedRoute = (pathname: string) => {
  return pathname.startsWith('/dashboard') ||
         pathname.startsWith('/api/shows') ||
         pathname.startsWith('/api/applicants') ||
         pathname.startsWith('/api/upload') ||
         pathname.startsWith('/api/analytics') ||
         pathname.startsWith('/api/data');
};

export function middleware(request: NextRequest) {
  // In test mode, just allow all requests through
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};