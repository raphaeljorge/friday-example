/** @vitest-environment jsdom */
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BookList } from './index';
import { renderWithProviders } from '@/test/utils';
import * as booksApi from '../../api/books';
import { BookStatus } from '../../types';
import type { UseQueryResult } from '@tanstack/react-query';
import type { BooksResponse } from '../../types';

// Mock TanStack Router's Link component
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, params, className }: any) => (
    <a
      href={`${to.replace('$bookId', params.bookId)}`}
      className={className}
      onClick={(e) => e.preventDefault()}
    >
      {children}
    </a>
  ),
}));

vi.mock('../../api/books', () => ({
  useBooks: vi.fn(),
}));

const mockBooks = [
  {
    id: '1',
    title: 'Test Book 1',
    author: 'Test Author 1',
    isbn: '1234567890',
    coverImage: 'test1.jpg',
    description: 'Test Description 1',
    publishedDate: '2024-01-01',
    publisher: 'Test Publisher',
    categories: ['test'],
    tags: ['test'],
    status: 'available' as BookStatus,
    copies: {
      total: 1,
      available: 1,
    },
  },
  {
    id: '2',
    title: 'Test Book 2',
    author: 'Test Author 2',
    isbn: '0987654321',
    coverImage: 'test2.jpg',
    description: 'Test Description 2',
    publishedDate: '2024-01-02',
    publisher: 'Test Publisher',
    categories: ['test'],
    tags: ['test'],
    status: 'available' as BookStatus,
    copies: {
      total: 1,
      available: 1,
    },
  },
];

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

const createErrorQueryResult = <T,>(error: Error) => ({
  data: undefined,
  dataUpdatedAt: 0,
  error,
  errorUpdateCount: 1,
  errorUpdatedAt: 0,
  failureCount: 1,
  failureReason: error,
  isError: true as const,
  isFetched: true as const,
  isFetchedAfterMount: true as const,
  isFetching: false as const,
  isInitialLoading: false as const,
  isLoading: false as const,
  isLoadingError: true as const,
  isPaused: false as const,
  isPending: false as const,
  isPlaceholderData: false as const,
  isRefetchError: false as const,
  isRefetching: false as const,
  isStale: false as const,
  isSuccess: false as const,
  refetch: vi.fn(),
  status: 'error' as const,
  fetchStatus: 'idle' as const,
  promise: Promise.reject(error),
});

describe('BookList', () => {
  it('renders loading state', () => {
    const loadingResult = createLoadingQueryResult<BooksResponse>();
    vi.mocked(booksApi.useBooks).mockReturnValue(loadingResult);

    renderWithProviders(<BookList />);
    expect(screen.getAllByTestId('loading-skeleton')).toHaveLength(8);
  });

  it('renders error state', async () => {
    const error = new Error('Failed to load');
    const errorResult = createErrorQueryResult<BooksResponse>(error);
    vi.mocked(booksApi.useBooks).mockReturnValue(errorResult);

    renderWithProviders(<BookList />);
    expect(screen.getByText('Error loading books')).toBeInTheDocument();
    expect(screen.getByText('Please try again later')).toBeInTheDocument();

    // Handle the rejected promise
    await expect(errorResult.promise).rejects.toThrow('Failed to load');
  });

  it('renders books and pagination', () => {
    const mockData: BooksResponse = {
      data: mockBooks,
      meta: {
        total: 24, // 2 pages with 12 items per page
        page: 1,
        limit: 12,
      },
    };

    const successResult = createSuccessQueryResult(mockData);
    vi.mocked(booksApi.useBooks).mockReturnValue(successResult);

    renderWithProviders(<BookList />);

    // Check if books are rendered
    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    expect(screen.getByText('Test Book 2')).toBeInTheDocument();

    // Check pagination
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();

    const prevButton = screen.getByText('Previous');
    const nextButton = screen.getByText('Next');

    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();

    // Test pagination interaction
    fireEvent.click(nextButton);
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
  });
});
