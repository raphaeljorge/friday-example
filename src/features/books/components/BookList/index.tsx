import { useState } from 'react'
import { useBooks } from '../../api/books'
import { BookGrid } from '../BookGrid'

const ITEMS_PER_PAGE = 12

export function BookList() {
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useBooks({
    page,
    limit: ITEMS_PER_PAGE
  })

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-red-900">Error loading books</h3>
        <p className="mt-2 text-sm text-red-600">
          Please try again later
        </p>
      </div>
    )
  }

  const totalPages = data ? Math.ceil(data.meta.total / ITEMS_PER_PAGE) : 0

  return (
    <div className="space-y-6">
      <BookGrid
        books={data?.data ?? []}
        isLoading={isLoading}
      />
      
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 py-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}