/**
 * SERVICIO DE AUTORES - Gestión de autores
 */

import { createClient } from '@/lib/supabase/client';
import { Author } from '@/types';

const supabase = createClient();

/**
 * Obtener todos los autores
 */
export async function getAuthors(): Promise<Author[]> {
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .order('name');

  if (error) throw error;

  return data?.map(transformAuthor) || [];
}

/**
 * Obtener autor por ID
 */
export async function getAuthorById(id: string): Promise<Author | null> {
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data ? transformAuthor(data) : null;
}

/**
 * Obtener autor por email (útil para asociar con usuario de auth)
 */
export async function getAuthorByEmail(email: string): Promise<Author | null> {
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data ? transformAuthor(data) : null;
}

/**
 * Crear o obtener autor desde usuario autenticado
 */
export async function getOrCreateAuthorFromUser(userId: string, email: string, name: string): Promise<Author> {
  // Buscar si ya existe
  let author = await getAuthorByEmail(email);

  if (!author) {
    // Crear nuevo autor
    const { data, error } = await supabase
      .from('authors')
      .insert({
        name,
        email,
        role: 'writer',
      })
      .select()
      .single();

    if (error) throw error;
    author = transformAuthor(data);
  }

  return author;
}

function transformAuthor(data: any): Author {
  return {
    id: data.id,
    name: data.name,
    role: data.role || 'writer',
    avatar: data.avatar,
    bio: data.bio,
  };
}
