/**
 * PÁGINA DE CATEGORÍA - Listado filtrado por sección
 * 
 * Muestra todas las noticias de una categoría específica.
 * SEO optimizado con metadata dinámica.
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/news/article-card';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { getArticlesByCategory, categories } from '@/lib/mock-data';
import { getCategoryLabel } from '@/lib/utils';
import { Category } from '@/types';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ cat: string }>;
}

// Generar rutas estáticas para todas las categorías
export async function generateStaticParams() {
  return categories.map((category) => ({
    cat: category.value,
  }));
}

// Generar metadata SEO dinámica
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cat } = await params;
  const category = categories.find((c) => c.value === cat);
  
  if (!category) {
    return {
      title: 'Categoría no encontrada',
    };
  }

  return {
    title: `Noticias de ${category.label}`,
    description: category.description,
    openGraph: {
      title: `Noticias de ${category.label} | PolíticaHoy`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { cat } = await params;
  const category = categories.find((c) => c.value === cat);

  if (!category) {
    notFound();
  }

  const articles = getArticlesByCategory(cat as Category);

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs
        items={[
          { label: 'Noticias', href: '/noticias' },
          { label: category.label },
        ]}
      />

      {/* Page Header */}
      <header className="mb-8 pb-6 border-b border-gray-200">
        <h1 className="font-playfair text-4xl font-bold text-gray-900 mb-2">
          {category.label}
        </h1>
        <p className="text-gray-600 text-lg">
          {category.description}
        </p>
      </header>

      {/* Category Navigation */}
      <nav className="flex flex-wrap gap-2 mb-8">
        {categories.map((c) => (
          <Link
            key={c.value}
            href={`/noticias/categoria/${c.value}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              c.value === cat
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {c.label}
          </Link>
        ))}
      </nav>

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="default"
              showExcerpt
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No hay noticias en esta categoría todavía.
          </p>
          <Link
            href="/noticias"
            className="inline-block mt-4 text-red-600 hover:text-red-700 font-medium"
          >
            Ver todas las noticias
          </Link>
        </div>
      )}
    </div>
  );
}
