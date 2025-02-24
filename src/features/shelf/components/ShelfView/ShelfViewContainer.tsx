import { useShelf, useUpdateShelf, useUpdateBookInShelf, useRemoveBookFromShelf } from '../../hooks/useShelf';
import { ShelfView } from './ShelfView';
import type { ShelfBookStatus } from '../../types';

interface ShelfViewContainerProps {
  shelfId: string;
}

export function ShelfViewContainer({ shelfId }: ShelfViewContainerProps) {
  const { data, isLoading } = useShelf(shelfId);
  const updateShelf = useUpdateShelf();
  const updateBook = useUpdateBookInShelf();
  const removeBook = useRemoveBookFromShelf();

  const handleUpdateBookStatus = (bookId: string, status: ShelfBookStatus) => {
    updateBook.mutate({
      shelfId,
      bookId,
      status,
    });
  };

  const handleRemoveBook = (bookId: string) => {
    removeBook.mutate({
      shelfId,
      bookId,
    });
  };

  const handleUpdateShelf = (name: string, description?: string) => {
    updateShelf.mutate({
      id: shelfId,
      name,
      description,
    });
  };

  if (!data && !isLoading) {
    return <div>Shelf not found</div>;
  }

  return (
    <ShelfView
      shelf={data?.data ?? {
        id: '',
        name: '',
        books: [],
        createdAt: '',
        updatedAt: '',
      }}
      isLoading={isLoading}
      onUpdateBookStatus={handleUpdateBookStatus}
      onRemoveBook={handleRemoveBook}
      onUpdateShelf={handleUpdateShelf}
    />
  );
}