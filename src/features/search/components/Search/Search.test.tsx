/** @vitest-environment jsdom */
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Search } from './Search';
import { renderWithProviders } from '@/test/utils';
import * as booksApi from '@/features/books/api/books';
import * as searchStore from '../../store/searchStore';
import type { UseQueryResult } from '@tanstack/react-query';
import type {
  CategoriesResponse,
  TagsResponse,
  SearchBooksResponse,
} from '@/features/books/types';

// Mock the debounce hook to be immediate in tests
vi.mock('../../hooks/useDebounce', () => ({
  useDebounce: (value: any) => value,
}));

// Mock the API modules
vi.mock('@/features/books/api/books', () => ({
  useCategories: vi.fn(),
  useTags: vi.fn(),
  useSearchBooks: vi.fn(),
}));

vi.mock('../../store/searchStore', () => ({
  useSearchStore: vi.fn(),
}));

const mockCategories = ['Fiction', 'Science', 'History'];
const mockTags = ['bestseller', 'new', 'classic'];
const mockSearchResults = [
  {
    id: '1',
    title: 'Test Book',
    author: 'Test Author',
    isbn: '1234567890',
    coverImage: 'test.jpg',
    description: 'Test Description',
    publishedDate: '2024-01-01',
    publisher: 'Test Publisher',
    categories: ['Fiction'],
    tags: ['bestseller'],
    status: 'available' as const,
    copies: {
      total: 1,
      available: 1,
    },
    rating: 4.5,
  },
];

describe('Search', () => {
  beforeEach(() => {
    // Mock all the required hooks with proper data structures
    vi.mocked(booksApi.useCategories).mockReturnValue({
      data: { data: mockCategories },
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
      promise: Promise.resolve({ data: mockCategories }),
    } as unknown as UseQueryResult<CategoriesResponse, Error>);

    vi.mocked(booksApi.useTags).mockReturnValue({
      data: { data: mockTags },
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
      promise: Promise.resolve({ data: mockTags }),
    } as unknown as UseQueryResult<TagsResponse, Error>);

    vi.mocked(booksApi.useSearchBooks).mockReturnValue({
      data: {
        data: mockSearchResults,
        meta: {
          total: mockSearchResults.length,
        },
      },
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
      promise: Promise.resolve({
        data: mockSearchResults,
        meta: { total: mockSearchResults.length },
      }),
    } as unknown as UseQueryResult<SearchBooksResponse, Error>);

    vi.mocked(searchStore.useSearchStore).mockReturnValue({
      history: [],
      addToHistory: vi.fn(),
    });
  });

  it('renders the search form', () => {
    renderWithProviders(<Search />, { initialPath: '/search' });

    // Check main elements
    expect(
      screen.getByRole('heading', { name: 'Advanced Search' })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Search by title, author, or description...')
    ).toBeInTheDocument();

    // Check filters
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Minimum Rating')).toBeInTheDocument();

    // Check categories are rendered
    mockCategories.forEach((category) => {
      expect(
        screen.getByRole('option', { name: category })
      ).toBeInTheDocument();
    });

    // Check tags are rendered
    mockTags.forEach((tag) => {
      expect(screen.getByRole('button', { name: tag })).toBeInTheDocument();
    });
  });

  it('handles search input changes', () => {
    renderWithProviders(<Search />, { initialPath: '/search' });
    const searchInput = screen.getByLabelText('Search');

    fireEvent.change(searchInput, { target: { value: 'test search' } });
    expect(searchInput).toHaveValue('test search');
  });

  it('handles category selection', () => {
    renderWithProviders(<Search />, { initialPath: '/search' });
    const categorySelect = screen.getByLabelText('Category');

    fireEvent.change(categorySelect, { target: { value: 'Fiction' } });
    expect(categorySelect).toHaveValue('Fiction');
  });

  it('handles tag selection', () => {
    renderWithProviders(<Search />, { initialPath: '/search' });
    const tagButton = screen.getByRole('button', { name: 'bestseller' });

    fireEvent.click(tagButton);
    expect(tagButton).toHaveClass('bg-blue-600', 'text-white');
  });

  it('displays search results', () => {
    renderWithProviders(<Search />, { initialPath: '/search' });
    expect(screen.getByText('Test Book')).toBeInTheDocument();
  });

  it('displays error state', async () => {
    const error = new Error('Search failed');
    const errorPromise = Promise.reject(error);
    // Prevent unhandled rejection warning
    errorPromise.catch(() => {});

    vi.mocked(booksApi.useSearchBooks).mockReturnValue({
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
      promise: errorPromise,
    } as unknown as UseQueryResult<SearchBooksResponse, Error>);

    renderWithProviders(<Search />, { initialPath: '/search' });
    expect(
      screen.getByText('Error: Failed to search books')
    ).toBeInTheDocument();
  });

  it('displays loading state', () => {
    vi.mocked(booksApi.useSearchBooks).mockReturnValue({
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
      promise: Promise.resolve(undefined),
    } as unknown as UseQueryResult<SearchBooksResponse, Error>);

    renderWithProviders(<Search />, { initialPath: '/search' });
    expect(screen.getAllByTestId('loading-skeleton')).toHaveLength(8);
  });
});
