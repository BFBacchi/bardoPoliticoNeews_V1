/**
 * MIDDLEWARE - Protección de rutas del admin
 * 
 * Protege las rutas del backoffice requiriendo autenticación.
 * Redirige a /login si el usuario no está autenticado.
 */

import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Actualizar sesión de Supabase
  const response = await updateSession(request);

  // Rutas protegidas del admin (excepto login)
  const protectedPaths = ['/dashboard', '/editor', '/placas'];
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    // Verificar autenticación
    const supabase = await import('@/lib/supabase/server').then(m => m.createClient());
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Redirigir a login si no está autenticado
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  // Si está en /login y ya está autenticado, redirigir a dashboard
  if (request.nextUrl.pathname === '/login') {
    const supabase = await import('@/lib/supabase/server').then(m => m.createClient());
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const redirect = request.nextUrl.searchParams.get('redirect') || '/dashboard';
      return NextResponse.redirect(new URL(redirect, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
