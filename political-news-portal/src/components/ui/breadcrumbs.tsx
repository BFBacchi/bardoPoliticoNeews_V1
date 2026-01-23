import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  // JSON-LD para SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: 'https://politicahoy.com',
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: item.href ? `https://politicahoy.com${item.href}` : undefined,
      })),
    ],
  };

  return (
    <>
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Visual Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="py-3">
        <ol className="flex items-center flex-wrap gap-1 text-sm text-gray-600">
          <li>
            <Link 
              href="/" 
              className="flex items-center gap-1 hover:text-red-600 transition-colors"
            >
              <Home size={14} />
              <span className="sr-only md:not-sr-only">Inicio</span>
            </Link>
          </li>
          
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-1">
              <ChevronRight size={14} className="text-gray-400" />
              {item.href ? (
                <Link 
                  href={item.href} 
                  className="hover:text-red-600 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
