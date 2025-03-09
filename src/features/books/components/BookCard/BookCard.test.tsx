/** @vitest-environment jsdom */
import React from 'react';
import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BookCard } from './index';
import { BookStatus } from '../../types';
import { renderWithProviders } from '@/test/utils';

// Mock the Image component
vi.mock('@/shared/components/Image', () => ({
  Image: ({
    src: initialSrc,
    alt,
    onError,
  }: { src: string; alt: string; onError: (e: any) => void }) => {
    const [src, setSrc] = React.useState(initialSrc);

    // Simulate error handling capability
    React.useEffect(() => {
      if (initialSrc === 'invalid.jpg') {
        const event = { currentTarget: { src } };
        onError(event);
        setSrc('/placeholder-book.jpg');
      }
    }, [initialSrc, onError]);

    return <img src={src} alt={alt} />;
  },
}));

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

const createMockBook = (overrides = {}) => ({
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
  ...overrides,
});

describe('BookCard', () => {
  it('renders book card correctly with basic information', () => {
    const book = createMockBook();
    renderWithProviders(<BookCard book={book} />);

    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('1 of 1 available')).toBeInTheDocument();

    const image = screen.getByAltText('Cover of Test Book');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test.jpg');

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/books/1');
    expect(link).toHaveClass('block w-full');
  });

  it('displays rating when provided', () => {
    const book = createMockBook({ rating: 4.5 });
    renderWithProviders(<BookCard book={book} />);

    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('★')).toBeInTheDocument();
  });

  it('does not display rating when not provided', () => {
    const book = createMockBook({ rating: undefined });
    renderWithProviders(<BookCard book={book} />);

    expect(screen.queryByText('★')).not.toBeInTheDocument();
  });

  it.each([
    ['available', 'bg-green-100 text-green-800'],
    ['reserved', 'bg-yellow-100 text-yellow-800'],
    ['borrowed', 'bg-red-100 text-red-800'],
  ])(
    'displays correct status indicator for %s status',
    (status, expectedClass) => {
      const book = createMockBook({ status: status as BookStatus });
      renderWithProviders(<BookCard book={book} />);

      const statusElement = screen.getByText(status);
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveClass(expectedClass);
    }
  );

  it('displays correct availability information', () => {
    const book = createMockBook({
      copies: { total: 5, available: 3 },
    });
    renderWithProviders(<BookCard book={book} />);

    expect(screen.getByText('3 of 5 available')).toBeInTheDocument();
  });

  it('handles image loading error', async () => {
    const book = createMockBook({ coverImage: 'invalid.jpg' });
    renderWithProviders(<BookCard book={book} />);

    const image = screen.getByAltText('Cover of Test Book');
    expect(image).toHaveAttribute('src', '/placeholder-book.jpg');
  });
});
