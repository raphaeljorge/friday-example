/** @vitest-environment jsdom */
import React from 'react';
import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BookDetails from './index';
import { renderWithProviders } from '@/test/utils';
import { useBook } from '../../api/books';
import type { UseQueryResult } from '@tanstack/react-query';
import type { BookResponse, Book, BookStatus } from '../../types';

// Mock the router hooks
vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');
  return {
    ...actual,
    useParams: () => ({ bookId: '1' }),
    bookRoute: {
      id: 'book-route'
    }
  };
});

// Mock the book API
vi.mock('../../api/books', () => ({
  useBook: vi.fn(),
}));

const mockBook: Book = {
  id: '1',
  title: 'Test Book',
  author: 'Test Author',
  description: 'Test Description',
  coverImage: 'test-cover.jpg',
  categories: ['fiction'],
  status: 'available' as BookStatus,
  copies: {
    available: 2,
    total: 3,
  },
  isbn: '123-456-789',
  publisher: 'Test Publisher',
  publishedDate: '2024-02-21',
  rating: 4.5,
  tags: ['bestseller'],
};

describe('BookDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    vi.mocked(useBook).mockReturnValue({
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
    } as unknown as UseQueryResult<BookResponse, Error>);

    renderWithProviders(<BookDetails />, { initialPath: '/books/1' });
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('renders book details when data is available', () => {
    const mockResponse: BookResponse = {
      data: mockBook
    };

    vi.mocked(useBook).mockReturnValue({
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
    } as unknown as UseQueryResult<BookResponse, Error>);

    renderWithProviders(<BookDetails />, { initialPath: '/books/1' });

    // Check main details
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('by Test Author')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();

    // Check status and availability
    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText('2 of 3 copies available')).toBeInTheDocument();

    // Check metadata
    expect(screen.getByText('123-456-789')).toBeInTheDocument();
    expect(screen.getByText('Test Publisher')).toBeInTheDocument();
    expect(screen.getByText('4.5 ★')).toBeInTheDocument();

    // Check categories and tags
    expect(screen.getByText('fiction')).toBeInTheDocument();
    expect(screen.getByText('bestseller')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    const error = new Error('Failed to load book');
    const errorPromise = Promise.reject(error);
    // Prevent unhandled rejection warning
    errorPromise.catch(() => {});

    vi.mocked(useBook).mockReturnValue({
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
    } as unknown as UseQueryResult<BookResponse, Error>);

    renderWithProviders(<BookDetails />, { initialPath: '/books/1' });
    expect(screen.getByText('Error loading book details. Please try again later.')).toBeInTheDocument();
  });
});