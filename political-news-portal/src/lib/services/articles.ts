/**
 * SERVICIO DE ARTÍCULOS - CRUD con Supabase
 * 
 * Funciones para gestionar artículos en la base de datos
 */

import { createClient } from '@/lib/supabase/client';
import { Article, ArticleInput, ArticleStatus, Category } from '@/types';

const supabase = createClient();

/**
 * Obtener todos los artículos (con filtros opcionales)
 */
export async function getArticles(filters?: {
  status?: ArticleStatus;
  category?: Category;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from('articles')
    .select(`
      *,
      category:categories(*),
      author:authors(*)
    `)
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.category) {
    query = query.eq('category_id', filters.category);
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data?.map(transformArticle) || [];
}

/**
 * Obtener un artículo por ID
 */
export async function getArticleById(id: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*),
      author:authors(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No encontrado
    throw error;
  }

  return data ? transformArticle(data) : null;
}

/**
 * Obtener un artículo por slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*),
      author:authors(*)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data ? transformArticle(data) : null;
}

/**
 * Crear un nuevo artículo
 */
export async function createArticle(input: ArticleInput & { authorId: string }): Promise<Article> {
  // Generar slug único
  const baseSlug = generateSlug(input.title);
  let slug = baseSlug;
  let counter = 1;

  // Verificar si el slug ya existe
  while (true) {
    const { data } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', slug)
      .single();

    if (!data) break; // Slug disponible
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  // Calcular tiempo de lectura aproximado
  const readingTime = calculateReadingTime(input.content);

  const { data, error } = await supabase
    .from('articles')
    .insert({
      slug,
      title: input.title,
      subtitle: input.subtitle,
      excerpt: input.excerpt || input.subtitle || input.title.substring(0, 150),
      content: input.content,
      category_id: input.category,
      author_id: input.authorId,
      featured_image: input.featuredImage,
      image_caption: input.imageCaption,
      status: input.status,
      tags: input.tags || [],
      reading_time: readingTime,
      source: input.source,
      meta_title: input.metaTitle,
      meta_description: input.metaDescription,
      published_at: input.status === 'published' ? new Date().toISOString() : null,
    })
    .select(`
      *,
      category:categories(*),
      author:authors(*)
    `)
    .single();

  if (error) throw error;

  return transformArticle(data);
}

/**
 * Actualizar un artículo
 */
export async function updateArticle(
  id: string,
  input: Partial<ArticleInput>
): Promise<Article> {
  const updates: any = {};

  if (input.title !== undefined) {
    // Si cambió el título, regenerar slug
    const baseSlug = generateSlug(input.title);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const { data } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .single();

      if (!data) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    updates.slug = slug;
    updates.title = input.title;
  }

  if (input.subtitle !== undefined) updates.subtitle = input.subtitle;
  if (input.excerpt !== undefined) updates.excerpt = input.excerpt;
  if (input.content !== undefined) {
    updates.content = input.content;
    updates.reading_time = calculateReadingTime(input.content);
  }
  if (input.category !== undefined) updates.category_id = input.category;
  if (input.featuredImage !== undefined) updates.featured_image = input.featuredImage;
  if (input.imageCaption !== undefined) updates.image_caption = input.imageCaption;
  if (input.status !== undefined) {
    updates.status = input.status;
    // Si se publica, establecer fecha de publicación
    if (input.status === 'published' && !updates.published_at) {
      updates.published_at = new Date().toISOString();
    }
  }
  if (input.tags !== undefined) updates.tags = input.tags;
  if (input.source !== undefined) updates.source = input.source;
  if (input.metaTitle !== undefined) updates.meta_title = input.metaTitle;
  if (input.metaDescription !== undefined) updates.meta_description = input.metaDescription;

  const { data, error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      category:categories(*),
      author:authors(*)
    `)
    .single();

  if (error) throw error;

  return transformArticle(data);
}

/**
 * Eliminar un artículo
 */
export async function deleteArticle(id: string): Promise<void> {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Obtener estadísticas del dashboard
 */
export async function getDashboardStats() {
  const { data: allArticles } = await supabase
    .from('articles')
    .select('status');

  const stats = {
    total: allArticles?.length || 0,
    published: allArticles?.filter(a => a.status === 'published').length || 0,
    draft: allArticles?.filter(a => a.status === 'draft').length || 0,
    scraped: allArticles?.filter(a => a.status === 'scraped').length || 0,
    rewritten: allArticles?.filter(a => a.status === 'rewritten').length || 0,
    archived: allArticles?.filter(a => a.status === 'archived').length || 0,
  };

  return stats;
}

/**
 * Transformar datos de Supabase a tipo Article
 */
function transformArticle(data: any): Article {
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    subtitle: data.subtitle || '',
    excerpt: data.excerpt || '',
    content: data.content,
    category: data.category_id || (data.category?.id),
    author: {
      id: data.author_id || (data.author?.id),
      name: data.author?.name || 'Sin autor',
      role: data.author?.role || 'writer',
      avatar: data.author?.avatar,
      bio: data.author?.bio,
    },
    featuredImage: data.featured_image || '',
    imageCaption: data.image_caption,
    publishedAt: data.published_at || data.created_at,
    updatedAt: data.updated_at,
    readingTime: data.reading_time || 0,
    status: data.status,
    tags: data.tags || [],
    source: data.source,
    originalContent: data.original_content,
    rewrittenContent: data.rewritten_content,
    aiModel: data.ai_model,
    scrapedAt: data.scraped_at,
    metaTitle: data.meta_title,
    metaDescription: data.meta_description,
    ogImage: data.og_image,
  };
}

/**
 * Generar slug a partir de un título
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Calcular tiempo de lectura aproximado
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, ''); // Remover HTML
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
