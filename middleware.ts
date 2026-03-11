import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/session';

const PROTECTED = ['/dashboard', '/portfolio', '/credit-cards'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PROTECTED.some((p) => pathname.startsWith(p))) {
    const token = getTokenFromRequest(req);
    const session = token ? await verifyToken(token) : null;

    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/portfolio/:path*', '/credit-cards/:path*'],
};
