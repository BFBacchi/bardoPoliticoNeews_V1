'use client';

/**
 * EDITOR DE NOTICIAS - Editar Existente
 * 
 * Carga una noticia existente para edición.
 * Útil para:
 * - Editar noticias scrapeadas
 * - Revisar contenido reescrito por IA
 * - Actualizar noticias publicadas
 */

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Wand2, 
  Globe, 
  Trash2,
  Copy
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TiptapEditor } from '@/components/editor/tiptap-editor';
import { categories, mockArticles } from '@/lib/mock-data';
import { generateSlug, calculateReadingTime, getStatusLabel, getStatusColor } from '@/lib/utils';
import { ArticleStatus, Category, Article } from '@/types';
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
  { value: 'archived', label: 'Archivada' },
];

const categoryOptions = categories.map(c => ({ value: c.value, label: c.label }));

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditArticlePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ArticleForm>();

  // Cargar artículo
  useEffect(() => {
    const found = mockArticles.find(a => a.id === id);
    if (found) {
      setArticle(found);
      setContent(found.content);
      setOriginalContent(found.originalContent || '');
      reset({
        title: found.title,
        subtitle: found.subtitle,
        slug: found.slug,
        category: found.category,
        status: found.status,
        source: found.source || '',
        metaTitle: found.metaTitle || '',
        metaDescription: found.metaDescription || '',
        featuredImage: found.featuredImage,
      });
    }
  }, [id, reset]);

  const readingTime = calculateReadingTime(content);

  const onSubmit = async (data: ArticleForm) => {
    setIsSaving(true);
    
    try {
      const articleData = {
        ...data,
        content,
        readingTime,
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Actualizando artículo:', articleData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/dashboard');
    } catch (error) {
      console.error('Error guardando:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAIRewrite = async () => {
    const confirm = window.confirm(
      '¿Querés que la IA reescriba el contenido?\n\n' +
      'El contenido actual se guardará como "original".'
    );
    
    if (confirm) {
      setOriginalContent(content);
      setContent(prev => 
        `<p><em>[Contenido reescrito por IA - ${new Date().toLocaleString()}]</em></p>\n${prev}`
      );
      setValue('status', 'rewritten');
    }
  };

  const restoreOriginal = () => {
    if (originalContent) {
      const confirm = window.confirm(
        '¿Restaurar el contenido original?\n\n' +
        'Esto reemplazará el contenido actual.'
      );
      if (confirm) {
        setContent(originalContent);
      }
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Cargando artículo...</p>
        </div>
      </div>
    );
  }

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
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-gray-900">
                  Editar Noticia
                </h1>
                <Badge className={getStatusColor(article.status)}>
                  {getStatusLabel(article.status)}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                {readingTime} min de lectura • ID: {article.id}
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
                    error={errors.title?.message}
                    {...register('title', { required: 'Requerido' })}
                  />

                  <Textarea
                    label="Bajada"
                    rows={3}
                    {...register('subtitle')}
                  />

                  <Input
                    label="Slug"
                    {...register('slug')}
                  />
                </CardContent>
              </Card>

              {/* Original Content Toggle (for scraped/rewritten) */}
              {originalContent && (
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-yellow-800 font-medium text-sm">
                        Contenido Original Disponible
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowOriginal(!showOriginal)}
                        >
                          {showOriginal ? 'Ocultar' : 'Ver Original'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={restoreOriginal}
                        >
                          Restaurar
                        </Button>
                      </div>
                    </div>
                    
                    {showOriginal && (
                      <div 
                        className="bg-white rounded-md p-4 mt-2 max-h-60 overflow-y-auto text-sm article-content"
                        dangerouslySetInnerHTML={{ __html: originalContent }}
                      />
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Content Editor */}
              <Card>
                <CardHeader>
                  <h2 className="font-semibold text-gray-900">
                    {showOriginal ? 'Contenido Editado' : 'Contenido'}
                  </h2>
                </CardHeader>
                <CardContent className="p-0">
                  {showPreview ? (
                    <div 
                      className="article-content p-6"
                      dangerouslySetInnerHTML={{ __html: content }}
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
                  <h2 className="font-semibold text-gray-900">Imagen</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="URL de imagen"
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

              {/* Source */}
              {article.source && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Globe size={18} className="text-gray-400" />
                      <h2 className="font-semibold text-gray-900">Fuente</h2>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <a 
                      href={article.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm break-all"
                    >
                      {article.source}
                    </a>
                    {article.scrapedAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        Scrapeado: {new Date(article.scrapedAt).toLocaleString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* SEO */}
              <Card>
                <CardHeader>
                  <h2 className="font-semibold text-gray-900">SEO</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Meta Título"
                    {...register('metaTitle')}
                  />
                  <Textarea
                    label="Meta Descripción"
                    rows={3}
                    {...register('metaDescription')}
                  />
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-red-200">
                <CardHeader>
                  <h2 className="font-semibold text-red-600">Zona de Peligro</h2>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="danger"
                    className="w-full"
                    onClick={() => {
                      if (confirm('¿Eliminar esta noticia?')) {
                        router.push('/dashboard');
                      }
                    }}
                  >
                    <Trash2 size={18} className="mr-2" />
                    Eliminar Noticia
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
