# 🤖 Integración con IA - Guía de Reescritura

Esta guía detalla cómo implementar la reescritura automática de contenido
utilizando modelos de lenguaje (LLM).

## Visión General

```
┌─────────────────────────────────────────────────────────────┐
│                     FLUJO DE REESCRITURA                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐                                               │
│  │ Artículo │                                               │
│  │ Original │                                               │
│  │ (scraped)│                                               │
│  └────┬─────┘                                               │
│       │                                                      │
│       ▼                                                      │
│  ┌──────────────────────────────────────┐                   │
│  │         PROCESO DE REESCRITURA        │                   │
│  │                                        │                   │
│  │  1. Análisis del contenido            │                   │
│  │  2. Extracción de hechos clave        │                   │
│  │  3. Identificación de citas           │                   │
│  │  4. Reescritura con nuevo estilo      │                   │
│  │  5. Verificación de precisión         │                   │
│  │                                        │                   │
│  └────────────────┬─────────────────────┘                   │
│                   │                                          │
│                   ▼                                          │
│  ┌──────────────────────────────────────┐                   │
│  │           MODELO DE IA                │                   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ │                   │
│  │  │  GPT-4  │ │ Claude  │ │  Llama  │ │                   │
│  │  └─────────┘ └─────────┘ └─────────┘ │                   │
│  └────────────────┬─────────────────────┘                   │
│                   │                                          │
│                   ▼                                          │
│  ┌──────────┐                                               │
│  │ Artículo │                                               │
│  │ Reescrito│                                               │
│  │(rewritten│                                               │
│  └──────────┘                                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Prompts de Sistema

### Prompt Principal - Reescritura Editorial

```
Sos un editor senior de un medio de noticias políticas de Argentina.
Tu rol es reescribir artículos periodísticos manteniendo la precisión
informativa pero mejorando el estilo editorial.

REGLAS ESTRICTAS:

1. PRECISIÓN
   - Nunca inventar información
   - Mantener todos los datos, fechas y cifras exactas
   - Preservar citas textuales entre comillas
   - Si hay ambigüedad, mantener la información original

2. ESTILO
   - Usar lenguaje claro y accesible
   - Evitar jerga excesiva
   - Párrafos de 2-3 oraciones máximo
   - Estructura: gancho → contexto → desarrollo → cierre

3. ESTRUCTURA HTML
   - Usar <p> para párrafos
   - Usar <h2> para secciones principales
   - Usar <h3> para subsecciones
   - Usar <blockquote> para citas destacadas
   - Usar <ul>/<li> para listas

4. TONO
   - Neutral pero atractivo
   - Sin sensacionalismo
   - Sin opinión personal
   - Profesional y serio

5. EXTENSIÓN
   - Mantener extensión similar al original
   - Mínimo 3 párrafos
   - Máximo 15 párrafos

Devolvé ÚNICAMENTE el HTML del artículo reescrito.
No incluyas explicaciones, solo el contenido.
```

### Prompt para Resúmenes

```
Generá un resumen ejecutivo del siguiente artículo para:
1. Bajada/subtítulo (máximo 200 caracteres)
2. Excerpt para redes sociales (máximo 280 caracteres)
3. Meta description SEO (máximo 160 caracteres)

Formato de respuesta (JSON):
{
  "subtitle": "...",
  "excerpt": "...",
  "metaDescription": "..."
}

ARTÍCULO:
{content}
```

### Prompt para Extracción de Tags

```
Analizá el siguiente artículo de noticias políticas y extraé:
1. 5-10 tags/palabras clave relevantes
2. La categoría principal (politica, economia, internacional, sociedad, opinion)
3. Entidades mencionadas (personas, organizaciones, lugares)

Formato de respuesta (JSON):
{
  "tags": ["tag1", "tag2", ...],
  "category": "politica",
  "entities": {
    "people": ["Nombre 1", "Nombre 2"],
    "organizations": ["Org 1"],
    "places": ["Lugar 1"]
  }
}

ARTÍCULO:
{content}
```

---

## Implementación Backend

### Servicio de IA (TypeScript)

```typescript
// services/ai-service.ts

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RewriteResult {
  content: string;
  model: string;
  tokensUsed: number;
  processingTime: number;
}

export async function rewriteArticle(
  originalContent: string,
  options: {
    model?: string;
    preserveQuotes?: boolean;
    targetTone?: 'neutral' | 'analytical' | 'urgent';
  } = {}
): Promise<RewriteResult> {
  const startTime = Date.now();
  const model = options.model || 'gpt-4';

  const systemPrompt = `
    Sos un editor senior de un medio de noticias políticas.
    Reescribí el artículo manteniendo precisión informativa
    pero mejorando el estilo editorial.
    
    Reglas:
    - Mantener datos y citas exactas
    - Estructura HTML con p, h2, h3, blockquote
    - Tono ${options.targetTone || 'neutral'}
    - Sin inventar información
    
    Devolvé SOLO el HTML.
  `;

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: originalContent },
    ],
    max_tokens: 3000,
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content || '';
  const tokensUsed = response.usage?.total_tokens || 0;

  return {
    content,
    model,
    tokensUsed,
    processingTime: Date.now() - startTime,
  };
}

