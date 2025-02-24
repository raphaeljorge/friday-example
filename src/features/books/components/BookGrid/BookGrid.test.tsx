/** @vitest-environment jsdom */
import React from 'react';
import { screen, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BookGrid } from './index';
import { BookStatus, Book } from '../../types';
import { renderWithProviders } from '@/test/utils';

// Mock external dependencies
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@/shared/components/Image', () => ({
  Image: ({ alt, className }: { alt: string; className?: string }) => (
    <div data-testid="mock-image" className={className} aria-label={alt} />
  ),
}));

const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Test Book 1',
    author: 'Test Author 1',
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
  },
];

describe('BookGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders book grid correctly', () => {
    renderWithProviders(
      <BookGrid 
        books={mockBooks} 
        isLoading={false} 
      />
    );

    // Check for book title
    const heading = screen.getByRole('heading', { name: 'Test Book 1' });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-sm', 'font-medium', 'text-gray-900');

    // Check for author
    const author = screen.getByText('Test Author 1');
    expect(author).toBeInTheDocument();
    expect(author.tagName).toBe('P');
    expect(author).toHaveClass('text-xs', 'text-gray-600');

    // Check for availability info
    const availability = screen.getByText('1 of 1 available');
    expect(availability).toBeInTheDocument();
    expect(availability).toHaveClass('text-xs', 'text-white');

    // Check for mock image
    const image = screen.getByTestId('mock-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('aria-label', 'Cover of Test Book 1');
    expect(image).toHaveClass('absolute', 'inset-0', 'rounded-t-lg');
  });

  it('renders loading state', () => {
    renderWithProviders(
      <BookGrid 
        books={[]} 
        isLoading={true} 
      />
    );

    // Check for skeleton loading cards
    const skeletons = screen.getAllByTestId('loading-skeleton');
    expect(skeletons).toHaveLength(8);

    // Check first skeleton structure
    const firstSkeleton = skeletons[0];
    expect(firstSkeleton).toHaveClass('bg-white', 'rounded-lg', 'shadow-sm');

    // Check skeleton image placeholder
    const imagePlaceholder = within(firstSkeleton).getByRole('presentation');
    expect(imagePlaceholder).toHaveClass('aspect-[2/3]', 'bg-gray-200', 'rounded-t-lg', 'animate-pulse');

    // Check skeleton text placeholders
    const titlePlaceholder = within(firstSkeleton).getByTestId('skeleton-title');
    expect(titlePlaceholder).toHaveClass('h-4', 'bg-gray-200', 'rounded', 'animate-pulse');

    const authorPlaceholder = within(firstSkeleton).getByTestId('skeleton-author');
    expect(authorPlaceholder).toHaveClass('h-3', 'bg-gray-200', 'rounded', 'animate-pulse', 'w-2/3');
  });

  it('renders no books message when books is empty', () => {
    renderWithProviders(
      <BookGrid 
        books={[]} 
        isLoading={false} 
      />
    );

    // Check for message container
    const messageContainer = screen.getByRole('region');
    expect(messageContainer).toHaveClass('text-center', 'py-12');

    // Check for heading
    const heading = screen.getByRole('heading', { name: 'No books found' });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-lg', 'font-medium', 'text-gray-900');

    // Check for subtext
    const subtext = screen.getByText('Try adjusting your search or filters');
    expect(subtext).toBeInTheDocument();
    expect(subtext).toHaveClass('mt-2', 'text-sm', 'text-gray-600');
  });
});