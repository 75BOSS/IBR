import { getIronSession, nextProxyCookies } from 'iron-session';
import { type NextRequest, NextResponse } from 'next/server';
import { type AdminSession, sessionOptions } from '@/lib/session';

/**
 * Primer filtro del panel: sin cookie de sesión válida → al login, recordando a dónde iba.
 * No consulta la BD (corre en edge); la autorización real es requireAdmin() en el servidor.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === '/admin/login') return NextResponse.next();

  const response = NextResponse.next();
  const session = await getIronSession<AdminSession>(
    nextProxyCookies(request, response),
    sessionOptions(),
  );
  if (session.userId) return response;

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/admin/login';
  loginUrl.search = '';
  if (pathname !== '/admin') loginUrl.searchParams.set('next', pathname + search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
