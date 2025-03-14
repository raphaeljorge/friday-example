/** @vitest-environment jsdom */
import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { RecommendationsContainer } from './RecommendationsContainer';
import { useRecommendations } from '../../hooks/useRecommendations';
import { renderWithProviders } from '@/test/utils';
import type { RecommendationsResponse } from '../../types';

vi.mock('../../hooks/useRecommendations', () => ({
  useRecommendations: vi.fn(),
  useDismissRecommendation: vi.fn().mockReturnValue({ mutate: vi.fn() }),
  useRefreshRecommendations: vi.fn().mockReturnValue({ mutate: vi.fn() }),
}));

describe('RecommendationsContainer', () => {
  it('renders loading state', () => {
    vi.mocked(useRecommendations).mockReturnValue({
      data: undefined,
      dataUpdatedAt: 0,
      error: null,
      errorUpdateCount: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      isError: false,
      isFetched: false,
      isFetchedAfterMount: false,
      isFetching: true,
      isInitialLoading: true,
      isLoading: true,
      isLoadingError: false,
      isPaused: false,
      isPending: true,
      isPlaceholderData: false,
      isRefetchError: false,
      isRefetching: false,
      isStale: false,
      isSuccess: false,
      refetch: vi.fn(),
      status: 'pending',
      fetchStatus: 'fetching',
      promise: Promise.resolve({
        data: [],
      } as RecommendationsResponse),
    });
    renderWithProviders(<RecommendationsContainer />);

    // Check for loading skeleton elements
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);

    // Check for specific skeleton structure
    expect(document.querySelector('.h-8.bg-gray-200')).toBeInTheDocument();
    expect(document.querySelectorAll('.h-64.bg-gray-200').length).toBe(3);
  });

  it('renders recommendations when data is available', () => {
    const mockData: RecommendationsResponse = {
      data: [],
    };
    vi.mocked(useRecommendations).mockReturnValue({
      data: mockData,
      dataUpdatedAt: 0,
      error: null,
      errorUpdateCount: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      isError: false,
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isInitialLoading: false,
      isLoading: false,
      isLoadingError: false,
      isPaused: false,
      isPending: false,
      isPlaceholderData: false,
      isRefetchError: false,
      isRefetching: false,
      isStale: false,
      isSuccess: true,
      refetch: vi.fn(),
      status: 'success',
      fetchStatus: 'idle',
      promise: Promise.resolve(mockData),
    });
    renderWithProviders(<RecommendationsContainer />);
    expect(
      screen.getByText(
        'No recommendations available. Try adjusting your preferences or refreshing.'
      )
    ).toBeInTheDocument();
  });
});
