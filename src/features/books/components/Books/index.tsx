import { BookList } from '../BookList'

export default function Books() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Library Books</h1>
        <p className="mt-2 text-gray-600">
          Browse our collection of books available for borrowing
        </p>
      </div>

      <BookList />
    </div>
  )
}