import type { Metadata } from 'next';
import { fontVariables } from '@/lib/fonts';
import './globals.css';

/**
 * LAYOUT PRINCIPAL - Portal de Noticias Políticas
 * 
 * Este layout se aplica a TODAS las páginas.
 * Configura:
 * - Tipografías globales via CSS variables
 * - Metadata SEO base
 * - Estructura HTML básica
 */

export const metadata: Metadata = {
  metadataBase: new URL('https://politicahoy.com'),
  title: {
    default: 'PolíticaHoy - Noticias de Actualidad Política',
    template: '%s | PolíticaHoy',
  },
  description: 'Tu fuente confiable de noticias políticas. Cobertura en tiempo real, análisis profundo y toda la actualidad política nacional e internacional.',
  keywords: ['noticias', 'política', 'actualidad', 'argentina', 'gobierno', 'congreso', 'economía'],
  authors: [{ name: 'PolíticaHoy' }],
  creator: 'PolíticaHoy',
  publisher: 'PolíticaHoy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://politicahoy.com',
    siteName: 'PolíticaHoy',
    title: 'PolíticaHoy - Noticias de Actualidad Política',
    description: 'Tu fuente confiable de noticias políticas. Cobertura en tiempo real y análisis profundo.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PolíticaHoy - Noticias de Actualidad Política',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PolíticaHoy - Noticias de Actualidad Política',
    description: 'Tu fuente confiable de noticias políticas.',
    images: ['/og-image.jpg'],
    creator: '@politicahoy',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={fontVariables}>
      <head>
        {/* Preconnect para optimizar carga de fuentes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#dc2626" />
      </head>
      <body className="min-h-screen bg-white font-inter antialiased">
        {children}
      </body>
    </html>
  );
}
