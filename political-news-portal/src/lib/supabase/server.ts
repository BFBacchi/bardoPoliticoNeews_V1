/**
 * CLIENTE SUPABASE - Cliente del lado del servidor
 * 
 * Usado en Server Components y Server Actions para:
 * - Lectura de datos en SSR
 * - Operaciones seguras del servidor
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Las cookies pueden fallar en Server Actions
          }
        },
      },
    }
  );
}
