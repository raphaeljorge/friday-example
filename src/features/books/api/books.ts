import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type {
  BooksResponse,
  BookResponse,
  SearchBooksParams,
  SearchBooksResponse,
  CategoriesResponse,
  TagsResponse,
} from '../types'

const api = axios.create({
  baseURL: '/api'
})

export const bookKeys = {
  all: ['books'] as const,
  lists: () => [...bookKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...bookKeys.lists(), filters] as const,
  details: () => [...bookKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookKeys.details(), id] as const,
  search: () => [...bookKeys.all, 'search'] as const,
  searchResults: (params: SearchBooksParams) => [...bookKeys.search(), params] as const,
  categories: () => [...bookKeys.all, 'categories'] as const,
  tags: () => [...bookKeys.all, 'tags'] as const
}

export const getBooks = async (params?: {
  page?: number
  limit?: number
}): Promise<BooksResponse> => {
  const { data } = await api.get('/books', { params })
  return data
}

export const getBook = async (id: string): Promise<BookResponse> => {
  const { data } = await api.get(`/books/${id}`)
  return data
}

export const searchBooks = async (params: SearchBooksParams): Promise<SearchBooksResponse> => {
  // Format date range for API
  const formattedParams = {
    ...params,
    publishedDate: params.publishedDate && {
      from: params.publishedDate.from,
      to: params.publishedDate.to,
    },
    tags: params.tags?.join(','),
  }

  const { data } = await api.get('/books/search', { params: formattedParams })
  return data
}

export const getCategories = async (): Promise<CategoriesResponse> => {
  const { data } = await api.get('/books/categories')
  return data
}

export const getTags = async (): Promise<TagsResponse> => {
  const { data } = await api.get('/books/tags')
  return data
}

export const useBooks = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: bookKeys.list(params ?? {}),
    queryFn: () => getBooks(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useBook = (id: string) => {
  return useQuery({
    queryKey: bookKeys.detail(id),
    queryFn: () => getBook(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useSearchBooks = (params: SearchBooksParams) => {
  return useQuery({
    queryKey: bookKeys.searchResults(params),
    queryFn: () => searchBooks(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!(
      params.q ||
      params.category ||
      params.status ||
      params.tags?.length ||
      params.publishedDate ||
      params.rating
    ),
  })
}

export const useCategories = () => {
  return useQuery({
    queryKey: bookKeys.categories(),
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

export const useTags = () => {
  return useQuery({
    queryKey: bookKeys.tags(),
    queryFn: getTags,
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}