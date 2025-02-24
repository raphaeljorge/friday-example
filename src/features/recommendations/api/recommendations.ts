import { apiClient } from '@/lib/api/client';
import type {
  RecommendationsResponse,
  RecommendationPreferencesResponse,
  UpdateRecommendationPreferencesRequest,
  SimilarBooksResponse,
  DismissRecommendationRequest,
} from '../types';

export async function getRecommendations(): Promise<RecommendationsResponse> {
  const response = await apiClient.get<RecommendationsResponse>('/recommendations');
  return response.data;
}

export async function getSimilarBooks(bookId: string): Promise<SimilarBooksResponse> {
  const response = await apiClient.get<SimilarBooksResponse>(`/books/${bookId}/similar`);
  return response.data;
}

export async function getRecommendationPreferences(): Promise<RecommendationPreferencesResponse> {
  const response = await apiClient.get<RecommendationPreferencesResponse>(
    '/recommendations/preferences'
  );
  return response.data;
}

export async function updateRecommendationPreferences(
  preferences: UpdateRecommendationPreferencesRequest
): Promise<RecommendationPreferencesResponse> {
  const response = await apiClient.put<RecommendationPreferencesResponse>(
    '/recommendations/preferences',
    preferences
  );
  return response.data;
}

export async function dismissRecommendation(
  recommendationId: string,
  request: DismissRecommendationRequest
): Promise<void> {
  await apiClient.post(`/recommendations/${recommendationId}/dismiss`, request);
}

export async function refreshRecommendations(): Promise<RecommendationsResponse> {
  const response = await apiClient.post<RecommendationsResponse>('/recommendations/refresh');
  return response.data;
}

export async function getTrendingBooks(): Promise<SimilarBooksResponse> {
  const response = await apiClient.get<SimilarBooksResponse>('/recommendations/trending');
  return response.data;
}

export async function getNewReleases(): Promise<SimilarBooksResponse> {
  const response = await apiClient.get<SimilarBooksResponse>('/recommendations/new-releases');
  return response.data;
}

export async function getPopularInCategory(category: string): Promise<SimilarBooksResponse> {
  const response = await apiClient.get<SimilarBooksResponse>(
    `/recommendations/popular/${encodeURIComponent(category)}`
  );
  return response.data;
}