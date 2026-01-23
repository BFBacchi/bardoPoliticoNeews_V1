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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Las variables de entorno de Supabase no están configuradas. ' +
      'Por favor, configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en tu archivo .env.local'
    );
  }

  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
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
