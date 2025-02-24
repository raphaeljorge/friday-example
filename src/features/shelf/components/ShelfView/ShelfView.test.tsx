/** @vitest-environment jsdom */
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ShelfView } from './ShelfView';
import { renderWithProviders } from '@/test/utils';
import type { ShelfBookStatus, Shelf } from '../../types';
import type { Book, BookStatus } from '@/features/books/types';

const mockBook: Book = {
  id: '1',
  title: 'Test Book',
  author: 'Test Author',
  isbn: '1234567890',
  coverImage: 'test.jpg',
  description: 'Test book description',
  publishedDate: '2024-01-01',
  publisher: 'Test Publisher',
  categories: ['test'],
  tags: ['test'],
  status: 'available' as BookStatus,
  copies: {
    total: 1,
    available: 1,
  },
};

const mockShelf: Shelf = {
  id: '1',
  name: 'Test Shelf',
  description: 'Test Description',
  books: [
    {
      book: mockBook,
      status: 'reading' as ShelfBookStatus,
      addedAt: '2024-01-01',
    },
  ],
  createdAt: '2024-01-01',
  updatedAt: '2024-01-02',
};

describe('ShelfView', () => {
  const mockOnUpdateBookStatus = vi.fn();
  const mockOnRemoveBook = vi.fn();
  const mockOnUpdateShelf = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders shelf details correctly', () => {
    renderWithProviders(
      <ShelfView
        shelf={mockShelf}
        isLoading={false}
        onUpdateBookStatus={mockOnUpdateBookStatus}
        onRemoveBook={mockOnRemoveBook}
        onUpdateShelf={mockOnUpdateShelf}
      />
    );

    // Check shelf details
    expect(screen.getByText('Test Shelf')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();

    // Check book details
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();

    // Check status select
    const statusSelect = screen.getByLabelText('Book status');
    expect(statusSelect).toHaveValue('reading');
  });

  it('renders loading state', () => {
    renderWithProviders(
      <ShelfView
        shelf={mockShelf}
        isLoading={true}
        onUpdateBookStatus={mockOnUpdateBookStatus}
        onRemoveBook={mockOnRemoveBook}
        onUpdateShelf={mockOnUpdateShelf}
      />
    );

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('title-skeleton')).toBeInTheDocument();
    expect(screen.getAllByTestId('book-skeleton')).toHaveLength(3);
  });

  it('renders empty state when no books', () => {
    const emptyShelf = { ...mockShelf, books: [] };
    renderWithProviders(
      <ShelfView
        shelf={emptyShelf}
        isLoading={false}
        onUpdateBookStatus={mockOnUpdateBookStatus}
        onRemoveBook={mockOnRemoveBook}
        onUpdateShelf={mockOnUpdateShelf}
      />
    );

    expect(screen.getByText('No books in this shelf yet')).toBeInTheDocument();
  });

  it('calls onUpdateBookStatus when status is changed', () => {
    renderWithProviders(
      <ShelfView
        shelf={mockShelf}
        isLoading={false}
        onUpdateBookStatus={mockOnUpdateBookStatus}
        onRemoveBook={mockOnRemoveBook}
        onUpdateShelf={mockOnUpdateShelf}
      />
    );

    const statusSelect = screen.getByLabelText('Book status');
    fireEvent.change(statusSelect, { target: { value: 'completed' } });

    expect(mockOnUpdateBookStatus).toHaveBeenCalledWith('1', 'completed');
  });

  it('calls onRemoveBook when remove button is clicked', () => {
    renderWithProviders(
      <ShelfView
        shelf={mockShelf}
        isLoading={false}
        onUpdateBookStatus={mockOnUpdateBookStatus}
        onRemoveBook={mockOnRemoveBook}
        onUpdateShelf={mockOnUpdateShelf}
      />
    );

    const removeButton = screen.getByRole('button', { name: 'Remove book' });
    fireEvent.click(removeButton);

    expect(mockOnRemoveBook).toHaveBeenCalledWith('1');
  });

  it('calls onUpdateShelf when edit button is clicked', () => {
    const newName = 'Updated Shelf';
    const newDescription = 'Updated Description';

    // Mock window.prompt
    vi.spyOn(window, 'prompt')
      .mockImplementationOnce(() => newName)
      .mockImplementationOnce(() => newDescription);

    renderWithProviders(
      <ShelfView
        shelf={mockShelf}
        isLoading={false}
        onUpdateBookStatus={mockOnUpdateBookStatus}
        onRemoveBook={mockOnRemoveBook}
        onUpdateShelf={mockOnUpdateShelf}
      />
    );

    const editButton = screen.getByRole('button', { name: 'Edit Shelf' });
    fireEvent.click(editButton);

    expect(mockOnUpdateShelf).toHaveBeenCalledWith(newName, newDescription);
  });
});