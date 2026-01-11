/**
 * LAYOUT ADMIN - Backoffice del Portal
 * 
 * Este layout se aplica a todas las páginas del backoffice:
 * - Login
 * - Dashboard
 * - Editor de noticias
 * - Generador de placas
 * 
 * Características:
 * - Sidebar de navegación
 * - Header con usuario
 * - Sin indexación SEO (noindex, nofollow)
 * - Guards de autenticación
 */

import { Metadata } from 'next';
import { AdminSidebar } from '@/components/admin/sidebar';

export const metadata: Metadata = {
  title: {
    default: 'Admin | PolíticaHoy',
    template: '%s | Admin PolíticaHoy',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
