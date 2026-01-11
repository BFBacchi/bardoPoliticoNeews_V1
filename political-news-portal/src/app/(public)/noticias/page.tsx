/**
 * LISTADO DE NOTICIAS - Página de Archivo
 * 
 * Muestra todas las noticias publicadas con:
 * - Filtros por categoría
 * - Paginación
 * - Layout tipo diario
 * - URLs SEO-friendly
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { ArticleCard } from '@/components/news/article-card';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { getPublishedArticles, categories } from '@/lib/mock-data';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Todas las Noticias',
  description: 'Explorá todas las noticias de actualidad política. Filtros por categoría y archivo completo.',
  openGraph: {
    title: 'Todas las Noticias | PolíticaHoy',
    description: 'Explorá todas las noticias de actualidad política.',
  },
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
    categoria?: string;
  }>;
}

export default async function NoticiasPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const selectedCategory = params.categoria;
  
  // Obtener artículos (en producción vendría de API)
  let articles = getPublishedArticles();
  
  // Filtrar por categoría si está seleccionada
  if (selectedCategory) {
    articles = articles.filter(a => a.category === selectedCategory);
  }
  
  // Paginación simulada
  const pageSize = 9;
  const totalPages = Math.ceil(articles.length / pageSize);
  const paginatedArticles = articles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: 'Noticias' }]} />

      {/* Page Header */}
      <header className="mb-8">
        <h1 className="font-playfair text-4xl font-bold text-gray-900 mb-2">
          Todas las Noticias
        </h1>
        <p className="text-gray-600">
          Explorá nuestro archivo completo de noticias políticas
        </p>
      </header>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/noticias"
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            !selectedCategory
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          Todas
        </Link>
        {categories.map((category) => (
          <Link
            key={category.value}
            href={`/noticias?categoria=${category.value}`}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              selectedCategory === category.value
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {category.label}
          </Link>
        ))}
      </div>

      {/* Articles Grid */}
      <Suspense fallback={<ArticlesGridSkeleton />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="default"
              showExcerpt
            />
          ))}
        </div>
      </Suspense>

      {/* Empty State */}
      {paginatedArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No se encontraron noticias en esta categoría.
          </p>
          <Link
            href="/noticias"
            className="inline-block mt-4 text-red-600 hover:text-red-700 font-medium"
          >
            Ver todas las noticias
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={`/noticias?page=${page}${selectedCategory ? `&categoria=${selectedCategory}` : ''}`}
              className={cn(
                'w-10 h-10 flex items-center justify-center rounded-md font-medium transition-colors',
                currentPage === page
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {page}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}

// Skeleton loader para la grilla
function ArticlesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 rounded-lg aspect-[16/10] mb-4" />
          <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
          <div className="h-6 bg-gray-200 rounded w-full mb-2" />
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
