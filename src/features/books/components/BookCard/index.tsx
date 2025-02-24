import type { Book } from '../../types'
import { Image } from '@/shared/components/Image'
import { Link } from '@tanstack/react-router'

interface BookCardProps {
  book: Book
}

/**
 * BookCard component displays a book's information in a card format
 * including cover image, availability status, title, author, and rating
 * 
 * @param {BookCardProps} props - Component props
 * @param {Book} props.book - Book data to display
 * @returns {JSX.Element} Rendered BookCard component
 */
export function BookCard({ book }: BookCardProps) {
  const statusColors = {
    available: 'bg-green-100 text-green-800',
    reserved: 'bg-yellow-100 text-yellow-800',
    borrowed: 'bg-red-100 text-red-800',
  }

  return (
    <Link
      to="/books/$bookId"
      params={{ bookId: book.id }}
      className="block w-full"
    >
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="aspect-[2/3] relative">
          <Image
            src={book.coverImage}
            alt={`Cover of ${book.title}`}
            className="absolute inset-0 rounded-t-lg object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-book.jpg'
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white">
                {book.copies.available} of {book.copies.total} available
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColors[book.status]}`}>
                {book.status}
              </span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1" role="heading">
            {book.title}
          </h3>
          <p className="text-xs text-gray-600 mt-1 line-clamp-1">
            {book.author}
          </p>
          {book.rating !== undefined && (
            <div className="mt-2 flex items-center">
              <span className="text-xs text-yellow-600">★</span>
              <span className="text-xs text-gray-600 ml-1">{book.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}