import { Link } from '@tanstack/react-router'

export function Navigation() {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex h-16 justify-between items-center">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Book Library
          </Link>
          <div className="flex space-x-4">
            <Link
              to="/search"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
            >
              Search
            </Link>
            <Link
              to="/shelf"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
            >
              My Shelf
            </Link>
            <Link
              to="/reservations"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
            >
              Reservations
            </Link>
            <Link
              to="/profile"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}