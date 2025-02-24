import type { Book } from '@/features/books/types';

export type ShelfBookStatus = 'want-to-read' | 'reading' | 'completed';

export interface ShelfBook {
  book: Book;
  addedAt: string;
  notes?: string;
  status: ShelfBookStatus;
}

export interface Shelf {
  id: string;
  name: string;
  description?: string;
  books: ShelfBook[];
  createdAt: string;
  updatedAt: string;
}

export interface ShelfResponse {
  data: Shelf[];
}

export interface SingleShelfResponse {
  data: Shelf;
}