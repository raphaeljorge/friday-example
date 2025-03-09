import { apiClient } from '@/lib/api/client';
import type {
  ReadingHistoryResponse,
  ReadingHistoryEntryResponse,
  CreateReadingHistoryRequest,
  UpdateReadingHistoryRequest,
  ReadingStatsResponse,
} from '../types';

export async function getReadingHistory(): Promise<ReadingHistoryResponse> {
  const response =
    await apiClient.get<ReadingHistoryResponse>('/reading-history');
  return response.data;
}

export async function getReadingHistoryEntry(
  id: string
): Promise<ReadingHistoryEntryResponse> {
  const response = await apiClient.get<ReadingHistoryEntryResponse>(
    `/reading-history/${id}`
  );
  return response.data;
}

export async function createReadingHistoryEntry(
  request: CreateReadingHistoryRequest
): Promise<ReadingHistoryEntryResponse> {
  const response = await apiClient.post<ReadingHistoryEntryResponse>(
    '/reading-history',
    request
  );
  return response.data;
}

export async function updateReadingHistoryEntry(
  id: string,
  request: UpdateReadingHistoryRequest
): Promise<ReadingHistoryEntryResponse> {
  const response = await apiClient.put<ReadingHistoryEntryResponse>(
    `/reading-history/${id}`,
    request
  );
  return response.data;
}

export async function deleteReadingHistoryEntry(id: string): Promise<void> {
  await apiClient.delete(`/reading-history/${id}`);
}

export async function getReadingStats(): Promise<ReadingStatsResponse> {
  const response = await apiClient.get<ReadingStatsResponse>(
    '/reading-history/stats'
  );
  return response.data;
}

export async function updateReadingProgress(
  id: string,
  progress: { currentPage: number; notes?: string }
): Promise<ReadingHistoryEntryResponse> {
  const response = await apiClient.put<ReadingHistoryEntryResponse>(
    `/reading-history/${id}/progress`,
    progress
  );
  return response.data;
}

export async function addReview(
  id: string,
  review: { rating: number; review: string }
): Promise<ReadingHistoryEntryResponse> {
  const response = await apiClient.put<ReadingHistoryEntryResponse>(
    `/reading-history/${id}/review`,
    review
  );
  return response.data;
}

export async function updateTags(
  id: string,
  tags: string[]
): Promise<ReadingHistoryEntryResponse> {
  const response = await apiClient.put<ReadingHistoryEntryResponse>(
    `/reading-history/${id}/tags`,
    { tags }
  );
  return response.data;
}
