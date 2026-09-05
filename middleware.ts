import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { isAuthorizedAdminEmail } from '@/lib/auth/admin-auth';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const pathname = request.nextUrl.pathname;
  const lowerPath = pathname.toLowerCase();

  // Handle case-insensitivity: redirect /Admin, /ADMIN to /admin
  if (lowerPath.startsWith('/admin') && pathname !== lowerPath) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = lowerPath;
    return NextResponse.redirect(redirectUrl);
  }

  // Only protect /admin routes
  if (lowerPath.startsWith('/admin')) {
    // Allow public access to login page
    if (lowerPath === '/admin/login') {
      return response;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      // If Supabase is not configured, redirect to login with error
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('error', 'missing_config');
      return NextResponse.redirect(loginUrl);
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    });

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', lowerPath);
      return NextResponse.redirect(loginUrl);
    }

    // Verify admin authorization
    const isAuthorized = isAuthorizedAdminEmail(user.email);
    if (!isAuthorized) {
      const unauthorizedUrl = new URL('/admin/login', request.url);
      unauthorizedUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/admin',
    '/Admin/:path*',
    '/Admin',
    '/ADMIN/:path*',
    '/ADMIN',
  ],
};
