/** @vitest-environment jsdom */
import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReadingHistoryContainer } from './ReadingHistoryContainer';
import { useReadingHistory, useReadingStats } from '../../hooks/useHistory';
import { renderWithProviders } from '@/test/utils';
import { describe, expect, it, vi } from 'vitest';
import type { ReadingHistoryResponse, ReadingStatsResponse } from '../../types';
import type { Book } from '@/features/books/types';
import type { UseQueryResult } from '@tanstack/react-query';

vi.mock('../../hooks/useHistory', () => ({
  useReadingHistory: vi.fn(),
  useReadingStats: vi.fn(),
  useUpdateReadingProgress: vi.fn().mockReturnValue({ mutate: vi.fn() }),
  useAddReview: vi.fn().mockReturnValue({ mutate: vi.fn() }),
  useUpdateTags: vi.fn().mockReturnValue({ mutate: vi.fn() }),
  useDeleteReadingHistoryEntry: vi.fn().mockReturnValue({ mutate: vi.fn() }),
}));

const mockBook: Book = {
  id: '1',
  title: 'Test Book',
  author: 'Test Author',
  isbn: '1234567890',
  coverImage: 'test.jpg',
  description: 'Test description',
  publishedDate: '2024-01-01',
  publisher: 'Test Publisher',
  categories: ['Fiction'],
  tags: ['fantasy'],
  status: 'available',
  copies: {
    total: 1,
    available: 1,
  },
};

const createSuccessQueryResult = <T,>(data: T) => ({
  data,
  dataUpdatedAt: 0,
  error: null,
  errorUpdateCount: 0,
  errorUpdatedAt: 0,
  failureCount: 0,
  failureReason: null,
  isError: false as const,
  isFetched: true as const,
  isFetchedAfterMount: true as const,
  isFetching: false as const,
  isInitialLoading: false as const,
  isLoading: false as const,
  isLoadingError: false as const,
  isPaused: false as const,
  isPending: false as const,
  isPlaceholderData: false as const,
  isRefetchError: false as const,
  isRefetching: false as const,
  isStale: false as const,
  isSuccess: true as const,
  refetch: vi.fn(),
  status: 'success' as const,
  fetchStatus: 'idle' as const,
  promise: Promise.resolve(data),
});

const createLoadingQueryResult = <T,>() => ({
  data: undefined,
  dataUpdatedAt: 0,
  error: null,
  errorUpdateCount: 0,
  errorUpdatedAt: 0,
  failureCount: 0,
  failureReason: null,
  isError: false as const,
  isFetched: false as const,
  isFetchedAfterMount: false as const,
  isFetching: true as const,
  isInitialLoading: true as const,
  isLoading: true as const,
  isLoadingError: false as const,
  isPaused: false as const,
  isPending: true as const,
  isPlaceholderData: false as const,
  isRefetchError: false as const,
  isRefetching: false as const,
  isStale: false as const,
  isSuccess: false as const,
  refetch: vi.fn(),
  status: 'pending' as const,
  fetchStatus: 'fetching' as const,
  promise: Promise.resolve({} as T),
});

describe('ReadingHistoryContainer', () => {
  it('renders loading state', () => {
    const loadingResult = createLoadingQueryResult<ReadingHistoryResponse>();
    const statsLoadingResult = createLoadingQueryResult<ReadingStatsResponse>();

    vi.mocked(useReadingHistory).mockReturnValue(loadingResult);
    vi.mocked(useReadingStats).mockReturnValue(statsLoadingResult);

    renderWithProviders(<ReadingHistoryContainer />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders reading history when data is available', () => {
    const mockHistoryData: ReadingHistoryResponse = {
      data: [
        {
          id: '1',
          book: mockBook,
          startDate: '2024-01-01',
          endDate: '2024-01-02',
          status: 'completed',
          progress: {
            currentPage: 200,
            totalPages: 200,
            lastReadAt: '2024-01-02',
          },
          tags: [],
        },
      ],
      meta: {
        total: 1,
        completed: 1,
        inProgress: 0,
        abandoned: 0,
      },
    };

    const mockStatsData: ReadingStatsResponse = {
      data: {
        totalBooksRead: 1,
        booksThisYear: 1,
        booksThisMonth: 1,
        averageRating: 4.5,
        pagesRead: 200,
        readingStreak: 1,
        favoriteGenres: [{ name: 'Fiction', count: 1 }],
        readingByMonth: [{ month: '2024-01', count: 1 }],
      },
    };

    const historyResult =
      createSuccessQueryResult<ReadingHistoryResponse>(mockHistoryData);
    const statsResult =
      createSuccessQueryResult<ReadingStatsResponse>(mockStatsData);

    vi.mocked(useReadingHistory).mockReturnValue(historyResult);
    vi.mocked(useReadingStats).mockReturnValue(statsResult);

    renderWithProviders(<ReadingHistoryContainer />);
    expect(screen.getByText('12/31/2023')).toBeInTheDocument();
  });
});
