/** @vitest-environment jsdom */
import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { ShelfContainer } from './ShelfContainer';
import { useShelves } from '../../hooks/useShelf';
import { renderWithProviders } from '@/test/utils';
import type { ShelfResponse } from '../../types';
import type { UseQueryResult } from '@tanstack/react-query';

vi.mock('../../hooks/useShelf', () => ({
  useShelves: vi.fn(),
  useCreateShelf: vi.fn().mockReturnValue({ mutate: vi.fn() }),
  useDeleteShelf: vi.fn().mockReturnValue({ mutate: vi.fn() }),
}));

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

describe('ShelfContainer', () => {
  it('renders loading state', () => {
    const loadingResult = createLoadingQueryResult<ShelfResponse>();
    vi.mocked(useShelves).mockReturnValue(loadingResult);

    renderWithProviders(<ShelfContainer />);

    // Check for loading skeleton elements
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);

    // Check for specific skeleton structure
    expect(document.querySelector('.h-8.bg-gray-200')).toBeInTheDocument();
    expect(document.querySelectorAll('.h-24.bg-gray-200').length).toBe(3);
  });

  it('renders shelves when data is available', () => {
    const mockData: ShelfResponse = {
      data: [
        {
          id: '1',
          name: 'Test Shelf 1',
          description: 'Test Description 1',
          books: [],
          createdAt: '2024-01-01',
          updatedAt: '2024-01-02',
        },
      ],
    };

    const successResult = createSuccessQueryResult(mockData);
    vi.mocked(useShelves).mockReturnValue(successResult);

    renderWithProviders(<ShelfContainer />);
    expect(screen.getByText('Test Shelf 1')).toBeInTheDocument();
  });
});
