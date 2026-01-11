/**
 * ROBOTS.TXT - SEO
 * 
 * Configura las directivas para crawlers:
 * - Permite indexar contenido público
 * - Bloquea indexación del admin/backoffice
 * - Incluye referencia al sitemap
 * 
 * Next.js genera automáticamente el archivo en /robots.txt
 */

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/login',
          '/dashboard',
          '/editor',
          '/placas',
          '/api/',
          '/_next/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/login',
          '/dashboard',
          '/editor',
          '/placas',
        ],
      },
    ],
    sitemap: 'https://politicahoy.com/sitemap.xml',
  };
}