export async function generateSummaries(content: string): Promise<{
  subtitle: string;
  excerpt: string;
  metaDescription: string;
}> {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'Generá resúmenes en español. Responder SOLO con JSON válido.',
      },
      {
        role: 'user',
        content: `
          Generá para este artículo:
          1. subtitle (max 200 chars)
          2. excerpt para redes (max 280 chars)
          3. metaDescription SEO (max 160 chars)
          
          ARTÍCULO:
          ${content}
        `,
      },
    ],
    max_tokens: 500,
    temperature: 0.5,
    response_format: { type: 'json_object' },
  });

  const result = JSON.parse(response.choices[0]?.message?.content || '{}');
  
  return {
    subtitle: result.subtitle || '',
    excerpt: result.excerpt || '',
    metaDescription: result.metaDescription || '',
  };
}

export async function extractTags(content: string): Promise<{
  tags: string[];
  category: string;
}> {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'Extraer tags y categoría. Responder SOLO con JSON válido.',
      },
      {
        role: 'user',
        content: `
          Extraé de este artículo:
          - tags: 5-10 palabras clave
          - category: politica|economia|internacional|sociedad|opinion
          
          ARTÍCULO:
          ${content}
        `,
      },
    ],
    max_tokens: 200,
    temperature: 0.3,
    response_format: { type: 'json_object' },
  });

  const result = JSON.parse(response.choices[0]?.message?.content || '{}');
  
  return {
    tags: result.tags || [],
    category: result.category || 'politica',
  };
}
```

### API Endpoint

```typescript
// app/api/articles/[id]/rewrite/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { rewriteArticle, generateSummaries, extractTags } from '@/services/ai-service';
import { getArticleById, updateArticle } from '@/services/article-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await getArticleById(params.id);
    
    if (!article) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const options = {
      model: body.model || 'gpt-4',
      preserveQuotes: body.preserveQuotes ?? true,
      targetTone: body.targetTone || 'neutral',
    };

    // Reescribir contenido
    const rewriteResult = await rewriteArticle(
      article.originalContent || article.content,
      options
    );

    // Generar resúmenes
    const summaries = await generateSummaries(rewriteResult.content);

    // Extraer tags
    const { tags, category } = await extractTags(rewriteResult.content);

    // Actualizar artículo
    const updated = await updateArticle(params.id, {
      rewrittenContent: rewriteResult.content,
      content: rewriteResult.content,
      subtitle: summaries.subtitle,
      excerpt: summaries.excerpt,
      metaDescription: summaries.metaDescription,
      tags,
      category,
      status: 'rewritten',
      aiModel: rewriteResult.model,
      aiProcessedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      article: updated,
      stats: {
        tokensUsed: rewriteResult.tokensUsed,
        processingTime: rewriteResult.processingTime,
      },
    });
  } catch (error) {
    console.error('Error en reescritura:', error);
    return NextResponse.json(
      { error: 'Error procesando reescritura' },
      { status: 500 }
    );
  }
}
```

---

## Modelos Recomendados

### Para Reescritura

| Modelo | Pros | Contras | Costo |
|--------|------|---------|-------|
| GPT-4 | Mejor calidad | Lento, caro | Alto |
| GPT-3.5-turbo | Rápido, económico | Menor calidad | Bajo |
| Claude 3 Opus | Excelente estilo | Caro | Alto |
| Claude 3 Sonnet | Buen balance | - | Medio |
| Llama 3 70B | Open source | Requiere infra | Bajo |

### Recomendación por Caso

- **Noticias importantes**: GPT-4 o Claude 3 Opus
- **Noticias rutinarias**: GPT-3.5-turbo
- **Alto volumen**: Llama 3 self-hosted
- **Resúmenes/tags**: GPT-3.5-turbo (suficiente)

---

## Optimización de Costos

### Estrategias

1. **Cache de resultados**
   - Guardar reescrituras en DB
   - No reprocesar contenido idéntico

2. **Procesamiento selectivo**
   - Solo reescribir noticias importantes
   - Usar GPT-3.5 para tareas simples

3. **Batching**
   - Agrupar requests similares
   - Procesar en horarios de bajo costo

4. **Fallback local**
   - Usar modelos locales para tareas simples
   - Reservar API para casos complejos

### Monitoreo de Uso

```typescript
// services/ai-usage-tracker.ts

