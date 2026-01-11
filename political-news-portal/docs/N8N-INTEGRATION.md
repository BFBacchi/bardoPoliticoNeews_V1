# 🔄 Integración con n8n - Guía Completa

Esta guía detalla cómo configurar n8n para automatizar el scraping de noticias
y su integración con el portal.

## Arquitectura del Flujo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              n8n WORKFLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │ Schedule │ ─▶ │  HTTP    │ ─▶ │  HTML    │ ─▶ │ Function │              │
│  │ Trigger  │    │  Request │    │  Extract │    │  Node    │              │
│  │ (cada    │    │ (fetch   │    │ (parsear │    │ (format  │              │
│  │  1 hora) │    │  página) │    │  HTML)   │    │  JSON)   │              │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘              │
│                                                         │                    │
│                                                         ▼                    │
│                                              ┌──────────────────┐           │
│                                              │  OpenAI Node     │           │
│                                              │  (Reescritura    │           │
│                                              │   opcional)      │           │
│                                              └────────┬─────────┘           │
│                                                       │                      │
│                                                       ▼                      │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        HTTP Request (POST)                            │  │
│  │                  → Backend/API del Portal                             │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Workflow 1: Scraping Básico

### Nodos del Workflow

#### 1. Schedule Trigger
```json
{
  "rule": {
    "interval": [{"field": "hours", "value": 1}]
  }
}
```
Ejecuta el workflow cada hora.

#### 2. HTTP Request - Obtener página
```json
{
  "method": "GET",
  "url": "https://sitio-de-noticias.com/politica",
  "options": {
    "timeout": 30000,
    "headers": {
      "User-Agent": "Mozilla/5.0 (compatible; NewsBot/1.0)"
    }
  }
}
```

#### 3. HTML Extract - Parsear contenido
```json
{
  "dataPropertyName": "articles",
  "extractionValues": [
    {
      "key": "title",
      "cssSelector": "article h2.title",
      "returnValue": "text"
    },
    {
      "key": "link",
      "cssSelector": "article h2.title a",
      "returnValue": "attribute",
      "attribute": "href"
    },
    {
      "key": "excerpt",
      "cssSelector": "article .excerpt",
      "returnValue": "text"
    },
    {
      "key": "image",
      "cssSelector": "article img.featured",
      "returnValue": "attribute",
      "attribute": "src"
    }
  ]
}
```

#### 4. Split In Batches
Procesar cada artículo individualmente.

#### 5. HTTP Request - Obtener artículo completo
```json
{
  "method": "GET",
  "url": "={{ $json.link }}",
  "options": {}
}
```

#### 6. HTML Extract - Contenido del artículo
```json
{
  "extractionValues": [
    {
      "key": "content",
      "cssSelector": "article .content",
      "returnValue": "html"
    },
    {
      "key": "author",
      "cssSelector": ".author-name",
      "returnValue": "text"
    },
    {
      "key": "date",
      "cssSelector": "time[datetime]",
      "returnValue": "attribute",
      "attribute": "datetime"
    }
  ]
}
```

#### 7. Function Node - Formatear para API
```javascript
const items = [];

for (const item of $input.all()) {
  const article = {
    title: item.json.title?.trim(),
    source: item.json.link,
    originalContent: item.json.content,
    rewrittenContent: "",
    status: "scraped",
    category: "politica", // Ajustar según fuente
    scrapedAt: new Date().toISOString(),
    featuredImage: item.json.image,
    tags: ["importado", "scraping"],
    author: {
      name: item.json.author || "Fuente Externa",
      source: new URL(item.json.link).hostname
    }
  };
  
  items.push({ json: article });
}

return items;
```

#### 8. HTTP Request - Enviar al backend
```json
{
  "method": "POST",
  "url": "https://tu-backend.com/api/admin/articles/import",
  "authentication": "headerAuth",
  "headerParameters": {
    "parameters": [
      {
        "name": "Authorization",
        "value": "Bearer {{$env.API_TOKEN}}"
      }
    ]
  },
  "sendBody": true,
  "bodyParameters": {
    "parameters": []
  },
  "jsonParameters": {
    "parameters": []
  },
  "options": {}
}
```

---

## Workflow 2: Scraping + Reescritura IA

Extiende el workflow anterior con procesamiento de IA.

#### Nodo OpenAI (después del formateo)
```json
{
  "operation": "message",
  "modelId": "gpt-4",
  "messages": {
    "values": [
      {
        "content": "Sos un editor de un medio de noticias políticas. Reescribí este artículo manteniendo los hechos pero mejorando el estilo editorial:\n\n{{ $json.originalContent }}",
        "role": "user"
      }
    ]
  },
  "options": {
    "maxTokens": 2000,
    "temperature": 0.7
  }
}
```

