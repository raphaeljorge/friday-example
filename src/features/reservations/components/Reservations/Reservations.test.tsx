/** @vitest-environment jsdom */
import React from 'react';
import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Reservations from './index';
import { useReservations, useCancelReservation, useUpdateReservation } from '../../hooks/useReservations';
import { renderWithProviders } from '@/test/utils';
import type { UseQueryResult } from '@tanstack/react-query';
import type { ReservationsResponse, Reservation } from '../../types';

// Mock the hooks
vi.mock('../../hooks/useReservations', () => ({
  useReservations: vi.fn(),
  useCancelReservation: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isLoading: false,
  })),
  useUpdateReservation: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isLoading: false,
  })),
}));

describe('Reservations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    vi.mocked(useReservations).mockReturnValue({
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
    } as unknown as UseQueryResult<ReservationsResponse, Error>);

    renderWithProviders(<Reservations />);
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    const error = new Error('Test Error');
    const errorPromise = Promise.reject(error);
    // Prevent unhandled rejection warning
    errorPromise.catch(() => {});

    vi.mocked(useReservations).mockReturnValue({
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
    } as unknown as UseQueryResult<ReservationsResponse, Error>);

    renderWithProviders(<Reservations />);
    expect(screen.getByText('Error loading reservations. Please try again later.')).toBeInTheDocument();
  });

  it('renders reservations when data is available', () => {
    const emptyResponse: ReservationsResponse = {
      data: [],
      meta: {
        total: 0,
        waitlisted: 0,
        overdue: 0
      }
    };

    vi.mocked(useReservations).mockReturnValue({
      data: emptyResponse,
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
      promise: Promise.resolve(emptyResponse)
    } as unknown as UseQueryResult<ReservationsResponse, Error>);

    renderWithProviders(<Reservations />);
    expect(screen.getByText('My Reservations')).toBeInTheDocument();
    expect(screen.getByText('No active reservations')).toBeInTheDocument();
    expect(screen.getByText('No past reservations')).toBeInTheDocument();
  });

  it('renders reservations with data', () => {
    const mockReservation: Reservation = {
      id: '1',
      bookId: '1',
      userId: '1',
      status: 'pending',
      reservationDate: '2024-01-01',
      pickupDate: '2024-01-02',
      returnDate: '2024-01-03',
      notifications: [],
      history: []
    };

    const mockResponse: ReservationsResponse = {
      data: [mockReservation],
      meta: {
        total: 1,
        waitlisted: 0,
        overdue: 0
      }
    };

    vi.mocked(useReservations).mockReturnValue({
      data: mockResponse,
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
      promise: Promise.resolve(mockResponse)
    } as unknown as UseQueryResult<ReservationsResponse, Error>);

    renderWithProviders(<Reservations />);
    expect(screen.getByText('My Reservations')).toBeInTheDocument();
    expect(screen.getByText('Pickup: 2024-01-02')).toBeInTheDocument();
    expect(screen.getByText('Status: pending')).toBeInTheDocument();
  });
});