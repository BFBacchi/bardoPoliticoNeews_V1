# 📰 Portal de Noticias Políticas - Documentación

## Índice

1. [Arquitectura General](#arquitectura-general)
2. [Integración con n8n](#integración-con-n8n)
3. [Flujo de Contenido Automatizado](#flujo-de-contenido-automatizado)
4. [API Endpoints (Mock)](#api-endpoints-mock)
5. [Reescritura con IA](#reescritura-con-ia)
6. [Generador de Placas](#generador-de-placas)
7. [SEO y Metadata](#seo-y-metadata)
8. [Guía de Desarrollo](#guía-de-desarrollo)

---

## Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   PÚBLICO   │  │   ADMIN     │  │   GENERADOR PLACAS  │  │
│  │  - Home     │  │  - Login    │  │   - Instagram       │  │
│  │  - Noticias │  │  - Dashboard│  │   - YouTube         │  │
│  │  - Detalle  │  │  - Editor   │  │   - Twitter         │  │
│  │  - Categoría│  │             │  │   - Facebook        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        API LAYER                             │
│              (Actualmente Mock - Futuro Backend)             │
└─────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            ▼                 ▼                 ▼
    ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
    │     n8n       │ │   IA (GPT)    │ │   Database    │
    │  - Scraping   │ │  - Reescritura│ │  - PostgreSQL │
    │  - Scheduling │ │  - Resúmenes  │ │  - MongoDB    │
    │  - Webhooks   │ │  - Traducción │ │               │
    └───────────────┘ └───────────────┘ └───────────────┘
```

## Integración con n8n

### Flujo de Scraping → Frontend

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Sitio Web   │ ──▶ │     n8n      │ ──▶ │   Frontend   │
│   (Fuente)   │     │  (Scraping)  │     │  (Dashboard) │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   IA (GPT)   │
                     │ (Reescritura)│
                     └──────────────┘
```

### Configuración del Webhook en n8n

El frontend está preparado para recibir noticias scrapeadas via webhook.
Cuando el backend esté implementado, configurar n8n para enviar POST a:

```
POST /api/articles/import
```

### Estructura JSON Esperada

Cuando n8n scrapea una noticia, debe enviar este formato:

```json
{
  "title": "Título de la noticia scrapeada",
  "source": "https://sitio-original.com/noticia-completa",
  "originalContent": "<p>Contenido HTML scrapeado de la fuente original...</p>",
  "rewrittenContent": "",
  "status": "scraped",
  "category": "politica",
  "scrapedAt": "2024-01-15T10:30:00Z",
  "featuredImage": "https://url-de-imagen.jpg",
  "tags": ["política", "gobierno", "economía"],
  "author": {
    "name": "Autor Original",
    "source": "Medio Original"
  }
}
```

### Campos Requeridos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `title` | string | Título de la noticia |
| `source` | string | URL de la fuente original |
| `originalContent` | string | HTML del contenido scrapeado |
| `status` | string | Siempre "scraped" para noticias nuevas |
| `category` | string | Una de: politica, economia, internacional, sociedad, opinion, breaking |
| `scrapedAt` | string | Fecha ISO de cuando se scrapeó |

### Campos Opcionales

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `rewrittenContent` | string | Contenido reescrito por IA (vacío inicialmente) |
| `featuredImage` | string | URL de imagen destacada |
| `tags` | array | Lista de tags/etiquetas |
| `author` | object | Información del autor original |

---

## Flujo de Contenido Automatizado

### Estados de una Noticia

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌───────────┐
│ SCRAPED  │ → │ REWRITTEN│ → │  DRAFT   │ → │ PUBLISHED │
└──────────┘   └──────────┘   └──────────┘   └───────────┘
      │              │              │               │
      │              │              │               │
   n8n envía      IA procesa    Editor          Visible
   noticia        contenido     revisa          al público
```

### 1. SCRAPED (Scrapeada)
- La noticia fue importada automáticamente por n8n
- Contiene el contenido original de la fuente
- Requiere revisión antes de publicar
- Visible en Dashboard con badge amarillo

### 2. REWRITTEN (Reescrita)
- La IA procesó el contenido original
- El texto fue optimizado/reformulado
- Aún requiere revisión editorial
- Se guarda el contenido original para comparación

### 3. DRAFT (Borrador)
- El editor está trabajando en la noticia
- Puede ser manual o post-IA
- No visible al público

### 4. PUBLISHED (Publicada)
- Noticia aprobada y visible
- Indexable por buscadores
- Aparece en el sitio público

---

## API Endpoints (Mock)

El frontend incluye datos mock. Cuando se implemente el backend,
estos son los endpoints necesarios:

### Públicos

```
GET  /api/articles              # Listar artículos publicados
GET  /api/articles/:slug        # Obtener artículo por slug
GET  /api/articles/category/:cat # Artículos por categoría
GET  /api/categories            # Listar categorías
```

### Admin (Requieren autenticación)

```
GET    /api/admin/articles         # Listar todos los artículos
POST   /api/admin/articles         # Crear artículo
PUT    /api/admin/articles/:id     # Actualizar artículo
DELETE /api/admin/articles/:id     # Eliminar artículo
POST   /api/admin/articles/import  # Importar desde n8n
POST   /api/admin/articles/:id/rewrite # Solicitar reescritura IA
```

### Autenticación

```
POST /api/auth/login    # Login (email, password)
POST /api/auth/logout   # Logout
GET  /api/auth/me       # Usuario actual
```

---

## Reescritura con IA

### Flujo de Reescritura

```
┌────────────────┐
│ Editor clickea │
│ "Reescribir    │
│  con IA"       │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ Frontend envía │
│ contenido a    │
│ API backend    │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ Backend envía  │
│ a OpenAI/      │
│ Claude/etc     │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ IA procesa y   │
│ devuelve texto │
│ optimizado     │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ Frontend       │
│ muestra nuevo  │
│ contenido      │
└────────────────┘
```

### Prompt Sugerido para IA

```
Sos un editor de noticias políticas de un medio digital profesional.
Tu tarea es reescribir el siguiente artículo manteniendo:

1. Los hechos y datos exactos
2. Las citas textuales sin modificar
3. Un tono periodístico neutral pero atractivo
4. Estructura: introducción, desarrollo, conclusión

Reglas:
- No inventar información
- Mantener la extensión similar
- Usar vocabulario claro
- Evitar sensacionalismo
- Incluir subtítulos H2 cada 2-3 párrafos

CONTENIDO ORIGINAL:
{originalContent}

FUENTE: {source}

Devolvé SOLO el HTML del contenido reescrito.
```

### Estructura de Request/Response

**Request:**
```json
{
  "articleId": "123",
  "originalContent": "<p>Contenido original...</p>",
  "aiModel": "gpt-4",
  "options": {
    "preserveQuotes": true,
    "targetLength": "similar",
    "tone": "professional"
  }
}
```

**Response:**
```json
{
  "success": true,
  "rewrittenContent": "<p>Contenido reescrito...</p>",
  "aiModel": "gpt-4",
  "tokensUsed": 1500,
  "processingTime": 3200
}
```

---

## Generador de Placas

### Formatos Soportados

| Formato | Dimensiones | Uso Principal |
|---------|-------------|---------------|
| Instagram Reel | 1080 × 1920 | Reels, Videos verticales |
| Instagram Story | 1080 × 1920 | Stories |
| YouTube Short | 1080 × 1920 | Shorts |
| Instagram Cuadrado | 1080 × 1080 | Posts feed |
| Twitter Card | 1200 × 675 | Tweets con imagen |
| Facebook Post | 1200 × 630 | Posts de Facebook |

### Flujo de Uso

1. Seleccionar noticia del listado
2. Elegir formato de salida
3. Personalizar:
   - Título y subtítulo
   - Colores (fondo, texto, acento)
   - Tipografía (serif/sans)
   - Imagen de fondo
   - Mostrar/ocultar logo
4. Previsualizar en tiempo real
5. Exportar como PNG

### Extensión: Video Estático

El generador está preparado para extenderse a video:

```javascript
// Futuro: generar video con ffmpeg
const generateVideo = async (placaConfig, duration = 10) => {
  // 1. Generar frame estático
  // 2. Crear video con ffmpeg
  // 3. Añadir transiciones/animaciones
  // 4. Exportar MP4
};
```

---

## SEO y Metadata

### Metadata Dinámica

Cada artículo genera su propia metadata:

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const article = await getArticle(params.slug);
  
  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    openGraph: {
      title: article.title,
      description: article.subtitle,
      images: [article.featuredImage],
      type: 'article',
      publishedTime: article.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}
```

### JSON-LD Estructurado

Cada artículo incluye schema NewsArticle:

```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Título del artículo",
  "datePublished": "2024-01-15T10:00:00Z",
  "author": {
    "@type": "Person",
    "name": "Nombre del Autor"
  },
  "publisher": {
    "@type": "Organization",
    "name": "PolíticaHoy",
    "logo": "https://politicahoy.com/logo.png"
  }
}
```

### Sitemap Dinámico

El sitemap se genera automáticamente con:
- Todas las noticias publicadas
- Páginas de categoría
- Páginas estáticas
- Frecuencia de actualización
- Prioridad por tipo de página

---

## Guía de Desarrollo

### Instalación

```bash
# Clonar el proyecto
git clone <repo>
cd political-news-portal

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build de producción
npm run build
npm start
```

### Variables de Entorno

Crear archivo `.env.local`:

```env
# API Backend (futuro)
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# OpenAI para reescritura
OPENAI_API_KEY=sk-...

# Analytics (opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXX
```

### Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── (public)/          # Rutas públicas
│   │   ├── page.tsx       # Home
│   │   └── noticias/      # Noticias
│   ├── (admin)/           # Rutas de admin
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── editor/
│   │   └── placas/
│   ├── layout.tsx         # Layout raíz
│   ├── sitemap.ts         # Sitemap dinámico
│   └── robots.ts          # Robots.txt
├── components/
│   ├── ui/                # Componentes base
│   ├── layout/            # Header, Footer
│   ├── news/              # Componentes de noticias
│   ├── admin/             # Componentes admin
│   └── editor/            # Editor TipTap
├── lib/
│   ├── fonts.ts           # Configuración tipográfica
│   ├── mock-data.ts       # Datos de prueba
│   ├── store.ts           # Estado Zustand
│   └── utils.ts           # Utilidades
├── types/
│   └── index.ts           # Tipos TypeScript
└── docs/                  # Esta documentación
```

### Próximos Pasos

1. **Backend**: Implementar API REST con Node.js/Express o similar
2. **Base de datos**: Configurar PostgreSQL o MongoDB
3. **Autenticación**: Implementar JWT con refresh tokens
4. **n8n**: Configurar flujos de scraping y webhooks
5. **IA**: Integrar OpenAI API para reescritura
6. **CDN**: Configurar para imágenes y assets
7. **Analytics**: Agregar tracking de visitantes
8. **Cache**: Implementar ISR/caching para mejor performance

---

## Contacto

Para dudas sobre la integración:
- Documentación n8n: https://docs.n8n.io
- OpenAI API: https://platform.openai.com/docs
- Next.js: https://nextjs.org/docs
