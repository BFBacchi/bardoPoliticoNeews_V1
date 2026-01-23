/** @type {import('next').NextConfig} */
const nextConfig = {
  // Usar webpack en lugar de Turbopack para builds
  // (Turbopack tiene problemas con Google Fonts en Next.js 16)
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'fonts.gstatic.com',
      },
    ],
  },
  
  // Configuración experimental
  experimental: {
    // Desactivar turbopack para build si hay problemas
  },
};

module.exports = nextConfig;
