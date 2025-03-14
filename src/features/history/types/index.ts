import type { Book } from '@/features/books/types';

export type ReadingStatus = 'completed' | 'in-progress' | 'abandoned';

export interface ReadingProgress {
  currentPage: number;
  totalPages: number;
  lastReadAt: string;
  notes?: string;
}

export interface ReadingHistoryEntry {
  id: string;
  book: Book;
  startDate: string;
  endDate?: string;
  status: ReadingStatus;
  progress: ReadingProgress;
  rating?: number;
  review?: string;
  tags: string[];
}

export interface ReadingHistoryResponse {
  data: ReadingHistoryEntry[];
  meta: {
    total: number;
    completed: number;
    inProgress: number;
    abandoned: number;
  };
}

export interface ReadingHistoryEntryResponse {
  data: ReadingHistoryEntry;
}

export interface CreateReadingHistoryRequest {
  bookId: string;
  startDate: string;
  status: ReadingStatus;
  progress: {
    currentPage: number;
    totalPages: number;
    notes?: string;
  };
  tags?: string[];
}

export interface UpdateReadingHistoryRequest {
  endDate?: string;
  status?: ReadingStatus;
  progress?: {
    currentPage: number;
    notes?: string;
  };
  rating?: number;
  review?: string;
  tags?: string[];
}

export interface ReadingStats {
  totalBooksRead: number;
  booksThisYear: number;
  booksThisMonth: number;
  averageRating: number;
  pagesRead: number;
  readingStreak: number;
  favoriteGenres: Array<{
    name: string;
    count: number;
  }>;
  readingByMonth: Array<{
    month: string;
    count: number;
  }>;
}

export interface ReadingStatsResponse {
  data: ReadingStats;
}
