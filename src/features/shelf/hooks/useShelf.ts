import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getShelves,
  getShelf,
  createShelf,
  updateShelf,
  deleteShelf,
  addBookToShelf,
  updateBookInShelf,
  removeBookFromShelf,
} from '../api/shelf';
import type { Shelf, ShelfBook } from '../types';

const shelfKeys = {
  all: ['shelves'] as const,
  lists: () => [...shelfKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...shelfKeys.lists(), filters] as const,
  details: () => [...shelfKeys.all, 'detail'] as const,
  detail: (id: string) => [...shelfKeys.details(), id] as const,
};

export function useShelves() {
  return useQuery({
    queryKey: shelfKeys.lists(),
    queryFn: getShelves,
  });
}

export function useShelf(id: string) {
  return useQuery({
    queryKey: shelfKeys.detail(id),
    queryFn: () => getShelf(id),
  });
}

export function useCreateShelf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createShelf,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shelfKeys.lists() });
    },
  });
}

export function useUpdateShelf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: { id: string } & Pick<Shelf, 'name' | 'description'>) =>
      updateShelf(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: shelfKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: shelfKeys.lists() });
    },
  });
}

export function useDeleteShelf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteShelf,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shelfKeys.lists() });
    },
  });
}

export function useAddBookToShelf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      shelfId,
      bookId,
      ...data
    }: {
      shelfId: string;
      bookId: string;
    } & Pick<ShelfBook, 'status' | 'notes'>) =>
      addBookToShelf(shelfId, bookId, data),
    onSuccess: (_, { shelfId }) => {
      queryClient.invalidateQueries({ queryKey: shelfKeys.detail(shelfId) });
    },
  });
}

export function useUpdateBookInShelf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      shelfId,
      bookId,
      ...data
    }: {
      shelfId: string;
      bookId: string;
    } & Pick<ShelfBook, 'status' | 'notes'>) =>
      updateBookInShelf(shelfId, bookId, data),
    onSuccess: (_, { shelfId }) => {
      queryClient.invalidateQueries({ queryKey: shelfKeys.detail(shelfId) });
    },
  });
}

export function useRemoveBookFromShelf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shelfId, bookId }: { shelfId: string; bookId: string }) =>
      removeBookFromShelf(shelfId, bookId),
    onSuccess: (_, { shelfId }) => {
      queryClient.invalidateQueries({ queryKey: shelfKeys.detail(shelfId) });
    },
  });
}
