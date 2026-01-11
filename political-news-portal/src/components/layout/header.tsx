'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, TrendingUp } from 'lucide-react';
import { categories } from '@/lib/mock-data';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Breaking News Bar */}
      <div className="bg-red-600 text-white py-1.5 px-4">
        <div className="container mx-auto flex items-center gap-2 text-sm">
          <TrendingUp size={14} className="animate-pulse" />
          <span className="font-semibold">ÚLTIMO MOMENTO:</span>
          <span className="truncate">El Gobierno anuncia nuevas medidas económicas que impactarán en todos los sectores</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        {/* Top Row - Logo and Search */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Política<span className="text-red-600">Hoy</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className={`${isSearchOpen ? 'flex' : 'hidden md:flex'} items-center`}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar noticias..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent w-48 md:w-64"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              <Search size={20} />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block py-3`}>
          <ul className="flex flex-col md:flex-row md:items-center md:justify-center gap-1 md:gap-8">
            <li>
              <Link
                href="/"
                className="block py-2 md:py-0 text-gray-900 font-medium hover:text-red-600 transition-colors"
              >
                Inicio
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.value}>
                <Link
                  href={`/noticias/categoria/${category.value}`}
                  className="block py-2 md:py-0 text-gray-700 hover:text-red-600 transition-colors"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
