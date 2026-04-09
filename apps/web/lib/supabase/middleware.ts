import { createServerClient, type SetAllCookies } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getRequiredAppEnv, hasRequiredAppEnv } from '@/lib/env';

const protectedRoutes = ['/dashboard', '/settings', '/projects'];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!hasRequiredAppEnv) {
    return response;
  }

  const env = getRequiredAppEnv();

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.supabasePublicKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const isProtected = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));
  const isAuth = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup');

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user && isAuth) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return response;
}
