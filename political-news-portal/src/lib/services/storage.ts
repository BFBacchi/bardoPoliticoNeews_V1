/**
 * SERVICIO DE STORAGE - Gestión de imágenes en Supabase Storage
 * 
 * Funciones para subir, eliminar y obtener URLs de imágenes
 */

import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
const BUCKET_NAME = 'images';

/**
 * Subir una imagen al storage
 */
export async function uploadImage(
  file: File,
  folder?: string
): Promise<{ path: string; url: string }> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  const { error, data } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return {
    path: filePath,
    url: urlData.publicUrl,
  };
}

/**
 * Eliminar una imagen del storage
 */
export async function deleteImage(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path]);

  if (error) throw error;
}

/**
 * Obtener URL pública de una imagen
 */
export function getImageUrl(path: string): string {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Subir imagen desde URL (útil para scraping)
 */
export async function uploadImageFromUrl(
  url: string,
  folder?: string
): Promise<{ path: string; url: string }> {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], 'image.jpg', { type: blob.type });

  return uploadImage(file, folder);
}
