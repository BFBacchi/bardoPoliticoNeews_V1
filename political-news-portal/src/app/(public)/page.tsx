/**
 * HOME PAGE - Página Principal del Portal
 * 
 * Diseño inspirado en Infobae con:
 * - Hero con noticia principal destacada
 * - Noticias secundarias en grilla
 * - Secciones por categoría
 * - Jerarquía visual clara
 * 
 * Este es un Server Component que renderiza
 * contenido estático/SSR para óptimo SEO.
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ArticleCard } from '@/components/news/article-card';
import { 
  getFeaturedArticle, 
  getSecondaryArticles, 
  getLatestArticles,
  getArticlesByCategory,
  categories 
} from '@/lib/mock-data';
import { getCategoryLabel } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'PolíticaHoy - Noticias de Actualidad Política',
  description: 'Las últimas noticias políticas del país y el mundo. Cobertura en tiempo real, análisis y opinión.',
};

export default function HomePage() {
  const featuredArticle = getFeaturedArticle();
  const secondaryArticles = getSecondaryArticles();
  const latestArticles = getLatestArticles(6);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Noticia Principal */}
      <section className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Featured Article */}
          <div className="lg:col-span-2">
            {featuredArticle && (
              <ArticleCard 
                article={featuredArticle} 
                variant="featured" 
                priority 
              />
            )}
          </div>

          {/* Secondary Articles */}
          <div className="space-y-6">
            {secondaryArticles.slice(0, 3).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="horizontal"
                showExcerpt={false}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Main Content Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column - Latest News */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair text-2xl font-bold text-gray-900">
                Últimas Noticias
              </h2>
              <Link 
                href="/noticias" 
                className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
              >
                Ver todas
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="default"
                  showExcerpt
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            {/* Categories Widget */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-playfair text-xl font-bold text-gray-900 mb-4">
                Secciones
              </h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.value}>
                    <Link
                      href={`/noticias/categoria/${category.value}`}
                      className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-white transition-colors group"
                    >
                      <span className="text-gray-700 group-hover:text-red-600 transition-colors">
                        {category.label}
                      </span>
                      <ArrowRight size={16} className="text-gray-400 group-hover:text-red-600 transition-colors" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trending Widget */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-playfair text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                Lo más leído
              </h3>
              <ol className="space-y-4">
                {latestArticles.slice(0, 5).map((article, index) => (
                  <li key={article.id} className="flex gap-3">
                    <span className="font-playfair text-2xl font-bold text-gray-300">
                      {index + 1}
                    </span>
                    <ArticleCard
                      article={article}
                      variant="compact"
                      showImage={false}
                      showCategory={false}
                    />
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>

      {/* Category Sections */}
      {['politica', 'economia', 'internacional'].map((categoryValue) => {
        const categoryArticles = getArticlesByCategory(categoryValue as never);
        if (categoryArticles.length === 0) return null;

        return (
          <section key={categoryValue} className="border-t border-gray-200 py-8">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-playfair text-2xl font-bold text-gray-900">
                  {getCategoryLabel(categoryValue as never)}
                </h2>
                <Link 
                  href={`/noticias/categoria/${categoryValue}`}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
                >
                  Ver más
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoryArticles.slice(0, 4).map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    variant="default"
                    showExcerpt={false}
                    showAuthor={false}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Newsletter CTA */}
      <section className="bg-gray-900 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-playfair text-3xl font-bold text-white mb-4">
            Mantenete informado
          </h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Suscribite a nuestro newsletter y recibí las noticias más importantes 
            directamente en tu casilla de correo.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              className="bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition-colors"
            >
              Suscribirse
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
