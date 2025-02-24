import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getRecommendations,
  getSimilarBooks,
  getRecommendationPreferences,
  updateRecommendationPreferences,
  dismissRecommendation,
  refreshRecommendations,
  getTrendingBooks,
  getNewReleases,
  getPopularInCategory,
} from '../api/recommendations';
import type { DismissRecommendationRequest } from '../types';

const recommendationKeys = {
  all: ['recommendations'] as const,
  lists: () => [...recommendationKeys.all, 'list'] as const,
  similar: () => [...recommendationKeys.all, 'similar'] as const,
  similarBooks: (bookId: string) => [...recommendationKeys.similar(), bookId] as const,
  preferences: () => [...recommendationKeys.all, 'preferences'] as const,
  trending: () => [...recommendationKeys.all, 'trending'] as const,
  newReleases: () => [...recommendationKeys.all, 'new-releases'] as const,
  popular: () => [...recommendationKeys.all, 'popular'] as const,
  popularInCategory: (category: string) =>
    [...recommendationKeys.popular(), category] as const,
};

export function useRecommendations() {
  return useQuery({
    queryKey: recommendationKeys.lists(),
    queryFn: getRecommendations,
  });
}

export function useSimilarBooks(bookId: string) {
  return useQuery({
    queryKey: recommendationKeys.similarBooks(bookId),
    queryFn: () => getSimilarBooks(bookId),
  });
}

export function useRecommendationPreferences() {
  return useQuery({
    queryKey: recommendationKeys.preferences(),
    queryFn: getRecommendationPreferences,
  });
}

export function useUpdateRecommendationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRecommendationPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recommendationKeys.preferences() });
      queryClient.invalidateQueries({ queryKey: recommendationKeys.lists() });
    },
  });
}

export function useDismissRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recommendationId,
      request,
    }: {
      recommendationId: string;
      request: DismissRecommendationRequest;
    }) => dismissRecommendation(recommendationId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recommendationKeys.lists() });
    },
  });
}

export function useRefreshRecommendations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshRecommendations,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recommendationKeys.lists() });
    },
  });
}

export function useTrendingBooks() {
  return useQuery({
    queryKey: recommendationKeys.trending(),
    queryFn: getTrendingBooks,
  });
}

export function useNewReleases() {
  return useQuery({
    queryKey: recommendationKeys.newReleases(),
    queryFn: getNewReleases,
  });
}

export function usePopularInCategory(category: string) {
  return useQuery({
    queryKey: recommendationKeys.popularInCategory(category),
    queryFn: () => getPopularInCategory(category),
  });
}