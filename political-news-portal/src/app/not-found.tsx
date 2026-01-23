'use client';

/**
 * PÁGINA 404 - Not Found
 * 
 * Página de error personalizada para rutas no encontradas.
 */

import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Number */}
        <h1 className="font-playfair text-9xl font-bold text-gray-200 mb-4">
          404
        </h1>
        
        {/* Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Página no encontrada
        </h2>
        <p className="text-gray-600 mb-8">
          Lo sentimos, la página que buscás no existe o fue movida.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors"
          >
            <Home size={18} />
            Ir al Inicio
          </Link>
          
          <Link
            href="/noticias"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
          >
            <Search size={18} />
            Ver Noticias
          </Link>
        </div>

        {/* Back Link */}
        <button
          onClick={() => window.history.back()}
          className="mt-6 inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver atrás
        </button>
      </div>
    </div>
  );
}
