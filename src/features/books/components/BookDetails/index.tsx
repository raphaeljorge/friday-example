import { Suspense } from 'react'
import { useParams } from '@tanstack/react-router'
import { bookRoute } from '@/lib/router'
import { useBook } from '../../api/books'
import { Image } from '@/shared/components/Image'

export default function BookDetails() {
  const { bookId } = useParams({ from: bookRoute.id })
  const { data, isLoading, error } = useBook(bookId)

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        Error loading book details. Please try again later.
      </div>
    )
  }

  const book = data?.data

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Book Details</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="animate-pulse p-6 space-y-4" data-testid="loading-skeleton">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ) : book ? (
            <div className="md:flex">
              <div className="md:w-1/3 p-6">
                <Image
                  src={book.coverImage}
                  alt={`Cover of ${book.title}`}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
              <div className="md:w-2/3 p-6 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{book.title}</h2>
                  <p className="text-lg text-gray-600">by {book.author}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    book.status === 'available'
                      ? 'bg-green-100 text-green-800'
                      : book.status === 'reserved'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-600">
                    {book.copies.available} of {book.copies.total} copies available
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                  <p className="mt-2 text-gray-600">{book.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">ISBN</h3>
                    <p className="mt-1 text-gray-900">{book.isbn}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Publisher</h3>
                    <p className="mt-1 text-gray-900">{book.publisher}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Published Date</h3>
                    <p className="mt-1 text-gray-900">
                      {new Date(book.publishedDate).toLocaleDateString()}
                    </p>
                  </div>
                  {book.rating && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Rating</h3>
                      <p className="mt-1 text-gray-900">
                        {book.rating.toFixed(1)} ★
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Categories</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {book.categories.map(category => (
                      <span
                        key={category}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {book.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </Suspense>
    </div>
  )
}