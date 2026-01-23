'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import { categories } from '@/lib/mock-data';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-playfair text-2xl font-bold text-white">
                Política<span className="text-red-500">Hoy</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Tu fuente confiable de noticias políticas. Información verificada, 
              análisis profundo y cobertura en tiempo real.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Sections */}
          <div>
            <h3 className="text-white font-semibold mb-4">Secciones</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.value}>
                  <Link
                    href={`/noticias/categoria/${category.value}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Institucional</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sobre-nosotros" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/equipo" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Equipo Editorial
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/publicidad" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Publicidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Términos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">
              Recibí las noticias más importantes en tu correo.
            </p>
            <form className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              </div>
              <button
                type="submit"
                className="bg-red-600 text-white py-2 px-4 rounded-md font-medium hover:bg-red-700 transition-colors"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>© {currentYear} PolíticaHoy. Todos los derechos reservados.</p>
            <p>
              Desarrollado para demostrar integración con{' '}
              <span className="text-red-500">n8n + IA</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
