import { Link } from '@tanstack/react-router';
import type { Shelf as ShelfType } from '../../types';
import { Image } from '@/shared/components/Image';

interface ShelfProps {
  shelves: ShelfType[];
  isLoading: boolean;
  onCreateShelf: (name: string, description?: string) => void;
  onDeleteShelf: (id: string) => void;
}

export function Shelf({ shelves, isLoading, onCreateShelf, onDeleteShelf }: ShelfProps) {
  const handleCreateShelf = () => {
    const name = prompt('Enter shelf name');
    const description = prompt('Enter shelf description (optional)');
    if (name) {
      onCreateShelf(name, description || undefined);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Shelves</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={handleCreateShelf}
        >
          Create New Shelf
        </button>
      </div>

      <div className="grid gap-6">
        {shelves.map((shelf) => (
          <div
            key={shelf.id}
            className="p-6 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <Link
                  to="/shelf/$shelfId"
                  params={{ shelfId: shelf.id }}
                  className="text-xl font-semibold hover:text-blue-600 transition-colors"
                >
                  {shelf.name}
                </Link>
                {shelf.description && (
                  <p className="text-gray-600 mt-1">{shelf.description}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  {shelf.books.length} books • Created{' '}
                  {new Date(shelf.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                className="p-2 text-red-600 hover:text-red-700 transition-colors"
                onClick={() => onDeleteShelf(shelf.id)}
              >
                Delete
              </button>
            </div>

            {shelf.books.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Books</h3>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {shelf.books.slice(0, 3).map((shelfBook) => (
                    <Link
                      key={shelfBook.book.id}
                      to="/books/$bookId"
                      params={{ bookId: shelfBook.book.id }}
                      className="flex-shrink-0 w-24 group"
                    >
                      <div className="aspect-[2/3] relative">
                        <Image
                          src={shelfBook.book.coverImage}
                          alt={shelfBook.book.title}
                          className="w-full h-full object-cover rounded shadow-sm group-hover:shadow-md transition-shadow"
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1 truncate group-hover:text-blue-600 transition-colors">
                        {shelfBook.book.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {shelves.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No shelves created yet. Click "Create New Shelf" to get started.
          </div>
        )}
      </div>
    </div>
  );
}