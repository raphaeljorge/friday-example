import { BookCard } from '@/features/books/components/BookCard';
import type { Shelf, ShelfBookStatus } from '../../types';

interface ShelfViewProps {
  shelf: Shelf;
  isLoading: boolean;
  onUpdateBookStatus: (bookId: string, status: ShelfBookStatus) => void;
  onRemoveBook: (bookId: string) => void;
  onUpdateShelf: (name: string, description?: string) => void;
}

export function ShelfView({
  shelf,
  isLoading,
  onUpdateBookStatus,
  onRemoveBook,
  onUpdateShelf,
}: ShelfViewProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4" data-testid="loading-skeleton">
        <div
          className="h-8 bg-gray-200 rounded w-1/4"
          data-testid="title-skeleton"
        ></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-[2/3] bg-gray-200 rounded"
              data-testid="book-skeleton"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{shelf.name}</h1>
          {shelf.description && (
            <p className="text-gray-600 mt-1">{shelf.description}</p>
          )}
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={() => {
            const name = prompt('Enter shelf name', shelf.name);
            const description = prompt(
              'Enter shelf description',
              shelf.description
            );
            if (name) {
              onUpdateShelf(name, description || undefined);
            }
          }}
          aria-label="Edit Shelf"
        >
          Edit Shelf
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {shelf.books.map((shelfBook) => (
          <div key={shelfBook.book.id} className="relative group">
            <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <select
                className="bg-white border border-gray-300 rounded px-2 py-1 text-xs shadow-sm"
                value={shelfBook.status}
                onChange={(e) =>
                  onUpdateBookStatus(
                    shelfBook.book.id,
                    e.target.value as ShelfBookStatus
                  )
                }
                aria-label="Book status"
              >
                <option value="want-to-read">Want to Read</option>
                <option value="reading">Reading</option>
                <option value="completed">Completed</option>
              </select>
              <button
                className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors shadow-sm"
                onClick={(e) => {
                  e.preventDefault();
                  onRemoveBook(shelfBook.book.id);
                }}
                aria-label="Remove book"
              >
                ✕
              </button>
            </div>
            <BookCard book={shelfBook.book} />
          </div>
        ))}
      </div>

      {shelf.books.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No books in this shelf yet
        </div>
      )}
    </div>
  );
}
