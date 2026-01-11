/**
 * LAYOUT PÚBLICO - Portal de Noticias
 * 
 * Este layout se aplica a todas las páginas públicas:
 * - Home
 * - Listado de noticias
 * - Detalle de noticia
 * - Páginas de categoría
 * 
 * SEPARACIÓN PÚBLICO/ADMIN:
 * Usamos Route Groups de Next.js para separar:
 * 
 * (public) - Contenido visible para todos los usuarios
 *   - SEO optimizado
 *   - Header con navegación
 *   - Footer institucional
 *   - Sin autenticación requerida
 * 
 * (admin) - Backoffice para editores
 *   - Requiere autenticación
 *   - Layout diferente (sidebar)
 *   - No indexable por buscadores
 *   - Herramientas de gestión
 * 
 * Esta separación permite:
 * - Diferentes layouts sin afectar URLs
 * - Mejor organización del código
 * - Carga condicional de componentes
 * - Guards de autenticación por grupo
 */

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
