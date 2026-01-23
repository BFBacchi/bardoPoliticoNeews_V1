/**
 * DATOS MOCK - Simulación de Backend
 * 
 * Estos datos simulan lo que vendría de:
 * - API REST del backend
 * - n8n enviando noticias scrapeadas
 * - Sistema de gestión editorial
 * 
 * NOTA PARA INTEGRACIÓN:
 * Reemplazar estas funciones por llamadas reales a la API
 * cuando el backend esté disponible.
 */

import { Article, Author, Category, ArticleStatus } from '@/types';

// Autores simulados
export const mockAuthors: Author[] = [
  {
    id: '1',
    name: 'María González',
    role: 'Editora Política',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    bio: 'Periodista con 15 años de experiencia en política nacional.',
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    role: 'Corresponsal',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    bio: 'Especialista en economía y finanzas públicas.',
  },
  {
    id: '3',
    name: 'Ana Martínez',
    role: 'Analista Internacional',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    bio: 'Experta en relaciones internacionales y geopolítica.',
  },
];

// Noticias simuladas con diferentes estados
export const mockArticles: Article[] = [
  {
    id: '1',
    slug: 'gobierno-anuncia-nuevas-medidas-economicas-para-2024',
    title: 'El Gobierno anuncia un paquete de medidas económicas que impactará en todos los sectores',
    subtitle: 'Las nuevas políticas fiscales buscan estabilizar la economía en medio de la incertidumbre global. Expertos analizan el impacto real en la población.',
    excerpt: 'El presidente presentó esta mañana un ambicioso plan económico que incluye reformas fiscales, incentivos a la producción y medidas de contención inflacionaria.',
    content: `
      <p>En una conferencia de prensa realizada esta mañana en Casa de Gobierno, el presidente presentó un ambicioso paquete de medidas económicas que, según el Ejecutivo, busca "sentar las bases para un crecimiento sostenible".</p>
      
      <h2>Los puntos principales del anuncio</h2>
      
      <p>Entre las medidas más destacadas se encuentran:</p>
      
      <ul>
        <li>Reducción gradual de impuestos al sector productivo</li>
        <li>Nuevos incentivos para la exportación</li>
        <li>Programa de contención de precios esenciales</li>
        <li>Reforma del sistema de subsidios</li>
      </ul>
      
      <p>El ministro de Economía explicó que estas medidas se implementarán de forma escalonada durante los próximos seis meses, permitiendo una adaptación progresiva del mercado.</p>
      
      <blockquote>
        <p>"Este es el comienzo de una nueva etapa. Estamos convencidos de que estas políticas generarán el impulso necesario para reactivar la economía", afirmó el mandatario.</p>
      </blockquote>
      
      <h2>Reacciones de la oposición</h2>
      
      <p>Desde el principal bloque opositor, las críticas no se hicieron esperar. El presidente del bloque señaló que "las medidas son insuficientes y llegan tarde".</p>
      
      <p>Sin embargo, algunos sectores de la oposición moderada mostraron disposición al diálogo, destacando algunos puntos positivos del paquete económico.</p>
      
      <h2>Impacto en los mercados</h2>
      
      <p>Los mercados financieros reaccionaron con cautela ante el anuncio. El índice bursátil local mostró una leve suba del 1.2% durante la jornada, mientras que el tipo de cambio se mantuvo estable.</p>
      
      <p>Analistas económicos consultados por este medio coinciden en que será necesario esperar la implementación efectiva de las medidas para evaluar su impacto real.</p>
    `,
    category: 'economia',
    author: mockAuthors[1],
    featuredImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=630&fit=crop',
    imageCaption: 'El presidente durante el anuncio de las nuevas medidas económicas',
    publishedAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:00:00Z',
    readingTime: 5,
    status: 'published',
    tags: ['economía', 'gobierno', 'medidas', 'fiscal'],
    metaTitle: 'Nuevas medidas económicas del Gobierno: todo lo que necesitás saber',
    metaDescription: 'El Gobierno presentó un paquete de medidas económicas con reformas fiscales e incentivos a la producción. Análisis completo del impacto esperado.',
  },
  {
    id: '2',
    slug: 'tension-diplomatica-con-pais-vecino-escala',
    title: 'La tensión diplomática con el país vecino alcanza su punto más crítico en décadas',
    subtitle: 'Tras las declaraciones del canciller, la situación entre ambas naciones se deterioró significativamente. El embajador fue convocado a consultas.',
    excerpt: 'El conflicto diplomático que comenzó la semana pasada continúa escalando, con intercambios cada vez más duros entre ambos gobiernos.',
    content: `
      <p>La relación bilateral atraviesa su peor momento en los últimos 30 años. Las declaraciones cruzadas entre funcionarios de ambos países han encendido las alarmas en la región.</p>
      
      <h2>Cronología del conflicto</h2>
      
      <p>Todo comenzó cuando el ministro de Defensa realizó declaraciones que fueron consideradas "inaceptables" por el gobierno vecino. Desde entonces, la situación no ha hecho más que empeorar.</p>
      
      <p>Esta mañana, el canciller convocó al embajador para exigir explicaciones formales, en lo que representa el paso más severo en esta crisis diplomática.</p>
      
      <h2>Reacciones internacionales</h2>
      
      <p>Organismos internacionales han expresado su preocupación y ofrecido mediar en el conflicto. La comunidad regional observa con atención los acontecimientos.</p>
    `,
    category: 'internacional',
    author: mockAuthors[2],
    featuredImage: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&h=630&fit=crop',
    publishedAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T12:30:00Z',
    readingTime: 4,
    status: 'published',
    tags: ['internacional', 'diplomacia', 'conflicto'],
  },
  {
    id: '3',
    slug: 'reforma-electoral-avanza-en-el-congreso',
    title: 'La reforma electoral avanza en el Congreso con apoyo transversal',
    subtitle: 'Diputados de diferentes bloques alcanzaron un acuerdo preliminar que podría modificar sustancialmente el sistema de votación.',
    excerpt: 'En una inusual muestra de consenso, legisladores oficialistas y opositores lograron un principio de acuerdo sobre la reforma electoral.',
    content: `
      <p>El proyecto de reforma electoral dio un paso significativo tras alcanzarse un acuerdo entre las principales fuerzas políticas representadas en el Congreso.</p>
      
      <h2>Principales cambios propuestos</h2>
      
      <ul>
        <li>Implementación del voto electrónico en forma gradual</li>
        <li>Modificación del sistema de boleta única</li>
        <li>Nuevos mecanismos de fiscalización</li>
        <li>Regulación del financiamiento de campañas</li>
      </ul>
      
      <p>El presidente de la Cámara destacó el "espíritu de diálogo" que primó en las negociaciones y anticipó que el proyecto podría ser tratado en el próximo período de sesiones ordinarias.</p>
    `,
    category: 'politica',
    author: mockAuthors[0],
    featuredImage: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&h=630&fit=crop',
    publishedAt: '2024-01-14T16:00:00Z',
    updatedAt: '2024-01-14T18:00:00Z',
    readingTime: 3,
    status: 'published',
    tags: ['política', 'congreso', 'reforma', 'electoral'],
  },
  {
    id: '4',
    slug: 'protestas-masivas-contra-ajuste-fiscal',
    title: 'Miles de personas se movilizaron contra el ajuste fiscal en todo el país',
    subtitle: 'Sindicatos y organizaciones sociales protagonizaron una jornada de protesta que paralizó las principales ciudades.',
    excerpt: 'La convocatoria superó las expectativas de los organizadores, con manifestaciones simultáneas en más de 20 ciudades.',
    content: `
      <p>Una multitudinaria marcha recorrió las calles del centro de la ciudad capital, en rechazo a las políticas de ajuste implementadas por el gobierno nacional.</p>
      
      <p>Los manifestantes, convocados por la central sindical y diversas organizaciones sociales, exigieron la revisión de las medidas que consideran "regresivas".</p>
      
      <h2>Demandas principales</h2>
      
      <p>Entre los reclamos más destacados se encuentran:</p>
      
      <ul>
        <li>Aumento de salarios acorde a la inflación</li>
        <li>Freno a los despidos en el sector público</li>
        <li>Mantenimiento de programas sociales</li>
      </ul>
    `,
    category: 'sociedad',
    author: mockAuthors[0],
    featuredImage: 'https://images.unsplash.com/photo-1591848478625-de43268e6fb8?w=1200&h=630&fit=crop',
    publishedAt: '2024-01-14T20:00:00Z',
    updatedAt: '2024-01-14T22:00:00Z',
    readingTime: 4,
    status: 'published',
    tags: ['protesta', 'sindicatos', 'ajuste'],
  },
  {
    id: '5',
    slug: 'opinion-el-futuro-del-sistema-politico',
    title: 'El futuro del sistema político: ¿hacia dónde vamos?',
    subtitle: 'Una reflexión sobre los desafíos que enfrenta nuestra democracia en tiempos de polarización.',
    excerpt: 'La crisis de representación política exige repensar las instituciones y los mecanismos de participación ciudadana.',
    content: `
      <p><em>Por María González, Editora Política</em></p>
      
      <p>Vivimos tiempos de profunda transformación política. Las certezas que ordenaron el debate público durante décadas parecen haberse diluido, dando paso a un escenario de incertidumbre que desafía a todos los actores.</p>
      
      <p>La polarización creciente, lejos de ser un fenómeno local, responde a tendencias globales que atraviesan a las democracias occidentales. Sin embargo, nuestra historia particular le imprime características propias a este proceso.</p>
      
      <h2>Los síntomas de la crisis</h2>
      
      <p>El descrédito de las instituciones tradicionales, la emergencia de nuevos actores políticos y la transformación del espacio público mediado por las redes sociales configuran un panorama complejo.</p>
      
      <p>Ante este escenario, cabe preguntarse: ¿cómo reconstruir los puentes del diálogo? ¿Es posible generar acuerdos básicos que trasciendan las diferencias partidarias?</p>
    `,
    category: 'opinion',
    author: mockAuthors[0],
    featuredImage: 'https://images.unsplash.com/photo-1494172961521-33799ddd43a5?w=1200&h=630&fit=crop',
    publishedAt: '2024-01-13T10:00:00Z',
    updatedAt: '2024-01-13T10:00:00Z',
    readingTime: 6,
    status: 'published',
    tags: ['opinión', 'democracia', 'política'],
  },
  // Noticias scrapeadas (para demostrar integración n8n)
  {
    id: '6',
    slug: 'noticia-importada-via-scraping',
    title: 'Noticia importada automáticamente desde fuente externa',
    subtitle: 'Esta noticia fue scrapeada por n8n y está pendiente de revisión editorial.',
    excerpt: 'Contenido importado automáticamente que requiere revisión y posible reescritura.',
    content: '<p>Este es el contenido original scrapeado que necesita ser revisado y potencialmente reescrito con IA antes de su publicación.</p>',
    category: 'politica',
    author: mockAuthors[0],
    featuredImage: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&h=630&fit=crop',
    publishedAt: '2024-01-15T06:00:00Z',
    updatedAt: '2024-01-15T06:00:00Z',
    readingTime: 2,
    status: 'scraped',
    tags: ['importado', 'pendiente'],
    source: 'https://fuente-externa.com/noticia-original',
    originalContent: '<p>Contenido original de la fuente externa...</p>',
    scrapedAt: '2024-01-15T06:00:00Z',
  },
  {
    id: '7',
    slug: 'noticia-reescrita-por-ia',
    title: 'Noticia procesada por IA lista para revisión',
    subtitle: 'El contenido fue reescrito automáticamente y espera aprobación del editor.',
    excerpt: 'Esta noticia pasó por el proceso de reescritura con IA y está lista para revisión final.',
    content: '<p>Contenido reescrito por IA con mejor estructura y estilo editorial...</p>',
    category: 'economia',
    author: mockAuthors[1],
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop',
    publishedAt: '2024-01-15T07:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
    readingTime: 3,
    status: 'rewritten',
    tags: ['economía', 'procesado'],
    source: 'https://otra-fuente.com/noticia',
    originalContent: '<p>Contenido original...</p>',
    rewrittenContent: '<p>Contenido mejorado por IA...</p>',
    aiModel: 'gpt-4',
    scrapedAt: '2024-01-15T07:00:00Z',
  },
  {
    id: '8',
    slug: 'borrador-en-edicion',
    title: 'Borrador de noticia en proceso de edición',
    subtitle: 'El equipo editorial está trabajando en esta nota.',
    excerpt: 'Noticia en estado de borrador, pendiente de completar.',
    content: '<p>Contenido parcial en desarrollo...</p>',
    category: 'politica',
    author: mockAuthors[0],
    featuredImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=630&fit=crop',
    publishedAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:30:00Z',
    readingTime: 1,
    status: 'draft',
    tags: ['borrador'],
  },
];

