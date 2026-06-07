import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
// ...existing code...
const isProtectedRoute = createRouteMatcher(['/workspace(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Skip Clerk handshake requests to avoid large header/cookie redirects (431)
  const searchParams = (req as any).nextUrl?.searchParams ?? new URL(req.url).searchParams
  if (searchParams.has('__clerk_handshake')) return

  if (isProtectedRoute(req)) await auth.protect()
})
// ...existing code...
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}