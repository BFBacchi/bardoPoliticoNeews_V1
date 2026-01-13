# 🚀 Configuración Rápida de Supabase

Guía rápida para configurar Supabase en 5 minutos.

## 1️⃣ Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Espera a que se complete la configuración (~2 minutos)

## 2️⃣ Obtener Credenciales

En tu proyecto de Supabase:
1. Ve a **Settings** > **API**
2. Copia:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...`

## 3️⃣ Configurar Variables de Entorno

Crea `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

## 4️⃣ Ejecutar Migración SQL

1. En Supabase Dashboard, ve a **SQL Editor**
2. Abre `supabase/migrations/001_initial_schema.sql`
3. Copia todo el contenido
4. Pégalo en el SQL Editor
5. Haz clic en **Run**

✅ Esto creará todas las tablas necesarias.

## 5️⃣ Configurar Storage

1. Ve a **Storage** en el Dashboard
2. Crea un bucket llamado `images`
3. Márcalo como **Público**
4. Configura las políticas (ver migración SQL)

## 6️⃣ Crear Usuario

1. Ve a **Authentication** > **Users**
2. Haz clic en **Add User** > **Create New User**
3. Ingresa email y contraseña
4. Guarda las credenciales

## 7️⃣ Crear Autor

En SQL Editor, ejecuta:

```sql
INSERT INTO authors (name, email, role)
VALUES ('Tu Nombre', 'tu@email.com', 'admin');
```

## 8️⃣ ¡Listo!

```bash
npm run dev
```

Ve a `http://localhost:3000/login` e inicia sesión.

---

**¿Problemas?** Ver [docs/SUPABASE-MIGRATION.md](docs/SUPABASE-MIGRATION.md) para guía completa.