interface UsageRecord {
  timestamp: Date;
  model: string;
  tokens: number;
  cost: number;
  articleId: string;
}

const TOKEN_COSTS = {
  'gpt-4': { input: 0.03, output: 0.06 }, // por 1K tokens
  'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
};

export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const costs = TOKEN_COSTS[model];
  if (!costs) return 0;
  
  return (
    (inputTokens / 1000) * costs.input +
    (outputTokens / 1000) * costs.output
  );
}

export async function trackUsage(record: UsageRecord) {
  // Guardar en DB para análisis
  await db.aiUsage.create({ data: record });
  
  // Alertar si se supera límite diario
  const dailyTotal = await getDailyUsage();
  if (dailyTotal > DAILY_LIMIT) {
    await sendAlert('Límite de IA superado');
  }
}
```

---

## Calidad y Verificación

### Checks Automáticos

```typescript
interface QualityCheck {
  passed: boolean;
  issues: string[];
}

export function checkRewriteQuality(
  original: string,
  rewritten: string
): QualityCheck {
  const issues: string[] = [];

  // 1. Verificar que no esté vacío
  if (rewritten.length < 100) {
    issues.push('Contenido muy corto');
  }

  // 2. Verificar que mantenga citas
  const originalQuotes = extractQuotes(original);
  const rewrittenQuotes = extractQuotes(rewritten);
  
  for (const quote of originalQuotes) {
    if (!rewrittenQuotes.includes(quote)) {
      issues.push(`Cita faltante: "${quote.slice(0, 50)}..."`);
    }
  }

  // 3. Verificar números y datos
  const originalNumbers = extractNumbers(original);
  const rewrittenNumbers = extractNumbers(rewritten);
  
  for (const num of originalNumbers) {
    if (!rewrittenNumbers.includes(num)) {
      issues.push(`Dato numérico faltante: ${num}`);
    }
  }

  // 4. Verificar estructura HTML
  if (!rewritten.includes('<p>')) {
    issues.push('Falta estructura de párrafos');
  }

  return {
    passed: issues.length === 0,
    issues,
  };
}

function extractQuotes(text: string): string[] {
  const matches = text.match(/"[^"]+"/g) || [];
  return matches.filter(q => q.length > 20);
}

function extractNumbers(text: string): string[] {
  return text.match(/\d+(?:[.,]\d+)?(?:\s*%)?/g) || [];
}
```

### Revisión Humana

El sistema está diseñado para que:

1. **Artículos reescritos requieren revisión**
   - Estado "rewritten" no es publicable directamente
   - Editor debe aprobar antes de publicar

2. **Comparación lado a lado**
   - El editor puede ver original vs reescrito
   - Puede restaurar contenido original si es necesario

3. **Edición post-IA**
   - El contenido reescrito es editable
   - Se pueden hacer ajustes manuales

---

## Alternativas Self-Hosted

### Ollama + Llama 3

```typescript
// Para uso local sin costos de API

import { Ollama } from 'ollama';

const ollama = new Ollama({ host: 'http://localhost:11434' });

export async function rewriteWithOllama(content: string): Promise<string> {
  const response = await ollama.chat({
    model: 'llama3:70b',
    messages: [
      {
        role: 'system',
        content: 'Sos un editor de noticias. Reescribí el artículo...',
      },
      {
        role: 'user',
        content,
      },
    ],
  });

  return response.message.content;
}
```

### Requisitos de Hardware

| Modelo | VRAM Mínimo | Recomendado |
|--------|-------------|-------------|
| Llama 3 8B | 8 GB | 12 GB |
| Llama 3 70B | 40 GB | 48 GB |
| Mixtral 8x7B | 24 GB | 32 GB |

---

## Métricas de Éxito

### KPIs a Medir

1. **Tiempo de procesamiento**
   - Objetivo: < 5 segundos por artículo

2. **Tasa de aprobación**
   - % de reescrituras aprobadas sin edición

3. **Precisión de datos**
   - % de artículos sin errores factuales

4. **Engagement**
   - Comparar métricas de artículos IA vs manuales

### Dashboard de IA

```typescript
interface AIMetrics {
  totalProcessed: number;
  approvalRate: number;
  avgProcessingTime: number;
  totalCost: number;
  errorRate: number;
}

export async function getAIMetrics(period: 'day' | 'week' | 'month'): Promise<AIMetrics> {
  // Obtener métricas de la base de datos
  const records = await db.aiUsage.findMany({
    where: { timestamp: { gte: getStartDate(period) } },
  });

  return {
    totalProcessed: records.length,
    approvalRate: calculateApprovalRate(records),
    avgProcessingTime: calculateAvgTime(records),
    totalCost: sumCosts(records),
    errorRate: calculateErrorRate(records),
  };
}
```
