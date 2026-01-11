'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, User } from 'lucide-react';
import { Article } from '@/types';
import { Badge } from '@/components/ui/badge';
import { formatRelativeDate, getCategoryLabel, getCategoryColor } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact' | 'horizontal';
  showImage?: boolean;
  showExcerpt?: boolean;
  showCategory?: boolean;
  showAuthor?: boolean;
  priority?: boolean;
}

export function ArticleCard({
  article,
  variant = 'default',
  showImage = true,
  showExcerpt = true,
  showCategory = true,
  showAuthor = true,
  priority = false,
}: ArticleCardProps) {
  if (variant === 'featured') {
    return (
      <article className="group relative">
        <Link href={`/noticias/${article.slug}`} className="block">
          <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-lg">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              {showCategory && (
                <Badge className={`mb-3 ${getCategoryColor(article.category)}`}>
                  {getCategoryLabel(article.category)}
                </Badge>
              )}
              
              <h2 className="font-playfair text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                {article.title}
              </h2>
              
              <p className="text-gray-200 text-lg md:text-xl mb-4 line-clamp-2 max-w-3xl">
                {article.subtitle}
              </p>
              
              <div className="flex items-center gap-4 text-gray-300 text-sm">
                {showAuthor && (
                  <div className="flex items-center gap-2">
                    <User size={14} />
                    <span>{article.author.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  <span>{formatRelativeDate(article.publishedAt)}</span>
                </div>
                <span>{article.readingTime} min de lectura</span>
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article className="group flex gap-4">
        {showImage && (
          <Link href={`/noticias/${article.slug}`} className="flex-shrink-0">
            <div className="relative w-32 h-24 md:w-48 md:h-32 overflow-hidden rounded-md">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 128px, 192px"
              />
            </div>
          </Link>
        )}
        
        <div className="flex-1 min-w-0">
          {showCategory && (
            <Badge className={`mb-2 text-xs ${getCategoryColor(article.category)}`}>
              {getCategoryLabel(article.category)}
            </Badge>
          )}
          
          <Link href={`/noticias/${article.slug}`}>
            <h3 className="font-playfair text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-red-600 transition-colors">
              {article.title}
            </h3>
          </Link>
          
          {showExcerpt && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-2">
              {article.excerpt}
            </p>
          )}
          
          <div className="flex items-center gap-3 text-gray-500 text-xs">
            <span>{formatRelativeDate(article.publishedAt)}</span>
            <span>•</span>
            <span>{article.readingTime} min</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group">
        <Link href={`/noticias/${article.slug}`}>
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-red-600 transition-colors">
            {article.title}
          </h3>
        </Link>
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <span>{formatRelativeDate(article.publishedAt)}</span>
        </div>
      </article>
    );
  }

  // Default variant
  return (
    <article className="group">
      {showImage && (
        <Link href={`/noticias/${article.slug}`} className="block mb-4">
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              priority={priority}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
            />
          </div>
        </Link>
      )}
      
      {showCategory && (
        <Badge className={`mb-2 ${getCategoryColor(article.category)}`}>
          {getCategoryLabel(article.category)}
        </Badge>
      )}
      
      <Link href={`/noticias/${article.slug}`}>
        <h3 className="font-playfair text-xl font-semibold text-gray-900 mb-2 line-clamp-3 group-hover:text-red-600 transition-colors">
          {article.title}
        </h3>
      </Link>
      
      {showExcerpt && (
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {article.excerpt}
        </p>
      )}
      
      <div className="flex items-center gap-3 text-gray-500 text-sm">
        {showAuthor && (
          <>
            <span>{article.author.name}</span>
            <span>•</span>
          </>
        )}
        <span>{formatRelativeDate(article.publishedAt)}</span>
        <span>•</span>
        <span>{article.readingTime} min</span>
      </div>
    </article>
  );
}