#### Function Node - Agregar contenido reescrito
```javascript
const items = [];

for (const item of $input.all()) {
  item.json.rewrittenContent = item.json.message?.content || "";
  item.json.status = item.json.rewrittenContent ? "rewritten" : "scraped";
  item.json.aiModel = "gpt-4";
  items.push(item);
}

return items;
```

---

## Workflow 3: Monitoreo de Fuentes RSS

Alternativa usando feeds RSS.

#### RSS Feed Read
```json
{
  "url": "https://sitio-de-noticias.com/rss/politica"
}
```

#### Function Node - Parsear RSS
```javascript
const items = [];

for (const item of $input.all()) {
  const article = {
    title: item.json.title,
    source: item.json.link,
    originalContent: item.json['content:encoded'] || item.json.description,
    status: "scraped",
    category: "politica",
    scrapedAt: new Date().toISOString(),
    featuredImage: extractImageFromContent(item.json['content:encoded']),
    tags: item.json.categories || []
  };
  
  items.push({ json: article });
}

function extractImageFromContent(html) {
  if (!html) return null;
  const match = html.match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : null;
}

return items;
```

---

## Configuración de Credenciales

### Variables de Entorno en n8n

```env
# Token de API del portal
API_TOKEN=tu-jwt-token-aqui

# OpenAI (para reescritura)
OPENAI_API_KEY=sk-...

# URL del backend
BACKEND_URL=https://tu-backend.com
```

### Configurar en n8n UI

1. Ir a **Settings > Credentials**
2. Crear credencial "Header Auth"
   - Name: Portal API
   - Name: Authorization
   - Value: Bearer ${API_TOKEN}
3. Crear credencial "OpenAI API"
   - API Key: tu-api-key

---

## Deduplicación de Noticias

Para evitar importar noticias duplicadas:

#### Function Node - Verificar duplicados
```javascript
const existingSlugs = $env.EXISTING_SLUGS ? 
  JSON.parse($env.EXISTING_SLUGS) : [];

const items = [];

for (const item of $input.all()) {
  const slug = generateSlug(item.json.title);
  
  if (!existingSlugs.includes(slug)) {
    item.json.slug = slug;
    items.push(item);
  }
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

return items;
```

---

## Manejo de Errores

### Configurar Error Workflow

1. Crear workflow "Error Handler"
2. Configurar notificación (Slack, Email, etc.)
3. Logear errores para debugging

#### Error Handler Node
```javascript
const errorInfo = {
  workflowId: $workflow.id,
  workflowName: $workflow.name,
  executionId: $execution.id,
  timestamp: new Date().toISOString(),
  error: $input.first().json.error
};

return [{ json: errorInfo }];
```

---

## Programación Sugerida

| Fuente | Frecuencia | Horario |
|--------|------------|---------|
| Noticias principales | Cada 30 min | 24/7 |
| Análisis/Opinión | Cada 4 horas | 08:00 - 22:00 |
| Internacional | Cada 2 horas | 24/7 |
| Economía | Cada hora | Días hábiles |

### Configurar múltiples triggers
```json
{
  "rules": [
    {"field": "minutes", "value": 30},
    {"field": "hours", "value": 1, "triggerAtHour": 8}
  ]
}
```

---

## Testing del Workflow

### 1. Test Manual
- Ejecutar workflow con datos de prueba
- Verificar output de cada nodo
- Confirmar llegada al backend

### 2. Verificar en Dashboard
- Ir a `/dashboard` en el portal
- Buscar noticias con estado "Scrapeada"
- Verificar contenido y formato

### 3. Monitoreo
- Configurar alertas para fallos
- Revisar logs de ejecución
- Verificar métricas de API

---

## Troubleshooting

### Error: "Cannot read property of undefined"
- Verificar selectores CSS
- El sitio puede haber cambiado estructura
- Agregar nodos de validación

### Error: "Rate limit exceeded"
- Aumentar intervalo entre requests
- Agregar delays entre nodos
- Usar proxy si es necesario

### Error: "401 Unauthorized"
- Verificar token de API
- Token puede haber expirado
- Regenerar credenciales

### Contenido vacío
- Verificar JavaScript rendering
- Usar Puppeteer node si es SPA
- Revisar User-Agent headers

---

## Próximos Pasos

1. **Implementar backend** con endpoints reales
2. **Configurar base de datos** para persistencia
3. **Agregar más fuentes** de noticias
4. **Optimizar IA** con prompts específicos
5. **Automatizar publicación** en redes sociales
