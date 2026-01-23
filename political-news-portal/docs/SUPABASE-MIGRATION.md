# 🔄 Guía de Migración a Supabase

Esta guía te ayudará a migrar el portal de noticias políticas de datos mock a Supabase como backend completo.

## 📋 Requisitos Previos

1. Cuenta en [Supabase](https://supabase.com)
2. Node.js 18+ instalado
3. Git configurado

## 🚀 Paso 1: Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Anota las siguientes credenciales (las encontrarás en Settings > API):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...`

## 🔧 Paso 2: Configurar Variables de Entorno

1. Copia el archivo `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` y agrega tus credenciales de Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```

## 🗄️ Paso 3: Ejecutar Migración SQL

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a **SQL Editor**
3. Abre el archivo `supabase/migrations/001_initial_schema.sql`
4. Copia todo el contenido y pégalo en el SQL Editor
5. Ejecuta la migración (botón "Run")

Esto creará:
- Tabla `categories` con categorías por defecto
- Tabla `authors` para autores
- Tabla `articles` para noticias
- Índices para búsqueda optimizada
- Políticas RLS (Row Level Security)

## 📦 Paso 4: Configurar Storage para Imágenes

1. En Supabase Dashboard, ve a **Storage**
2. Crea un nuevo bucket llamado `images`
3. Marca el bucket como **Público**
4. Configura las políticas de acceso:

   **Política de Lectura (Pública):**
   ```sql
   CREATE POLICY "Images are publicly accessible"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'images');
   ```

   **Política de Escritura (Autenticados):**
   ```sql
   CREATE POLICY "Authenticated users can upload images"
   ON storage.objects FOR INSERT
   WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
   ```

   **Política de Eliminación (Autenticados):**
   ```sql
   CREATE POLICY "Authenticated users can delete images"
   ON storage.objects FOR DELETE
   USING (bucket_id = 'images' AND auth.role() = 'authenticated');
   ```

## 👤 Paso 5: Crear Primer Usuario

### Opción A: Desde Supabase Dashboard

1. Ve a **Authentication** > **Users**
2. Haz clic en **Add User** > **Create New User**
3. Ingresa email y contraseña
4. Guarda las credenciales

### Opción B: Registro desde la App

1. Ejecuta la aplicación: `npm run dev`
2. Ve a `/login`
3. Haz clic en "Registrarse" (si está implementado)
4. O crea el usuario manualmente desde Supabase Dashboard

### Crear Autor Asociado

Después de crear el usuario, crea un autor asociado:

```sql
INSERT INTO authors (name, email, role)
VALUES ('Tu Nombre', 'tu@email.com', 'admin');
```

## 🔐 Paso 6: Configurar Autenticación

La autenticación ya está configurada para usar Supabase Auth. Solo necesitas:

1. Verificar que las variables de entorno estén correctas
2. Los usuarios deben registrarse o ser creados en Supabase Dashboard
3. El sistema automáticamente creará/obtendrá el autor asociado al usuario

## ✅ Paso 7: Verificar Instalación

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Accede a `http://localhost:3000/login`
4. Inicia sesión con las credenciales creadas
5. Verifica que puedas:
   - Ver el dashboard
   - Crear una nueva noticia
   - Editar noticias existentes
   - Eliminar noticias

## 📝 Estructura de Base de Datos

### Tabla: `categories`
- `id` (TEXT, PK): Identificador de categoría
- `label` (TEXT): Nombre legible
- `slug` (TEXT): URL-friendly
- `description` (TEXT): Descripción opcional

### Tabla: `authors`
- `id` (UUID, PK): Identificador único
- `name` (TEXT): Nombre del autor
- `email` (TEXT, UNIQUE): Email del autor
- `role` (TEXT): Rol (admin, editor, writer)
- `avatar` (TEXT): URL del avatar
- `bio` (TEXT): Biografía

### Tabla: `articles`
- `id` (UUID, PK): Identificador único
- `slug` (TEXT, UNIQUE): URL-friendly
- `title` (TEXT): Título de la noticia
- `subtitle` (TEXT): Bajada editorial
- `excerpt` (TEXT): Resumen
- `content` (TEXT): Contenido HTML completo
- `category_id` (TEXT, FK): Referencia a categories
- `author_id` (UUID, FK): Referencia a authors
- `featured_image` (TEXT): URL de imagen destacada
- `status` (TEXT): Estado (scraped, rewritten, draft, published, archived)
- `published_at` (TIMESTAMPTZ): Fecha de publicación
- `created_at` (TIMESTAMPTZ): Fecha de creación
- `updated_at` (TIMESTAMPTZ): Última actualización
- Campos adicionales para integración n8n e IA

## 🔒 Seguridad (RLS)

Las políticas RLS están configuradas para:

- **Lectura pública**: Cualquiera puede leer artículos publicados
- **CRUD completo**: Solo usuarios autenticados pueden crear/editar/eliminar
- **Storage**: Solo autenticados pueden subir/eliminar imágenes

## 🐛 Solución de Problemas

### Error: "relation does not exist"
- Verifica que ejecutaste la migración SQL completa
- Revisa que todas las tablas se crearon correctamente

### Error: "new row violates row-level security policy"
- Verifica que estás autenticado
- Revisa las políticas RLS en Supabase Dashboard

### Error: "bucket does not exist"
- Crea el bucket `images` en Storage
- Verifica que esté marcado como público

### Error de autenticación
- Verifica las variables de entorno
- Asegúrate de que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` estén correctas
- Reinicia el servidor de desarrollo después de cambiar variables de entorno

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de Next.js con Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🎉 ¡Listo!

Una vez completados estos pasos, tu portal estará completamente integrado con Supabase y podrás:

- ✅ Autenticación real con Supabase Auth
- ✅ Base de datos PostgreSQL
- ✅ Storage para imágenes
- ✅ CRUD completo de artículos
- ✅ Dashboard funcional
- ✅ Editor de noticias conectado
