# 📰 PolíticaHoy - Portal de Noticias Políticas

Un portal de noticias de actualidad política profesional, construido con Next.js 15, diseñado para integración con automatización (n8n) e inteligencia artificial.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)

## ✨ Características

### 🌐 Frontend Público
- **Home estilo Infobae** - Hero destacado, grilla editorial, secciones por categoría
- **Listado de noticias** - Filtros, paginación, diseño tipo diario
- **Detalle de artículo** - SEO optimizado, JSON-LD, tiempo de lectura
- **Categorías** - Política, Economía, Internacional, Sociedad, Opinión

### 🔐 Backoffice
- **Dashboard** - Gestión de noticias con estados y filtros
- **Editor WYSIWYG** - TipTap con formato rico
- **Sistema de estados** - Scrapeada → Reescrita → Borrador → Publicada
- **Generador de placas** - Contenido visual para redes sociales

### 🤖 Preparado para Automatización
- **n8n ready** - Estructura de datos compatible con webhooks
- **IA ready** - Flujo de reescritura automática
- **Multicanal** - Exportación para Instagram, YouTube, Twitter, Facebook

### 🔍 SEO Avanzado
- **generateMetadata** - Metadata dinámica por artículo
- **JSON-LD** - Schema NewsArticle
- **Sitemap dinámico** - Actualización automática
- **Robots.txt** - Configuración de crawlers

## 🚀 Inicio Rápido

