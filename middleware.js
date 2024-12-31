import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request) {
    const { pathname } = request.nextUrl;
    const isCookiesExist = !!request.cookies.get('user_token');//!! artinya boolean
    const isLoginPage = pathname.startsWith('/login');
    const isRegisterPage = pathname.startsWith('/register');
    console.log("Middleware => ", isCookiesExist);
    if (!isCookiesExist && !isLoginPage && !isRegisterPage) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    if (isCookiesExist && isLoginPage) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    // return NextResponse.redirect(new URL('/home', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}