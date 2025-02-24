import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RecommendationSource } from '../types';

interface DismissedRecommendation {
  id: string;
  timestamp: string;
  reason: string;
  note?: string;
}

interface PreferencesStore {
  // User preferences
  enabledSources: RecommendationSource[];
  minScore: number;
  maxRecommendations: number;
  excludedCategories: string[];
  excludedAuthors: string[];
  
  // Dismissed recommendations history
  dismissedRecommendations: DismissedRecommendation[];

  // Actions
  toggleSource: (source: RecommendationSource) => void;
  setMinScore: (score: number) => void;
  setMaxRecommendations: (max: number) => void;
  addExcludedCategory: (category: string) => void;
  removeExcludedCategory: (category: string) => void;
  addExcludedAuthor: (author: string) => void;
  removeExcludedAuthor: (author: string) => void;
  addDismissedRecommendation: (
    id: string,
    reason: string,
    note?: string
  ) => void;
  clearDismissedRecommendations: () => void;
  resetPreferences: () => void;
}

const DEFAULT_PREFERENCES = {
  enabledSources: [
    'reading-history',
    'favorite-genres',
    'similar-books',
    'popular',
    'trending',
    'new-releases',
  ] as RecommendationSource[],
  minScore: 0.5,
  maxRecommendations: 10,
  excludedCategories: [],
  excludedAuthors: [],
  dismissedRecommendations: [],
};

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      ...DEFAULT_PREFERENCES,

      toggleSource: (source) =>
        set((state) => ({
          enabledSources: state.enabledSources.includes(source)
            ? state.enabledSources.filter((s) => s !== source)
            : [...state.enabledSources, source],
        })),

      setMinScore: (score) =>
        set({
          minScore: Math.max(0, Math.min(1, score)),
        }),

      setMaxRecommendations: (max) =>
        set({
          maxRecommendations: Math.max(1, max),
        }),

      addExcludedCategory: (category) =>
        set((state) => ({
          excludedCategories: state.excludedCategories.includes(category)
            ? state.excludedCategories
            : [...state.excludedCategories, category],
        })),

      removeExcludedCategory: (category) =>
        set((state) => ({
          excludedCategories: state.excludedCategories.filter((c) => c !== category),
        })),

      addExcludedAuthor: (author) =>
        set((state) => ({
          excludedAuthors: state.excludedAuthors.includes(author)
            ? state.excludedAuthors
            : [...state.excludedAuthors, author],
        })),

      removeExcludedAuthor: (author) =>
        set((state) => ({
          excludedAuthors: state.excludedAuthors.filter((a) => a !== author),
        })),

      addDismissedRecommendation: (id, reason, note) =>
        set((state) => ({
          dismissedRecommendations: [
            {
              id,
              reason,
              note,
              timestamp: new Date().toISOString(),
            },
            ...state.dismissedRecommendations.slice(0, 99), // Keep last 100 dismissals
          ],
        })),

      clearDismissedRecommendations: () =>
        set({
          dismissedRecommendations: [],
        }),

      resetPreferences: () =>
        set({
          ...DEFAULT_PREFERENCES,
          dismissedRecommendations: [], // Clear history on reset
        }),
    }),
    {
      name: 'recommendation-preferences',
    }
  )
);