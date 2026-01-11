/**
 * UTILIDADES - Funciones helper para el portal
 */

import { type ClassValue, clsx } from 'clsx';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Category, ArticleStatus, PlacaFormat } from '@/types';

// Combinar clases de Tailwind de forma segura
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Formatear fecha para mostrar
export function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, "d 'de' MMMM, yyyy", { locale: es });
}

// Fecha relativa (hace 2 horas, ayer, etc.)
export function formatRelativeDate(dateString: string): string {
  const date = parseISO(dateString);
  return formatDistanceToNow(date, { addSuffix: true, locale: es });
}

// Fecha y hora completa
export function formatDateTime(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, "d MMM yyyy, HH:mm", { locale: es });
}

// Generar slug SEO-friendly desde título
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Solo alfanuméricos
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno
    .replace(/^-|-$/g, '') // Remover guiones al inicio/final
    .slice(0, 80); // Limitar longitud
}

// Calcular tiempo de lectura estimado
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, ''); // Remover HTML
  const wordCount = textContent.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

// Truncar texto con ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// Obtener label de categoría
export function getCategoryLabel(category: Category): string {
  const labels: Record<Category, string> = {
    politica: 'Política',
    economia: 'Economía',
    internacional: 'Internacional',
    sociedad: 'Sociedad',
    opinion: 'Opinión',
    breaking: 'Último Momento',
  };
  return labels[category] || category;
}

// Obtener color de categoría para badges
export function getCategoryColor(category: Category): string {
  const colors: Record<Category, string> = {
    politica: 'bg-blue-600',
    economia: 'bg-green-600',
    internacional: 'bg-purple-600',
    sociedad: 'bg-orange-600',
    opinion: 'bg-gray-600',
    breaking: 'bg-red-600',
  };
  return colors[category] || 'bg-gray-600';
}

// Obtener label de estado
export function getStatusLabel(status: ArticleStatus): string {
  const labels: Record<ArticleStatus, string> = {
    scraped: 'Scrapeada',
    rewritten: 'Reescrita',
    draft: 'Borrador',
    published: 'Publicada',
    archived: 'Archivada',
  };
  return labels[status] || status;
}

// Obtener color de estado para badges
export function getStatusColor(status: ArticleStatus): string {
  const colors: Record<ArticleStatus, string> = {
    scraped: 'bg-yellow-500 text-yellow-900',
    rewritten: 'bg-blue-500 text-white',
    draft: 'bg-gray-500 text-white',
    published: 'bg-green-500 text-white',
    archived: 'bg-gray-400 text-gray-800',
  };
  return colors[status] || 'bg-gray-500';
}

// Dimensiones de formatos de placa
export function getPlacaDimensions(format: PlacaFormat): { width: number; height: number; label: string } {
  const dimensions: Record<PlacaFormat, { width: number; height: number; label: string }> = {
    'instagram-reel': { width: 1080, height: 1920, label: 'Instagram Reel (9:16)' },
    'instagram-square': { width: 1080, height: 1080, label: 'Instagram Cuadrado (1:1)' },
    'instagram-story': { width: 1080, height: 1920, label: 'Instagram Story (9:16)' },
    'youtube-short': { width: 1080, height: 1920, label: 'YouTube Short (9:16)' },
    'twitter-card': { width: 1200, height: 675, label: 'Twitter Card (16:9)' },
    'facebook-post': { width: 1200, height: 630, label: 'Facebook Post (1.91:1)' },
  };
  return dimensions[format];
}

// Extraer texto plano de HTML
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

// Generar excerpt desde contenido
export function generateExcerpt(content: string, maxLength: number = 160): string {
  const plainText = stripHtml(content);
  return truncateText(plainText, maxLength);
}

// Validar URL
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Formatear número con separador de miles
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-AR').format(num);
}
