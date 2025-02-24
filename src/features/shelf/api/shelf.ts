import { apiClient } from '@/lib/api/client';
import type { ShelfResponse, SingleShelfResponse, Shelf, ShelfBook } from '../types';

export async function getShelves(): Promise<ShelfResponse> {
  const response = await apiClient.get<ShelfResponse>('/shelves');
  return response.data;
}

export async function getShelf(id: string): Promise<SingleShelfResponse> {
  const response = await apiClient.get<SingleShelfResponse>(`/shelves/${id}`);
  return response.data;
}

export async function createShelf(shelf: Pick<Shelf, 'name' | 'description'>): Promise<SingleShelfResponse> {
  const response = await apiClient.post<SingleShelfResponse>('/shelves', shelf);
  return response.data;
}

export async function updateShelf(
  id: string,
  shelf: Pick<Shelf, 'name' | 'description'>
): Promise<SingleShelfResponse> {
  const response = await apiClient.put<SingleShelfResponse>(`/shelves/${id}`, shelf);
  return response.data;
}

export async function deleteShelf(id: string): Promise<void> {
  await apiClient.delete(`/shelves/${id}`);
}

export async function addBookToShelf(
  shelfId: string,
  bookId: string,
  shelfBook: Pick<ShelfBook, 'status' | 'notes'>
): Promise<SingleShelfResponse> {
  const response = await apiClient.post<SingleShelfResponse>(
    `/shelves/${shelfId}/books/${bookId}`,
    shelfBook
  );
  return response.data;
}

export async function updateBookInShelf(
  shelfId: string,
  bookId: string,
  shelfBook: Pick<ShelfBook, 'status' | 'notes'>
): Promise<SingleShelfResponse> {
  const response = await apiClient.put<SingleShelfResponse>(
    `/shelves/${shelfId}/books/${bookId}`,
    shelfBook
  );
  return response.data;
}

export async function removeBookFromShelf(shelfId: string, bookId: string): Promise<void> {
  await apiClient.delete(`/shelves/${shelfId}/books/${bookId}`);
}