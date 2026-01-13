/**
 * ZUSTAND STORE - Estado Global de la Aplicación
 * 
 * Maneja:
 * - Estado del editor
 * - Configuración de placas
 * 
 * NOTA: La autenticación ahora se maneja directamente con Supabase Auth
 * usando hooks y el cliente de Supabase.
 */

import { create } from 'zustand';
import { Article, PlacaConfig, PlacaFormat } from '@/types';

// Store del editor de noticias
interface EditorStore {
  currentArticle: Partial<Article> | null;
  isDirty: boolean;
  setCurrentArticle: (article: Partial<Article> | null) => void;
  updateArticle: (updates: Partial<Article>) => void;
  resetEditor: () => void;
  markClean: () => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  currentArticle: null,
  isDirty: false,

  setCurrentArticle: (article) => set({ currentArticle: article, isDirty: false }),
  
  updateArticle: (updates) => set((state) => ({
    currentArticle: state.currentArticle 
      ? { ...state.currentArticle, ...updates }
      : updates,
    isDirty: true,
  })),

  resetEditor: () => set({ currentArticle: null, isDirty: false }),
  
  markClean: () => set({ isDirty: false }),
}));

// Store para el generador de placas
interface PlacaStore {
  config: PlacaConfig;
  selectedArticle: Article | null;
  setSelectedArticle: (article: Article | null) => void;
  updateConfig: (updates: Partial<PlacaConfig>) => void;
  setFormat: (format: PlacaFormat) => void;
  resetConfig: () => void;
}

const defaultPlacaConfig: PlacaConfig = {
  articleId: '',
  format: 'instagram-reel',
  title: '',
  subtitle: '',
  backgroundColor: '#1a1a2e',
  textColor: '#ffffff',
  accentColor: '#e94560',
  fontFamily: 'playfair',
  showLogo: true,
  showSource: false,
  overlayOpacity: 0.6,
};

export const usePlacaStore = create<PlacaStore>((set) => ({
  config: defaultPlacaConfig,
  selectedArticle: null,

  setSelectedArticle: (article) => set((state) => ({
    selectedArticle: article,
    config: article 
      ? {
          ...state.config,
          articleId: article.id,
          title: article.title,
          subtitle: article.subtitle,
          backgroundImage: article.featuredImage,
        }
      : state.config,
  })),

  updateConfig: (updates) => set((state) => ({
    config: { ...state.config, ...updates },
  })),

  setFormat: (format) => set((state) => ({
    config: { ...state.config, format },
  })),

  resetConfig: () => set({ config: defaultPlacaConfig, selectedArticle: null }),
}));

// Store para filtros y búsqueda en dashboard
interface DashboardStore {
  searchQuery: string;
  statusFilter: string;
  categoryFilter: string;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setCategoryFilter: (category: string) => void;
  resetFilters: () => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  searchQuery: '',
  statusFilter: 'all',
  categoryFilter: 'all',

  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  resetFilters: () => set({ searchQuery: '', statusFilter: 'all', categoryFilter: 'all' }),
}));
