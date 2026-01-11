/**
 * SITEMAP DINÁMICO - SEO
 * 
 * Genera automáticamente un sitemap.xml con:
 * - Todas las noticias publicadas
 * - Páginas de categoría
 * - Páginas estáticas
 * 
 * Next.js genera automáticamente el archivo en /sitemap.xml
 * 
 * INTEGRACIÓN:
 * Cuando se conecte el backend, reemplazar mockArticles
 * por una llamada a la API para obtener noticias actuales.
 */

import { MetadataRoute } from 'next';
import { mockArticles, categories } from '@/lib/mock-data';

const baseUrl = 'https://politicahoy.com';

export default function sitemap(): MetadataRoute.Sitemap {
  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${baseUrl}/noticias`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ];

  // Páginas de categoría
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/noticias/categoria/${category.value}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Páginas de artículos publicados
  const articlePages: MetadataRoute.Sitemap = mockArticles
    .filter((article) => article.status === 'published')
    .map((article) => ({
      url: `${baseUrl}/noticias/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

  return [...staticPages, ...categoryPages, ...articlePages];
}
