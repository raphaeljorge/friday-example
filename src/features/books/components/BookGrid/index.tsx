import type { Book } from '../../types';
import { BookCard } from '../BookCard';

interface BookGridProps {
  books: Book[];
  isLoading?: boolean;
}

export function BookGrid({ books, isLoading }: BookGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            data-testid="loading-skeleton"
            className="bg-white rounded-lg shadow-sm"
          >
            <div
              role="presentation"
              className="aspect-[2/3] bg-gray-200 rounded-t-lg animate-pulse"
            />
            <div className="p-4 space-y-2">
              <div
                data-testid="skeleton-title"
                className="h-4 bg-gray-200 rounded animate-pulse"
              />
              <div
                data-testid="skeleton-author"
                className="h-3 bg-gray-200 rounded animate-pulse w-2/3"
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!books?.length) {
    return (
      <div role="region" className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No books found</h3>
        <p className="mt-2 text-sm text-gray-600">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
