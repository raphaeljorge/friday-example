/** @vitest-environment jsdom */
import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Books from './index';
import { renderWithProviders } from '@/test/utils';
import * as booksApi from '../../api/books';
import { UseQueryResult } from '@tanstack/react-query';
import { BooksResponse } from '../../types';

describe('Books', () => {
  beforeEach(() => {
    // Mock the useBooks hook with success state and empty data
    vi.spyOn(booksApi, 'useBooks').mockReturnValue({
      data: {
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 12
        },
      },
      dataUpdatedAt: Date.now(),
      error: null,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      isError: false,
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isLoading: false,
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
        data: {
          data: [],
          meta: {
            total: 0,
            page: 1,
            limit: 12
          }
        }
      })
    } as unknown as UseQueryResult<BooksResponse, Error>);
  });

  it('renders the component', () => {
    renderWithProviders(<Books />, { initialPath: '/' });
    
    // Check header content
    const heading = screen.getByText('Library Books');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
    
    expect(
      screen.getByText('Browse our collection of books available for borrowing')
    ).toBeInTheDocument();

    // Check that BookList renders its empty state
    expect(screen.getByText('No books found')).toBeInTheDocument();
  });
});