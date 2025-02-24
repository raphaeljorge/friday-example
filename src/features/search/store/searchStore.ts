import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SearchBooksParams, SearchHistoryItem } from '@/features/books/types';

interface SearchStore {
  history: SearchHistoryItem[];
  addToHistory: (query: SearchBooksParams, resultCount: number) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      history: [],
      addToHistory: (query, resultCount) => set((state) => ({
        history: [
          {
            id: crypto.randomUUID(),
            query,
            timestamp: new Date().toISOString(),
            resultCount,
          },
          ...state.history.slice(0, 9), // Keep only last 10 searches
        ],
      })),
      clearHistory: () => set({ history: [] }),
      removeFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),
    }),
    {
      name: 'search-history',
    }
  )
);