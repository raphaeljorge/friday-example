export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  coverImage: string;
  description: string;
  publishedDate: string;
  publisher: string;
  categories: string[];
  tags: string[];
  status: BookStatus;
  copies: {
    total: number;
    available: number;
  };
  rating?: number;
}

export interface BookResponse {
  data: Book;
}

export interface BooksResponse {
  data: Book[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export type BookStatus = 'available' | 'reserved' | 'borrowed';

export type SortField = 'title' | 'author' | 'publishedDate' | 'rating';
export type SortOrder = 'asc' | 'desc';

export interface DateRange {
  from?: string;
  to?: string;
}

export interface SearchBooksParams {
  q?: string;
  category?: string;
  status?: BookStatus;
  tags?: string[];
  publishedDate?: DateRange;
  rating?: number;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

export interface SearchBooksResponse {
  data: Book[];
  meta: {
    total: number;
  };
}

export interface CategoriesResponse {
  data: string[];
}

export interface TagsResponse {
  data: string[];
}

export interface SearchHistoryItem {
  id: string;
  query: SearchBooksParams;
  timestamp: string;
  resultCount: number;
}