### Prerrequisitos
1. Cuenta en [Supabase](https://supabase.com)
2. Node.js 18+ instalado

### Configuración Inicial

```bash
# Clonar el proyecto
git clone <repo>
cd political-news-portal

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Ejecutar migración SQL en Supabase Dashboard
# Ver: docs/SUPABASE-MIGRATION.md

# Ejecutar en desarrollo
npm run dev

# Abrir en navegador
open http://localhost:3000
```

**⚠️ IMPORTANTE:** Antes de ejecutar, debes:
1. Crear un proyecto en Supabase
2. Ejecutar la migración SQL (`supabase/migrations/001_initial_schema.sql`)
3. Configurar Storage bucket `images`
4. Crear un usuario en Supabase Auth

Ver la [Guía de Migración a Supabase](docs/SUPABASE-MIGRATION.md) para instrucciones detalladas.

## 📁 Estructura del Proyecto

```
src/
├── app/                      # App Router de Next.js
│   ├── (public)/            # Rutas públicas
│   │   ├── page.tsx         # Home
│   │   └── noticias/        # Noticias
│   │       ├── page.tsx     # Listado
│   │       ├── [slug]/      # Detalle
│   │       └── categoria/   # Por categoría
│   ├── (admin)/             # Backoffice
│   │   ├── login/           # Autenticación
│   │   ├── dashboard/       # Panel principal
│   │   ├── editor/          # Editor de noticias
│   │   └── placas/          # Generador visual
│   ├── layout.tsx           # Layout raíz
│   ├── sitemap.ts           # Sitemap dinámico
│   ├── robots.ts            # Robots.txt
│   └── not-found.tsx        # Página 404
│
├── components/
│   ├── ui/                  # Componentes base (Button, Input, etc.)
│   ├── layout/              # Header, Footer
│   ├── news/                # ArticleCard, etc.
│   ├── admin/               # Sidebar, etc.
│   └── editor/              # TipTap Editor
│
├── lib/
│   ├── fonts.ts             # Tipografías (Playfair, Inter)
│   ├── mock-data.ts         # Datos de prueba
│   ├── store.ts             # Estado Zustand
│   └── utils.ts             # Utilidades
│
├── types/
│   └── index.ts             # Tipos TypeScript
│
└── docs/                    # Documentación
    ├── README.md            # Guía general
    ├── N8N-INTEGRATION.md   # Guía n8n
    └── AI-INTEGRATION.md    # Guía IA
```

## 🎨 Diseño Editorial

### Tipografías
- **Playfair Display** (Serif) - Titulares: transmite autoridad periodística
- **Inter** (Sans-serif) - Cuerpo y UI: máxima legibilidad digital
- **Source Serif 4** (Serif) - Artículos largos: lectura cómoda

### Colores
- **Rojo editorial** (#dc2626) - Acentos y CTAs
- **Gris oscuro** (#1f2937) - Textos principales
- **Blanco** - Fondos limpios

## 🔧 Stack Tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Next.js | 15 | Framework React con App Router |
| React | 19 | Librería UI |
| TypeScript | 5 | Tipado estático |
| Tailwind CSS | 4 | Estilos utility-first |
| TipTap | 2 | Editor WYSIWYG |
| Zustand | 5 | Estado global |
| React Hook Form | 7 | Formularios |
| Lucide React | - | Iconos |
| date-fns | 4 | Manejo de fechas |
| html-to-image | - | Exportación de placas |

## 📊 Estados de Noticias

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌───────────┐
│ SCRAPED  │ → │ REWRITTEN│ → │  DRAFT   │ → │ PUBLISHED │
└──────────┘   └──────────┘   └──────────┘   └───────────┘
     │              │              │               │
  Importada      Procesada      En edición     Visible
  desde n8n      por IA         manual         al público
```

## 🔌 Integración n8n

El portal está preparado para recibir noticias scrapeadas.
Ver [docs/N8N-INTEGRATION.md](docs/N8N-INTEGRATION.md) para configuración completa.

### Estructura JSON esperada:
```json
{
  "title": "Título de la noticia",
  "source": "https://url-original.com/noticia",
  "originalContent": "<p>HTML scrapeado...</p>",
  "status": "scraped",
  "category": "politica",
  "scrapedAt": "2024-01-15T10:30:00Z"
}
```

## 🤖 Integración IA

El editor incluye botón "Reescribir con IA" preparado para conectar con:
- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude)
- Modelos locales (Llama, Ollama)

Ver [docs/AI-INTEGRATION.md](docs/AI-INTEGRATION.md) para implementación.

## 📱 Generador de Placas

Crea contenido visual para redes sociales:

| Formato | Dimensiones | Plataforma |
|---------|-------------|------------|
| Reel | 1080 × 1920 | Instagram, TikTok |
| Story | 1080 × 1920 | Instagram, Facebook |
| Short | 1080 × 1920 | YouTube |
| Cuadrado | 1080 × 1080 | Instagram Feed |
| Card | 1200 × 675 | Twitter |
| Post | 1200 × 630 | Facebook |

## 🔐 Acceso al Backoffice

**URL:** `/login`

**Autenticación:**
- El portal ahora usa **Supabase Auth** para autenticación real
- Los usuarios deben estar registrados en tu proyecto de Supabase
- Ver [docs/SUPABASE-MIGRATION.md](docs/SUPABASE-MIGRATION.md) para configuración completa

**Link de acceso:**
- Botón "Admin" en el header de la página principal
- O directamente: `http://localhost:3000/login`

## 📝 Scripts Disponibles

```bash
npm run dev      # Desarrollo (http://localhost:3000)
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter ESLint
```

## 🗺️ Roadmap

### Fase 1 - Frontend ✅
- [x] Home estilo Infobae
- [x] Listado y detalle de noticias
- [x] SEO (metadata, sitemap, JSON-LD)
- [x] Backoffice con editor
- [x] Generador de placas
- [x] Documentación

### Fase 2 - Backend ✅
- [x] Integración con Supabase (PostgreSQL)
- [x] Autenticación con Supabase Auth
- [x] Upload de imágenes (Supabase Storage)
- [x] CRUD completo de artículos
- [ ] Webhooks para n8n (pendiente)

### Fase 3 - Automatización
- [ ] Flujos n8n de scraping
- [ ] Integración OpenAI
- [ ] Publicación automática
- [ ] Análisis de métricas

### Fase 4 - Producción
- [ ] Deployment (Vercel/AWS)
- [ ] CDN para imágenes
- [ ] Analytics
- [ ] Monitoreo

## 📚 Documentación Adicional

- **[Guía de Migración a Supabase](docs/SUPABASE-MIGRATION.md)** ⭐ **NUEVO**
- [Guía de Integración n8n](docs/N8N-INTEGRATION.md)
- [Guía de Integración IA](docs/AI-INTEGRATION.md)
- [Documentación General](docs/README.md)

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

MIT © 2024 PolíticaHoy

---

Desarrollado con ❤️ para automatización de medios digitales
