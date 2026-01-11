'use client';

/**
 * EDITOR DE NOTICIAS - Crear Nueva
 * 
 * Editor completo con:
 * - Título y bajada
 * - Slug automático
 * - Categoría y estado
 * - Editor WYSIWYG
 * - Vista previa
 * 
 * INTEGRACIÓN IA:
 * - Campo para URL fuente (scraping)
 * - Contenido original vs reescrito
 * - Marcadores para secciones editables
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Wand2, 
  Globe, 
  Clock,
  AlertCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TiptapEditor } from '@/components/editor/tiptap-editor';
import { categories } from '@/lib/mock-data';
import { generateSlug, calculateReadingTime } from '@/lib/utils';
import { ArticleStatus, Category } from '@/types';
import Link from 'next/link';

interface ArticleForm {
  title: string;
  subtitle: string;
  slug: string;
  category: Category;
  status: ArticleStatus;
  source: string;
  metaTitle: string;
  metaDescription: string;
  featuredImage: string;
}

const statusOptions = [
  { value: 'draft', label: 'Borrador' },
  { value: 'published', label: 'Publicar' },
  { value: 'scraped', label: 'Scrapeada' },
  { value: 'rewritten', label: 'Reescrita' },
];

const categoryOptions = categories.map(c => ({ value: c.value, label: c.label }));

export default function EditorPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ArticleForm>({
    defaultValues: {
      title: '',
      subtitle: '',
      slug: '',
      category: 'politica',
      status: 'draft',
      source: '',
      metaTitle: '',
      metaDescription: '',
      featuredImage: '',
    },
  });

  const title = watch('title');
  const watchedContent = content;

  // Auto-generar slug desde título
  useEffect(() => {
    if (title) {
      setValue('slug', generateSlug(title));
    }
  }, [title, setValue]);

  // Calcular tiempo de lectura
  const readingTime = calculateReadingTime(watchedContent);

  const onSubmit = async (data: ArticleForm) => {
    setIsSaving(true);
    
    try {
      // Simular guardado
      const articleData = {
        ...data,
        content,
        readingTime,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Guardando artículo:', articleData);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirigir al dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error guardando:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Simular reescritura con IA
  const handleAIRewrite = async () => {
    const confirm = window.confirm(
      '¿Querés que la IA reescriba el contenido?\n\n' +
      'Esto simulará el proceso de reescritura automática.'
    );
    
    if (confirm) {
      // Simular procesamiento IA
      setContent(prev => 
        `<p><em>[Contenido reescrito por IA]</em></p>\n${prev}`
      );
      setValue('status', 'rewritten');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Nueva Noticia
              </h1>
              <p className="text-sm text-gray-500">
                {readingTime} min de lectura estimado
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye size={18} className="mr-2" />
              {showPreview ? 'Editar' : 'Vista Previa'}
            </Button>
            
            <Button
              variant="secondary"
              onClick={handleAIRewrite}
            >
              <Wand2 size={18} className="mr-2" />
              Reescribir con IA
            </Button>
            
            <Button
              onClick={handleSubmit(onSubmit)}
              isLoading={isSaving}
            >
              <Save size={18} className="mr-2" />
              Guardar
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Editor */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title & Subtitle */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <Input
                    label="Título"
                    placeholder="Escribí un título impactante..."
                    error={errors.title?.message}
                    {...register('title', {
                      required: 'El título es requerido',
                      minLength: {
                        value: 10,
                        message: 'Mínimo 10 caracteres',
                      },
                    })}
                  />

                  <Textarea
                    label="Bajada (Subtítulo)"
                    placeholder="Una breve descripción que amplíe el título..."
                    rows={3}
                    error={errors.subtitle?.message}
                    {...register('subtitle', {
                      required: 'La bajada es requerida',
                    })}
                  />

                  <Input
                    label="Slug (URL)"
                    placeholder="url-de-la-noticia"
                    helperText="Se genera automáticamente desde el título"
                    {...register('slug')}
                  />
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card>
                <CardHeader>
                  <h2 className="font-semibold text-gray-900">Contenido</h2>
                </CardHeader>
                <CardContent className="p-0">
                  {showPreview ? (
                    <div 
                      className="article-content p-6"
                      dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-400">Sin contenido...</p>' }}
                    />
                  ) : (
                    <TiptapEditor
                      content={content}
                      onChange={setContent}
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish Settings */}
              <Card>
                <CardHeader>
                  <h2 className="font-semibold text-gray-900">Publicación</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                    label="Estado"
                    options={statusOptions}
                    {...register('status')}
                  />

                  <Select
                    label="Categoría"
                    options={categoryOptions}
                    {...register('category')}
                  />
                </CardContent>
              </Card>

              {/* Featured Image */}
              <Card>
                <CardHeader>
                  <h2 className="font-semibold text-gray-900">Imagen Destacada</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="URL de Imagen"
                    placeholder="https://..."
                    {...register('featuredImage')}
                  />
                  
                  {watch('featuredImage') && (
                    <img
                      src={watch('featuredImage')}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-md"
                    />
                  )}
                </CardContent>
              </Card>

              {/* Source (for scraped articles) */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Globe size={18} className="text-gray-400" />
                    <h2 className="font-semibold text-gray-900">Fuente Original</h2>
                  </div>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="https://fuente-original.com/noticia"
                    helperText="URL de donde se scrapeó la noticia (opcional)"
                    {...register('source')}
                  />
                </CardContent>
              </Card>

              {/* SEO */}
              <Card>
                <CardHeader>
                  <h2 className="font-semibold text-gray-900">SEO</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Meta Título"
                    placeholder="Título para buscadores..."
                    helperText="Dejar vacío para usar el título principal"
                    {...register('metaTitle')}
                  />

                  <Textarea
                    label="Meta Descripción"
                    placeholder="Descripción para buscadores..."
                    rows={3}
                    {...register('metaDescription')}
                  />
                </CardContent>
              </Card>

              {/* AI Integration Notice */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="text-blue-800 text-sm font-medium">
                        Integración con IA
                      </p>
                      <p className="text-blue-700 text-xs mt-1">
                        El botón Reescribir con IA enviará el contenido al 
                        servicio de IA configurado en n8n para optimizar 
                        el texto automáticamente.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
