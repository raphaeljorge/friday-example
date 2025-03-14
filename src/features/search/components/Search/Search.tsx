import { useState } from 'react';
import {
  useSearchBooks,
  useCategories,
  useTags,
} from '@/features/books/api/books';
import { BookGrid } from '@/features/books/components/BookGrid';
import { useSearchStore } from '../../store/searchStore';
import { useDebounce } from '../../hooks/useDebounce';
import type {
  BookStatus,
  SearchBooksParams,
  DateRange,
  SortField,
  SortOrder,
} from '@/features/books/types';

const sortOptions: { value: SortField; label: string }[] = [
  { value: 'title', label: 'Title' },
  { value: 'author', label: 'Author' },
  { value: 'publishedDate', label: 'Publication Date' },
  { value: 'rating', label: 'Rating' },
];

export function Search() {
  const [searchParams, setSearchParams] = useState<SearchBooksParams>({
    q: '',
    category: '',
    status: undefined,
    tags: [],
    publishedDate: {},
    rating: undefined,
    sortBy: 'title',
    sortOrder: 'asc',
  });

  const debouncedParams = useDebounce(searchParams, 300);
  const { data: categories } = useCategories();
  const { data: tags } = useTags();
  const {
    data: searchResults,
    isLoading,
    error,
  } = useSearchBooks(debouncedParams);
  const { history, addToHistory } = useSearchStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults) {
      addToHistory(searchParams, searchResults.data.length);
    }
  };

  const handleDateRangeChange = (range: Partial<DateRange>) => {
    setSearchParams((prev) => ({
      ...prev,
      publishedDate: {
        ...prev.publishedDate,
        ...range,
      },
    }));
  };

  const handleTagToggle = (tag: string) => {
    setSearchParams((prev) => ({
      ...prev,
      tags: prev.tags?.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...(prev.tags || []), tag],
    }));
  };

  const handleStatusChange = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      status: value === '' ? undefined : (value as BookStatus),
    }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Advanced Search</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSearch} className="space-y-6">
          {/* Search input */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700"
            >
              Search
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by title, author, or description..."
              className="mt-1 w-full px-4 py-2 border rounded-md"
              value={searchParams.q}
              onChange={(e) =>
                setSearchParams((prev) => ({ ...prev, q: e.target.value }))
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Category filter */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                className="mt-1 w-full px-4 py-2 border rounded-md"
                value={searchParams.category}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
              >
                <option value="">All Categories</option>
                {categories?.data.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Status filter */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                className="mt-1 w-full px-4 py-2 border rounded-md"
                value={searchParams.status || ''}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="borrowed">Borrowed</option>
              </select>
            </div>

            {/* Rating filter */}
            <div>
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-gray-700"
              >
                Minimum Rating
              </label>
              <select
                id="rating"
                className="mt-1 w-full px-4 py-2 border rounded-md"
                value={searchParams.rating || ''}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    rating: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
              >
                <option value="">Any Rating</option>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}+ Stars
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="dateFrom"
                className="block text-sm font-medium text-gray-700"
              >
                Published From
              </label>
              <input
                id="dateFrom"
                type="date"
                className="mt-1 w-full px-4 py-2 border rounded-md"
                value={searchParams.publishedDate?.from || ''}
                onChange={(e) =>
                  handleDateRangeChange({ from: e.target.value })
                }
              />
            </div>
            <div>
              <label
                htmlFor="dateTo"
                className="block text-sm font-medium text-gray-700"
              >
                Published To
              </label>
              <input
                id="dateTo"
                type="date"
                className="mt-1 w-full px-4 py-2 border rounded-md"
                value={searchParams.publishedDate?.to || ''}
                onChange={(e) => handleDateRangeChange({ to: e.target.value })}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags?.data.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`px-3 py-1 rounded-full text-sm ${
                    searchParams.tags?.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Sort options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="sortBy"
                className="block text-sm font-medium text-gray-700"
              >
                Sort By
              </label>
              <select
                id="sortBy"
                className="mt-1 w-full px-4 py-2 border rounded-md"
                value={searchParams.sortBy}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    sortBy: e.target.value as SortField,
                  }))
                }
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="sortOrder"
                className="block text-sm font-medium text-gray-700"
              >
                Sort Order
              </label>
              <select
                id="sortOrder"
                className="mt-1 w-full px-4 py-2 border rounded-md"
                value={searchParams.sortOrder}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    sortOrder: e.target.value as SortOrder,
                  }))
                }
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </form>

        {/* Search History */}
        {history.length > 0 && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Recent Searches</h2>
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                >
                  <button
                    className="text-left flex-1"
                    onClick={() => setSearchParams(item.query)}
                  >
                    <span className="text-sm text-gray-600">
                      {item.query.q || 'All books'}{' '}
                      {item.query.category && `in ${item.query.category}`}
                    </span>
                    <span className="text-xs text-gray-500 block">
                      {new Date(item.timestamp).toLocaleDateString()} •{' '}
                      {item.resultCount} results
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="mt-8">
          {error ? (
            <div className="text-red-600">Error: Failed to search books</div>
          ) : searchResults?.data.length === 0 ? (
            <div className="text-gray-500">No books found</div>
          ) : (
            <BookGrid books={searchResults?.data ?? []} isLoading={isLoading} />
          )}
        </div>
      </div>
    </div>
  );
}
