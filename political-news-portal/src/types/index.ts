/**
 * TIPOS TYPESCRIPT - Portal de Noticias Políticas
 * 
 * Estos tipos están diseñados para integrarse con:
 * - n8n (automatización de scraping)
 * - IA para reescritura de contenido
 * - Sistema de publicación multicanal
 */

// Estados editoriales de una noticia
export type ArticleStatus = 
  | 'scraped'      // Recién importada de fuente externa via n8n
  | 'rewritten'    // Reescrita por IA, pendiente revisión
  | 'draft'        // Borrador en edición manual
  | 'published'    // Publicada y visible
  | 'archived';    // Archivada

// Categorías políticas
export type Category = 
  | 'politica'
  | 'economia'
  | 'internacional'
  | 'sociedad'
  | 'opinion'
  | 'breaking';

// Estructura de autor
export interface Author {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  bio?: string;
}

// Estructura principal de noticia
// Compatible con el JSON que envía n8n desde scraping
export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;           // Bajada editorial
  excerpt: string;            // Resumen para listados
  content: string;            // Contenido HTML del editor
  category: Category;
  author: Author;
  featuredImage: string;
  imageCaption?: string;
  publishedAt: string;        // ISO date string
  updatedAt: string;
  readingTime: number;        // Minutos estimados
  status: ArticleStatus;
  tags: string[];
  
  // Campos para integración n8n + IA
  source?: string;            // URL fuente original
  originalContent?: string;   // Contenido antes de reescritura
  rewrittenContent?: string;  // Contenido post-IA
  aiModel?: string;           // Modelo usado para reescritura
  scrapedAt?: string;         // Cuándo se importó
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

// Estructura para crear/editar noticia
export interface ArticleInput {
  title: string;
  subtitle: string;
  content: string;
  category: Category;
  authorId: string;
  featuredImage?: string;
  imageCaption?: string;
  status: ArticleStatus;
  tags: string[];
  source?: string;
  metaTitle?: string;
  metaDescription?: string;
}

// Usuario del sistema
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'writer';
  avatar?: string;
}

// Estado de autenticación
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Formato de placa para redes sociales
export type PlacaFormat = 
  | 'instagram-reel'    // 9:16 (1080x1920)
  | 'instagram-square'  // 1:1 (1080x1080)
  | 'instagram-story'   // 9:16 (1080x1920)
  | 'youtube-short'     // 9:16 (1080x1920)
  | 'twitter-card'      // 16:9 (1200x675)
  | 'facebook-post';    // 1.91:1 (1200x630)

// Configuración de placa visual
export interface PlacaConfig {
  articleId: string;
  format: PlacaFormat;
  title: string;
  subtitle?: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: 'playfair' | 'inter';
  showLogo: boolean;
  showSource: boolean;
  overlayOpacity: number;
  backgroundImage?: string;
}

// Respuesta paginada
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filtros para listado de noticias
export interface ArticleFilters {
  category?: Category;
  status?: ArticleStatus;
  search?: string;
  authorId?: string;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * ESTRUCTURA JSON PARA N8N
 * 
 * Cuando n8n scrapea una noticia, debe enviar este formato:
 * 
 * {
 *   "title": "Título de la noticia",
 *   "source": "https://url-original.com/noticia",
 *   "originalContent": "<p>Contenido HTML scrapeado...</p>",
 *   "rewrittenContent": "", // Vacío inicialmente
 *   "status": "scraped",
 *   "category": "politica",
 *   "scrapedAt": "2024-01-15T10:30:00Z",
 *   "featuredImage": "https://url-imagen.jpg",
 *   "tags": ["tag1", "tag2"]
 * }
 * 
 * El frontend mostrará estas noticias en el dashboard con estado "Scrapeada"
 * permitiendo al editor revisarla y publicarla.
 */
