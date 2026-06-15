import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

const roleRoutes: Record<string, string[]> = {
  super_admin: ['/admin', '/clinic/patients'],
  business_admin: ['/clinic'],
  staff: ['/clinic/patients'],
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  const publicPaths = ['/', '/login', '/signup'];
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));

  if (!isLoggedIn && !isPublic) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isPublic && pathname !== '/') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (isLoggedIn && req.auth?.user) {
    const role = req.auth.user.role;
    const allowedPrefixes = roleRoutes[role ?? ''] ?? [];

    if (pathname.startsWith('/admin') && !allowedPrefixes.includes('/admin')) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (
      pathname.startsWith('/clinic') &&
      !allowedPrefixes.some((p) => pathname.startsWith(p))
    ) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
