import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getReadingHistory,
  getReadingHistoryEntry,
  createReadingHistoryEntry,
  updateReadingHistoryEntry,
  deleteReadingHistoryEntry,
  getReadingStats,
  updateReadingProgress,
  addReview,
  updateTags,
} from '../api/history';
import type { UpdateReadingHistoryRequest } from '../types';

const historyKeys = {
  all: ['reading-history'] as const,
  lists: () => [...historyKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...historyKeys.lists(), filters] as const,
  details: () => [...historyKeys.all, 'detail'] as const,
  detail: (id: string) => [...historyKeys.details(), id] as const,
  stats: () => [...historyKeys.all, 'stats'] as const,
};

export function useReadingHistory() {
  return useQuery({
    queryKey: historyKeys.lists(),
    queryFn: getReadingHistory,
  });
}

export function useReadingHistoryEntry(id: string) {
  return useQuery({
    queryKey: historyKeys.detail(id),
    queryFn: () => getReadingHistoryEntry(id),
  });
}

export function useCreateReadingHistoryEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReadingHistoryEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: historyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: historyKeys.stats() });
    },
  });
}

export function useUpdateReadingHistoryEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: { id: string } & UpdateReadingHistoryRequest) =>
      updateReadingHistoryEntry(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: historyKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: historyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: historyKeys.stats() });
    },
  });
}

export function useDeleteReadingHistoryEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReadingHistoryEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: historyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: historyKeys.stats() });
    },
  });
}

export function useReadingStats() {
  return useQuery({
    queryKey: historyKeys.stats(),
    queryFn: getReadingStats,
  });
}

export function useUpdateReadingProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      progress,
    }: { id: string; progress: { currentPage: number; notes?: string } }) =>
      updateReadingProgress(id, progress),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: historyKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: historyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: historyKeys.stats() });
    },
  });
}

export function useAddReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      review,
    }: {
      id: string;
      review: { rating: number; review: string };
    }) => addReview(id, review),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: historyKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: historyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: historyKeys.stats() });
    },
  });
}

export function useUpdateTags() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, tags }: { id: string; tags: string[] }) =>
      updateTags(id, tags),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: historyKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: historyKeys.lists() });
    },
  });
}
