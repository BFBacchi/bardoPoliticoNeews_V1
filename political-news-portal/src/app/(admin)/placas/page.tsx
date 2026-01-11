'use client';

/**
 * GENERADOR DE PLACAS PARA REDES SOCIALES
 * 
 * Crea contenido visual para:
 * - Instagram Reels (9:16)
 * - YouTube Shorts (9:16)
 * - Instagram Stories (9:16)
 * - Twitter Cards (16:9)
 * - Facebook Posts (1.91:1)
 * 
 * Características:
 * - Selección de noticia
 * - Editor visual en tiempo real
 * - Múltiples formatos
 * - Exportación a imagen
 */

import { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { 
  Download, 
  RefreshCw, 
  Type, 
  Palette, 
  Image as ImageIcon,
  Smartphone,
  Monitor,
  Square
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getPublishedArticles } from '@/lib/mock-data';
import { usePlacaStore } from '@/lib/store';
import { getPlacaDimensions, truncateText } from '@/lib/utils';
import { PlacaFormat, Article } from '@/types';

const formatOptions = [
  { value: 'instagram-reel', label: 'Instagram Reel (9:16)' },
  { value: 'instagram-story', label: 'Instagram Story (9:16)' },
  { value: 'youtube-short', label: 'YouTube Short (9:16)' },
  { value: 'instagram-square', label: 'Instagram Cuadrado (1:1)' },
  { value: 'twitter-card', label: 'Twitter Card (16:9)' },
  { value: 'facebook-post', label: 'Facebook Post (1.91:1)' },
];

const colorPresets = [
  { bg: '#1a1a2e', text: '#ffffff', accent: '#e94560', name: 'Oscuro Rojo' },
  { bg: '#0f0e17', text: '#fffffe', accent: '#ff8906', name: 'Oscuro Naranja' },
  { bg: '#232946', text: '#fffffe', accent: '#eebbc3', name: 'Oscuro Rosa' },
  { bg: '#fef6e4', text: '#001858', accent: '#f582ae', name: 'Claro Rosa' },
  { bg: '#fffffe', text: '#094067', accent: '#3da9fc', name: 'Claro Azul' },
  { bg: '#d4d8f0', text: '#232946', accent: '#b8c1ec', name: 'Lavanda' },
];

export default function PlacasPage() {
  const placaRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const articles = getPublishedArticles();
  
  const { 
    config, 
    selectedArticle,
    setSelectedArticle,
    updateConfig, 
    setFormat,
    resetConfig 
  } = usePlacaStore();

  const dimensions = getPlacaDimensions(config.format);
  
  // Calcular escala para preview
  const getPreviewScale = () => {
    const maxHeight = 500;
    const maxWidth = 400;
    const { width, height } = dimensions;
    
    const scaleH = maxHeight / height;
    const scaleW = maxWidth / width;
    return Math.min(scaleH, scaleW, 0.4);
  };

  const scale = getPreviewScale();

  const handleArticleSelect = (articleId: string) => {
    const article = articles.find(a => a.id === articleId);
    setSelectedArticle(article || null);
  };

  const handleExport = useCallback(async () => {
    if (!placaRef.current) return;
    
    setIsExporting(true);
    
    try {
      // Crear copia para exportar a tamaño completo
      const element = placaRef.current;
      
      const dataUrl = await toPng(element, {
        width: dimensions.width * scale,
        height: dimensions.height * scale,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
        pixelRatio: 1 / scale, // Compensar la escala
      });
      
      // Descargar imagen
      const link = document.createElement('a');
      link.download = `placa-${config.format}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error exportando:', error);
      alert('Error al exportar la imagen. Intentá nuevamente.');
    } finally {
      setIsExporting(false);
    }
  }, [config.format, dimensions, scale]);

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    updateConfig({
      backgroundColor: preset.bg,
      textColor: preset.text,
      accentColor: preset.accent,
    });
  };

  return (
    <div className="p-6 lg:p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Generador de Placas</h1>
          <p className="text-gray-600 mt-1">
            Creá contenido visual para redes sociales
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={resetConfig}>
            <RefreshCw size={18} className="mr-2" />
            Reiniciar
          </Button>
          <Button onClick={handleExport} isLoading={isExporting}>
            <Download size={18} className="mr-2" />
            Exportar PNG
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview Panel */}
        <div className="order-2 lg:order-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Vista Previa</h2>
                <span className="text-sm text-gray-500">
                  {dimensions.width} × {dimensions.height}px
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-8 bg-gray-100 min-h-[600px]">
              {/* Placa Preview */}
              <div 
                ref={placaRef}
                className="placa-preview relative overflow-hidden shadow-2xl"
                style={{
                  width: dimensions.width * scale,
                  height: dimensions.height * scale,
                  backgroundColor: config.backgroundColor,
                }}
              >
                {/* Background Image */}
                {config.backgroundImage && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${config.backgroundImage})` }}
                  >
                    <div 
                      className="absolute inset-0"
                      style={{ 
                        backgroundColor: config.backgroundColor,
                        opacity: config.overlayOpacity,
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-6 z-10">
                  {/* Logo */}
                  {config.showLogo && (
                    <div 
                      className="absolute top-4 left-4 px-3 py-1.5 rounded"
                      style={{ backgroundColor: config.accentColor }}
                    >
                      <span 
                        className="font-bold text-sm"
                        style={{ 
                          color: config.backgroundColor,
                          fontFamily: config.fontFamily === 'playfair' 
                            ? 'var(--font-playfair)' 
                            : 'var(--font-inter)' 
                        }}
                      >
                        PolíticaHoy
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h2 
                    className="font-bold leading-tight mb-3"
                    style={{ 
                      color: config.textColor,
                      fontSize: config.format.includes('square') ? '1.5rem' : '1.75rem',
                      fontFamily: config.fontFamily === 'playfair' 
                        ? 'var(--font-playfair)' 
                        : 'var(--font-inter)',
                    }}
                  >
                    {truncateText(config.title || 'Título de la noticia', 100)}
                  </h2>

                  {/* Subtitle */}
                  {config.subtitle && (
                    <p 
                      className="text-sm opacity-90 mb-4"
                      style={{ color: config.textColor }}
                    >
                      {truncateText(config.subtitle, 80)}
                    </p>
                  )}

                  {/* Accent Line */}
                  <div 
                    className="w-16 h-1 rounded-full"
                    style={{ backgroundColor: config.accentColor }}
                  />

                  {/* Source */}
                  {config.showSource && selectedArticle?.source && (
                    <p 
                      className="text-xs mt-4 opacity-60"
                      style={{ color: config.textColor }}
                    >
                      Fuente: {new URL(selectedArticle.source).hostname}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls Panel */}
        <div className="order-1 lg:order-2 space-y-6">
          {/* Select Article */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-gray-900">Seleccionar Noticia</h2>
            </CardHeader>
            <CardContent>
              <Select
                options={[
                  { value: '', label: 'Seleccionar noticia...' },
                  ...articles.map(a => ({ value: a.id, label: truncateText(a.title, 60) })),
                ]}
                value={selectedArticle?.id || ''}
                onChange={(e) => handleArticleSelect(e.target.value)}
              />
              
              {selectedArticle && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    Categoría: <strong>{selectedArticle.category}</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    Autor: <strong>{selectedArticle.author.name}</strong>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Format */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Monitor size={18} className="text-gray-400" />
                <h2 className="font-semibold text-gray-900">Formato</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {formatOptions.map((format) => (
                  <button
                    key={format.value}
                    onClick={() => setFormat(format.value as PlacaFormat)}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      config.format === format.value
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm font-medium">{format.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Text */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Type size={18} className="text-gray-400" />
                <h2 className="font-semibold text-gray-900">Texto</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                label="Título"
                value={config.title}
                onChange={(e) => updateConfig({ title: e.target.value })}
                rows={2}
              />
              
              <Input
                label="Subtítulo (opcional)"
                value={config.subtitle || ''}
                onChange={(e) => updateConfig({ subtitle: e.target.value })}
              />

              <Select
                label="Tipografía"
                options={[
                  { value: 'playfair', label: 'Playfair (Serif)' },
                  { value: 'inter', label: 'Inter (Sans)' },
                ]}
                value={config.fontFamily}
                onChange={(e) => updateConfig({ fontFamily: e.target.value as 'playfair' | 'inter' })}
              />
            </CardContent>
          </Card>

          {/* Colors */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette size={18} className="text-gray-400" />
                <h2 className="font-semibold text-gray-900">Colores</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Presets */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Presets</p>
                <div className="flex flex-wrap gap-2">
                  {colorPresets.map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => applyColorPreset(preset)}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: preset.bg }}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Fondo</label>
                  <input
                    type="color"
                    value={config.backgroundColor}
                    onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Texto</label>
                  <input
                    type="color"
                    value={config.textColor}
                    onChange={(e) => updateConfig({ textColor: e.target.value })}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Acento</label>
                  <input
                    type="color"
                    value={config.accentColor}
                    onChange={(e) => updateConfig({ accentColor: e.target.value })}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Background Image */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ImageIcon size={18} className="text-gray-400" />
                <h2 className="font-semibold text-gray-900">Imagen de Fondo</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="URL de Imagen"
                value={config.backgroundImage || ''}
                onChange={(e) => updateConfig({ backgroundImage: e.target.value })}
                placeholder="https://..."
              />
              
              {config.backgroundImage && (
                <>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Opacidad del overlay: {Math.round(config.overlayOpacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={config.overlayOpacity}
                      onChange={(e) => updateConfig({ overlayOpacity: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateConfig({ backgroundImage: '' })}
                  >
                    Quitar imagen
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-gray-900">Opciones</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showLogo}
                  onChange={(e) => updateConfig({ showLogo: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded"
                />
                <span className="text-sm">Mostrar logo</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showSource}
                  onChange={(e) => updateConfig({ showSource: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded"
                />
                <span className="text-sm">Mostrar fuente</span>
              </label>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
