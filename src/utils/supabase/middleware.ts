import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refreshing the auth token and checking session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect /dashboard and /admin routes
  const protectedRoutes = ['/dashboard', '/admin']
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('message', 'Please log in to access this page')
    return NextResponse.redirect(loginUrl)
  }

  // Middleware Role Check for /admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && user) {
    const adminEmails = process.env.ADMIN_EMAILS?.toLowerCase().split(',').map(e => e.replace(/['"]/g, '').trim()) || [];
    const isHardcodedAdmin = user.email && adminEmails.includes(user.email.toLowerCase());
    
    if (!isHardcodedAdmin) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (profile?.role !== 'SUPER_ADMIN' && profile?.role !== 'ADMIN') {
        const dashboardUrl = request.nextUrl.clone();
        dashboardUrl.pathname = '/dashboard';
        dashboardUrl.searchParams.set('error', 'unauthorized_admin_access');
        return NextResponse.redirect(dashboardUrl);
      }
    }
  }

  // Admin 2FA Protection — only enforce when accessing /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const adminEmails2fa = process.env.ADMIN_EMAILS?.toLowerCase().split(',').map(e => e.replace(/['"]/g, '').trim()) || [];
    if (user && user.email && adminEmails2fa.includes(user.email.toLowerCase())) {
      const has2fa = request.cookies.get('admin_2fa_verified');
      if (!has2fa && !request.nextUrl.pathname.startsWith('/verify-admin')) {
        const verifyUrl = request.nextUrl.clone();
        verifyUrl.pathname = '/verify-admin';
        return NextResponse.redirect(verifyUrl);
      }
    }
  }

  // Prevent logged-in users from seeing login/signup pages
  const authRoutes = ['/login', '/signup', '/forgot-password']
  const isAuthRoute = authRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  
  if (isAuthRoute && user) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    return NextResponse.redirect(dashboardUrl)
  }

  return supabaseResponse
}
