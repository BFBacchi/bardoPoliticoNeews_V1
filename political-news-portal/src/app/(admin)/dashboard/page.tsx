'use client';

/**
 * DASHBOARD - Panel Principal del Backoffice
 * 
 * Muestra:
 * - Estadísticas generales
 * - Listado de noticias con filtros
 * - Estados: Scrapeada, Reescrita, Borrador, Publicada
 * - Acciones rápidas
 * 
 * INTEGRACIÓN N8N:
 * Las noticias con estado "scraped" vienen del flujo de scraping.
 * Las noticias con estado "rewritten" fueron procesadas por IA.
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Filter,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getAllArticles, categories } from '@/lib/mock-data';
import { 
  formatDateTime, 
  getStatusLabel, 
  getStatusColor, 
  getCategoryLabel 
} from '@/lib/utils';
import { useDashboardStore } from '@/lib/store';
import { ArticleStatus } from '@/types';

// Stats cards data
const statsCards = [
  { 
    label: 'Total Noticias', 
    value: '8', 
    icon: FileText, 
    color: 'bg-blue-500',
    trend: '+12% este mes'
  },
  { 
    label: 'Publicadas', 
    value: '5', 
    icon: CheckCircle, 
    color: 'bg-green-500',
    trend: '+3 esta semana'
  },
  { 
    label: 'Pendientes', 
    value: '2', 
    icon: Clock, 
    color: 'bg-yellow-500',
    trend: 'Requieren revisión'
  },
  { 
    label: 'Scrapeadas', 
    value: '1', 
    icon: AlertCircle, 
    color: 'bg-purple-500',
    trend: 'Nuevas de n8n'
  },
];

const statusOptions = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'published', label: 'Publicadas' },
  { value: 'draft', label: 'Borradores' },
  { value: 'scraped', label: 'Scrapeadas' },
  { value: 'rewritten', label: 'Reescritas' },
  { value: 'archived', label: 'Archivadas' },
];

const categoryOptions = [
  { value: 'all', label: 'Todas las categorías' },
  ...categories.map(c => ({ value: c.value, label: c.label })),
];

export default function DashboardPage() {
  const articles = getAllArticles();
  const { 
    searchQuery, 
    statusFilter, 
    categoryFilter,
    setSearchQuery,
    setStatusFilter,
    setCategoryFilter,
    resetFilters
  } = useDashboardStore();

  // Filtrar artículos
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      // Filtro de búsqueda
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = article.title.toLowerCase().includes(query);
        const matchesContent = article.content.toLowerCase().includes(query);
        if (!matchesTitle && !matchesContent) return false;
      }

      // Filtro de estado
      if (statusFilter !== 'all' && article.status !== statusFilter) {
        return false;
      }

      // Filtro de categoría
      if (categoryFilter !== 'all' && article.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [articles, searchQuery, statusFilter, categoryFilter]);

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Gestión de contenidos del portal
          </p>
        </div>
        <Link href="/editor">
          <Button className="mt-4 md:mt-0">
            <Plus size={18} className="mr-2" />
            Nueva Noticia
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((stat) => (
          <Card key={stat.label} hover>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.trend}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Section */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar noticias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Status Filter */}
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-48"
            />

            {/* Category Filter */}
            <Select
              options={categoryOptions}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full md:w-48"
            />

            {/* Reset */}
            {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all') && (
              <Button variant="outline" onClick={resetFilters}>
                Limpiar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">
              Noticias ({filteredArticles.length})
            </h2>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fuente
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {article.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Por {article.author.name}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">
                      {getCategoryLabel(article.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={getStatusColor(article.status)}>
                      {getStatusLabel(article.status)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">
                      {formatDateTime(article.publishedAt)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {article.source ? (
                      <a 
                        href={article.source} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline truncate block max-w-[150px]"
                      >
                        Ver fuente
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">Original</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/noticias/${article.slug}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Ver"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/editor/${article.id}`}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">No se encontraron noticias</p>
              <Button variant="outline" onClick={resetFilters} className="mt-4">
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* N8N Integration Notice */}
      <Card className="mt-6 bg-purple-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-purple-900 mb-1">
                Integración con n8n + IA
              </h3>
              <p className="text-purple-700 text-sm mb-2">
                Este dashboard está preparado para recibir noticias scrapeadas automáticamente.
                Las noticias marcadas como Scrapeada vienen del flujo de n8n.
              </p>
              <p className="text-purple-600 text-xs">
                Ver documentación en /docs para configurar el flujo de automatización.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
