-- ============================================
-- MIGRACIÓN INICIAL - Portal de Noticias Políticas
-- ============================================
-- Este script crea todas las tablas necesarias para el portal
-- Ejecutar en Supabase SQL Editor o via CLI

-- ============================================
-- EXTENSIONES
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para búsqueda de texto

-- ============================================
-- TABLA: categories
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar categorías por defecto
INSERT INTO categories (id, label, slug, description) VALUES
  ('politica', 'Política', 'politica', 'Noticias políticas nacionales'),
  ('economia', 'Economía', 'economia', 'Noticias económicas y financieras'),
  ('internacional', 'Internacional', 'internacional', 'Noticias del mundo'),
  ('sociedad', 'Sociedad', 'sociedad', 'Noticias sociales y culturales'),
  ('opinion', 'Opinión', 'opinion', 'Columnas de opinión'),
  ('breaking', 'Último Momento', 'breaking', 'Noticias de último momento')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- TABLA: authors
-- ============================================
CREATE TABLE IF NOT EXISTS authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'writer',
  avatar TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: articles
-- ============================================
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  excerpt TEXT,
  content TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  author_id UUID NOT NULL REFERENCES authors(id) ON DELETE RESTRICT,
  featured_image TEXT,
  image_caption TEXT,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reading_time INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('scraped', 'rewritten', 'draft', 'published', 'archived')),
  tags TEXT[] DEFAULT '{}',
  
  -- Campos para integración n8n + IA
  source TEXT,
  original_content TEXT,
  rewritten_content TEXT,
  ai_model TEXT,
  scraped_at TIMESTAMPTZ,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT
);

-- Índices para búsqueda y rendimiento
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_title_search ON articles USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_articles_content_search ON articles USING gin(content gin_trgm_ops);

-- ============================================
-- FUNCIÓN: Actualizar updated_at automáticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_authors_updated_at BEFORE UPDATE ON authors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCIÓN: Generar slug automáticamente
-- ============================================
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
BEGIN
  -- Convertir a minúsculas y reemplazar espacios y caracteres especiales
  slug := lower(title);
  slug := regexp_replace(slug, '[^a-z0-9]+', '-', 'g');
  slug := trim(both '-' from slug);
  RETURN slug;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================
-- Habilitar RLS en todas las tablas
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Políticas para categories: Todos pueden leer
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

-- Políticas para authors: Todos pueden leer
CREATE POLICY "Authors are viewable by everyone"
  ON authors FOR SELECT
  USING (true);

-- Políticas para articles:
-- - Todos pueden leer artículos publicados
-- - Solo autenticados pueden crear/editar/eliminar
CREATE POLICY "Published articles are viewable by everyone"
  ON articles FOR SELECT
  USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create articles"
  ON articles FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update articles"
  ON articles FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete articles"
  ON articles FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- STORAGE BUCKET: images
-- ============================================
-- Crear bucket para imágenes (ejecutar en Supabase Dashboard > Storage)
-- O usar la API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Política de Storage: Todos pueden leer imágenes públicas
-- CREATE POLICY "Images are publicly accessible"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'images');

-- Política de Storage: Solo autenticados pueden subir
-- CREATE POLICY "Authenticated users can upload images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Política de Storage: Solo autenticados pueden eliminar
-- CREATE POLICY "Authenticated users can delete images"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- ============================================
-- VISTAS ÚTILES
-- ============================================
CREATE OR REPLACE VIEW published_articles AS
SELECT 
  a.*,
  c.label as category_label,
  c.slug as category_slug,
  au.name as author_name,
  au.avatar as author_avatar
FROM articles a
JOIN categories c ON a.category_id = c.id
JOIN authors au ON a.author_id = au.id
WHERE a.status = 'published'
ORDER BY a.published_at DESC;

-- ============================================
-- COMENTARIOS FINALES
-- ============================================
-- 1. Después de ejecutar esta migración:
--    - Ve a Supabase Dashboard > Storage
--    - Crea un bucket llamado "images" y márcalo como público
--    - Configura las políticas de Storage manualmente o via API
--
-- 2. Para crear el primer autor:
--    INSERT INTO authors (name, email, role) 
--    VALUES ('Administrador', 'admin@politicalnews.com', 'admin');
--
-- 3. Las políticas RLS permiten:
--    - Lectura pública de artículos publicados
--    - CRUD completo para usuarios autenticados
--
-- 4. Para búsqueda full-text avanzada, considera agregar:
--    CREATE INDEX idx_articles_fts ON articles USING gin(to_tsvector('spanish', title || ' ' || content));
