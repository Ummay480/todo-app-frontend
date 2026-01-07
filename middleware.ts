import { NextResponse, type NextRequest } from "next/server";

// Since our auth is handled client-side with localStorage,
// we'll keep a minimal middleware for static assets and API routes
export default async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Skip middleware for API routes and static assets
	if (pathname.startsWith('/api/') ||
	    pathname.startsWith('/_next/') ||
	    pathname.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/)) {
		return NextResponse.next();
	}

	// Allow all routes to be accessed; authentication is handled client-side
	return NextResponse.next();
}

export const config = {
	matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
