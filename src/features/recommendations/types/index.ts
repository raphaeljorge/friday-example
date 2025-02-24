import type { Book } from '@/features/books/types';

export type RecommendationSource = 
  | 'reading-history'
  | 'favorite-genres'
  | 'similar-books'
  | 'popular'
  | 'trending'
  | 'new-releases';

export type RecommendationReason =
  | 'based-on-history'
  | 'similar-genre'
  | 'similar-author'
  | 'popular-in-category'
  | 'trending-now'
  | 'new-in-category';

export interface Recommendation {
  id: string;
  book: Book;
  source: RecommendationSource;
  reason: RecommendationReason;
  score: number; // 0-1 relevance score
  timestamp: string;
}

export interface RecommendationGroup {
  source: RecommendationSource;
  title: string;
  description: string;
  recommendations: Recommendation[];
}

export interface RecommendationsResponse {
  data: RecommendationGroup[];
}

export interface RecommendationPreferences {
  enabledSources: RecommendationSource[];
  minScore: number; // Minimum relevance score (0-1)
  maxRecommendations: number; // Maximum recommendations per group
  excludedCategories: string[];
  excludedAuthors: string[];
}

export interface RecommendationPreferencesResponse {
  data: RecommendationPreferences;
}

export interface UpdateRecommendationPreferencesRequest {
  enabledSources?: RecommendationSource[];
  minScore?: number;
  maxRecommendations?: number;
  excludedCategories?: string[];
  excludedAuthors?: string[];
}

export interface SimilarBooksResponse {
  data: Recommendation[];
}

export interface DismissRecommendationRequest {
  reason:
    | 'not-interested'
    | 'already-read'
    | 'wrong-genre'
    | 'wrong-author'
    | 'inappropriate'
    | 'other';
  note?: string;
}