/**
 * DETALLE DE NOTICIA - Página de Artículo
 * 
 * Server Component con:
 * - generateMetadata para SEO dinámico
 * - JSON-LD estructurado (Article schema)
 * - Contenido rico y formateado
 * - Imagen destacada
 * - Información del autor
 * - Tiempo de lectura
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Calendar } from 'lucide-react';
import { getArticleBySlug, getLatestArticles, mockArticles } from '@/lib/mock-data';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { ArticleCard } from '@/components/news/article-card';
import { ShareButtons } from '@/components/news/share-buttons';
import { 
  formatDate, 
  formatRelativeDate, 
  getCategoryLabel, 
  getCategoryColor 
} from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generar rutas estáticas para todas las noticias
export async function generateStaticParams() {
  return mockArticles
    .filter(a => a.status === 'published')
    .map((article) => ({
      slug: article.slug,
    }));
}

// Generar metadata SEO dinámica
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  
  if (!article) {
    return {
      title: 'Artículo no encontrado',
    };
  }

  const title = article.metaTitle || article.title;
  const description = article.metaDescription || article.excerpt;

  return {
    title,
    description,
    authors: [{ name: article.author.name }],
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      images: [
        {
          url: article.ogImage || article.featuredImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [article.ogImage || article.featuredImage],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getLatestArticles(4).filter(a => a.id !== article.id);

  // JSON-LD estructurado para SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Person',
      name: article.author.name,
      jobTitle: article.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'PolíticaHoy',
      logo: {
        '@type': 'ImageObject',
        url: 'https://politicahoy.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://politicahoy.com/noticias/${article.slug}`,
    },
    articleSection: getCategoryLabel(article.category),
    keywords: article.tags.join(', '),
  };

  return (
    <>
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Noticias', href: '/noticias' },
              { label: getCategoryLabel(article.category), href: `/noticias/categoria/${article.category}` },
              { label: article.title },
            ]}
          />
        </div>

        {/* Article Header */}
        <header className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Category Badge */}
          <Badge className={`mb-4 ${getCategoryColor(article.category)}`}>
            {getCategoryLabel(article.category)}
          </Badge>

          {/* Title - H1 potente */}
          <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
            {article.title}
          </h1>

          {/* Bajada editorial */}
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-6 font-light">
            {article.subtitle}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 pb-6 border-b border-gray-200">
            {/* Author */}
            <Link 
              href="#" 
              className="flex items-center gap-2 hover:text-red-600 transition-colors"
            >
              {article.author.avatar && (
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                <span className="font-medium text-gray-900">{article.author.name}</span>
                <p className="text-sm text-gray-500">{article.author.role}</p>
              </div>
            </Link>

            <span className="text-gray-300">|</span>

            {/* Date */}
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>
            </div>

            <span className="text-gray-300">|</span>

            {/* Reading time */}
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{article.readingTime} min de lectura</span>
            </div>
          </div>

          {/* Share buttons */}
          <ShareButtons 
            title={article.title} 
            url={`https://politicahoy.com/noticias/${article.slug}`} 
          />
        </header>

        {/* Featured Image */}
        <figure className="container mx-auto px-4 max-w-5xl mb-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
            />
          </div>
          {article.imageCaption && (
            <figcaption className="text-center text-sm text-gray-500 mt-3">
              {article.imageCaption}
            </figcaption>
          )}
        </figure>

        {/* Article Content */}
        <div className="container mx-auto px-4 max-w-3xl">
          <div 
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-200">
            <span className="text-sm text-gray-500">Tags:</span>
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/noticias?tag=${tag}`}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Author Bio */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-4">
              {article.author.avatar && (
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              )}
              <div>
                <h3 className="font-semibold text-gray-900">{article.author.name}</h3>
                <p className="text-sm text-red-600 mb-2">{article.author.role}</p>
                {article.author.bio && (
                  <p className="text-gray-600 text-sm">{article.author.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <section className="container mx-auto px-4 py-12 mt-8 border-t border-gray-200">
          <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-6">
            Noticias Relacionadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedArticles.slice(0, 4).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="default"
                showExcerpt={false}
                showAuthor={false}
              />
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
