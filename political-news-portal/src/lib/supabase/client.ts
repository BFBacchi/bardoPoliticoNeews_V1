/**
 * CLIENTE SUPABASE - Cliente del lado del cliente
 * 
 * Usado en componentes Client Components para:
 * - Autenticación
 * - Operaciones CRUD
 * - Storage de imágenes
 */

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
