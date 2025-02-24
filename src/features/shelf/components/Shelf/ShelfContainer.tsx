import { useShelves, useCreateShelf, useDeleteShelf } from '../../hooks/useShelf';
import { Shelf } from './Shelf';

export function ShelfContainer() {
  const { data, isLoading } = useShelves();
  const createShelf = useCreateShelf();
  const deleteShelf = useDeleteShelf();

  const handleCreateShelf = (name: string, description?: string) => {
    createShelf.mutate({
      name,
      description,
    });
  };

  const handleDeleteShelf = (id: string) => {
    if (window.confirm('Are you sure you want to delete this shelf?')) {
      deleteShelf.mutate(id);
    }
  };

  return (
    <Shelf
      shelves={data?.data ?? []}
      isLoading={isLoading}
      onCreateShelf={handleCreateShelf}
      onDeleteShelf={handleDeleteShelf}
    />
  );
}