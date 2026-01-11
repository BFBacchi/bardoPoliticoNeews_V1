/**
 * CONFIGURACIÓN DE TIPOGRAFÍAS - Portal de Noticias Políticas
 * 
 * 📰 ESTRATEGIA TIPOGRÁFICA EDITORIAL:
 * 
 * 1. PLAYFAIR DISPLAY (Serif) - Titulares
 *    - Tipografía con serifa clásica, inspirada en estilos del siglo XVIII
 *    - Transmite autoridad, tradición periodística y seriedad
 *    - Ideal para titulares de noticias políticas donde se busca gravitas
 *    - Similar a las usadas por NYTimes, The Guardian, Infobae
 * 
 * 2. INTER (Sans-serif) - Cuerpo y UI
 *    - Diseñada específicamente para pantallas digitales
 *    - Alta legibilidad en todos los tamaños
 *    - Excelente para textos largos y navegación
 *    - Moderna pero neutral, no distrae del contenido
 * 
 * Esta combinación serif/sans-serif es estándar en medios digitales serios
 * porque equilibra autoridad editorial (serif) con usabilidad moderna (sans).
 */

import { Playfair_Display, Inter } from 'next/font/google';

// Tipografía para titulares - transmite autoridad periodística
export const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
});

// Tipografía para cuerpo y UI - máxima legibilidad digital
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
});

// Clases CSS combinadas para aplicar en el body
export const fontVariables = `${playfair.variable} ${inter.variable}`;
