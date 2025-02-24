/** @vitest-environment jsdom */
import React from 'react';
import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReadingHistory } from './ReadingHistory';
import { BookStatus } from '@/features/books/types';
import { ReadingStatus } from '../../types';
import { renderWithProviders } from '@/test/utils';

const mockHistory = [
  {
    id: '1',
    book: {
      id: '1',
      title: 'Test Book',
      author: 'Test Author',
      isbn: '1234567890',
      coverImage: 'test.jpg',
      description: 'Test Description',
      publishedDate: '2024-01-01',
      publisher: 'Test Publisher',
      categories: ['test'],
      tags: ['test'],
      status: 'available' as BookStatus,
      copies: {
        total: 1,
        available: 1,
      },
      rating: 5,
    },
    startDate: '2024-01-01',
    endDate: '2024-01-02',
    status: 'completed' as ReadingStatus,
    progress: {
      currentPage: 100,
      totalPages: 200,
      lastReadAt: '2024-01-02',
      notes: 'Test Notes',
    },
    rating: 5,
    review: 'Test Review',
    tags: ['test', 'tag'],
  },
];

const mockStats = {
  totalBooksRead: 1,
  booksThisYear: 1,
  booksThisMonth: 1,
  averageRating: 5,
  pagesRead: 100,
  readingStreak: 1,
  favoriteGenres: [],
  readingByMonth: [],
};

const mockOnUpdateProgress = vi.fn();
const mockOnAddReview = vi.fn();
const mockOnUpdateTags = vi.fn();
const mockOnDeleteEntry = vi.fn();

describe('ReadingHistory', () => {
  const requiredProps = {
    history: mockHistory,
    stats: mockStats,
    isLoading: false,
    onUpdateProgress: mockOnUpdateProgress,
    onAddReview: mockOnAddReview,
    onUpdateTags: mockOnUpdateTags,
    onDeleteEntry: mockOnDeleteEntry,
  };

  it('renders reading history correctly', () => {
    renderWithProviders(
      <ReadingHistory
        {...requiredProps}
      />
    );
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    renderWithProviders(
      <ReadingHistory
        {...requiredProps}
        isLoading={true}
      />
    );
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders no history message when history is empty', () => {
    renderWithProviders(
      <ReadingHistory
        {...requiredProps}
        history={[]}
      />
    );
    expect(screen.getByText('No reading history yet. Start reading to track your progress!')).toBeInTheDocument();
  });
});