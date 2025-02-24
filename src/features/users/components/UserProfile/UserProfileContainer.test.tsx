/** @vitest-environment jsdom */
import React from 'react';
import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserProfileContainer } from './UserProfileContainer';
import { useUserProfile, useUpdateUserProfile } from '../../hooks/useUser';
import { renderWithProviders } from '@/test/utils';
import { UseQueryResult } from '@tanstack/react-query';
import { UserResponse } from '../../types';

// Mock the user hooks
vi.mock('../../hooks/useUser', () => ({
  useUserProfile: vi.fn(),
  useUpdateUserProfile: () => ({ mutate: vi.fn() }),
}));

const mockUserProfile = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  preferences: {
    favoriteCategories: ['fiction', 'mystery'],
    notificationSettings: {
      email: true,
      push: false,
    },
  },
};

describe('UserProfileContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    vi.mocked(useUserProfile).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      isError: false,
      isFetched: false,
      isFetchedAfterMount: false,
      isFetching: true,
      isPending: true,
      isRefetching: false,
      isSuccess: false,
      status: 'pending',
      isLoadingError: false,
      isRefetchError: false,
      isPlaceholderData: false,
      errorUpdateCount: 0,
      fetchStatus: 'fetching',
      isStale: false,
      isInitialLoading: true,
      isPaused: false,
      refetch: vi.fn(),
      promise: Promise.resolve(undefined)
    } as unknown as UseQueryResult<UserResponse, Error>);

    renderWithProviders(<UserProfileContainer />, { initialPath: '/profile' });
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('renders user profile when data is available', () => {
    vi.mocked(useUserProfile).mockReturnValue({
      data: { data: mockUserProfile },
      isLoading: false,
      error: null,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      isError: false,
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isPending: false,
      isRefetching: false,
      isSuccess: true,
      status: 'success',
      isLoadingError: false,
      isRefetchError: false,
      isPlaceholderData: false,
      errorUpdateCount: 0,
      fetchStatus: 'idle',
      isStale: false,
      isInitialLoading: false,
      isPaused: false,
      refetch: vi.fn(),
      promise: Promise.resolve({ data: { data: mockUserProfile } })
    } as unknown as UseQueryResult<UserResponse, Error>);

    renderWithProviders(<UserProfileContainer />, { initialPath: '/profile' });
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
    expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
  });

  it('renders error state', async () => {
    const error = new Error('Failed to load profile');
    const errorPromise = Promise.reject(error);
    // Prevent unhandled rejection warning
    errorPromise.catch(() => {});

    vi.mocked(useUserProfile).mockReturnValue({
      data: undefined,
      isLoading: false,
      error,
      dataUpdatedAt: 0,
      errorUpdatedAt: Date.now(),
      failureCount: 1,
      failureReason: error,
      isError: true,
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isPending: false,
      isRefetching: false,
      isSuccess: false,
      status: 'error',
      isLoadingError: true,
      isRefetchError: false,
      isPlaceholderData: false,
      errorUpdateCount: 1,
      fetchStatus: 'idle',
      isStale: false,
      isInitialLoading: false,
      isPaused: false,
      refetch: vi.fn(),
      promise: errorPromise
    } as unknown as UseQueryResult<UserResponse, Error>);

    renderWithProviders(<UserProfileContainer />, { initialPath: '/profile' });
    const errorElement = await screen.findByRole('alert');
    expect(errorElement).toHaveTextContent('Error loading profile. Please try again later.');
  });
});