// Funciones helper para simular API calls
export function getPublishedArticles(): Article[] {
  return mockArticles.filter(a => a.status === 'published');
}

export function getAllArticles(): Article[] {
  return mockArticles;
}

export function getArticleBySlug(slug: string): Article | undefined {
  return mockArticles.find(a => a.slug === slug);
}

export function getArticlesByCategory(category: Category): Article[] {
  return mockArticles.filter(a => a.category === category && a.status === 'published');
}

export function getArticlesByStatus(status: ArticleStatus): Article[] {
  return mockArticles.filter(a => a.status === status);
}

export function getFeaturedArticle(): Article | undefined {
  return mockArticles.find(a => a.status === 'published');
}

export function getSecondaryArticles(): Article[] {
  return mockArticles.filter(a => a.status === 'published').slice(1, 4);
}

export function getLatestArticles(limit: number = 10): Article[] {
  return mockArticles
    .filter(a => a.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

// Categorías disponibles con metadata
export const categories: { value: Category; label: string; description: string }[] = [
  { value: 'politica', label: 'Política', description: 'Noticias del ámbito político nacional' },
  { value: 'economia', label: 'Economía', description: 'Finanzas, mercados y políticas económicas' },
  { value: 'internacional', label: 'Internacional', description: 'Noticias del mundo y relaciones exteriores' },
  { value: 'sociedad', label: 'Sociedad', description: 'Temas sociales y de interés público' },
  { value: 'opinion', label: 'Opinión', description: 'Columnas y análisis editorial' },
  { value: 'breaking', label: 'Último Momento', description: 'Noticias de última hora' },
];
