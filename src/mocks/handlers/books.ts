import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import type { Book, SearchBooksParams } from '@/features/books/types';

// Create mock book
export const createMockBook = (override?: Partial<Book>): Book => ({
  id: faker.string.uuid(),
  title: faker.lorem.words(3),
  author: faker.person.fullName(),
  isbn: faker.string.numeric(13),
  coverImage: faker.image.url(),
  description: faker.lorem.paragraph(),
  publishedDate: faker.date.past().toISOString(),
  publisher: faker.company.name(),
  categories: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
    faker.helpers.arrayElement(['Fiction', 'Science', 'Technology', 'History', 'Arts'])
  ),
  tags: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () =>
    faker.helpers.arrayElement(['bestseller', 'classic', 'new', 'award-winning', 'recommended'])
  ),
  status: faker.helpers.arrayElement(['available', 'reserved', 'borrowed']),
  copies: {
    total: faker.number.int({ min: 1, max: 5 }),
    available: faker.number.int({ min: 0, max: 3 }),
  },
  rating: faker.number.int({ min: 1, max: 5 }),
  ...override,
});

// Create mock books
const mockBooks: Book[] = Array.from({ length: 50 }, () => createMockBook());

// Get unique categories from mock books
const categories = Array.from(new Set(mockBooks.flatMap((book) => book.categories)));

// Get unique tags from mock books
const tags = Array.from(new Set(mockBooks.flatMap((book) => book.tags)));

// Filter books based on search parameters
const filterBooks = (books: Book[], params: SearchBooksParams) => {
  return books.filter((book) => {
    // Text search
    if (params.q) {
      const searchText = params.q.toLowerCase();
      const matchesSearch =
        book.title.toLowerCase().includes(searchText) ||
        book.author.toLowerCase().includes(searchText) ||
        book.description.toLowerCase().includes(searchText);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (params.category && !book.categories.includes(params.category)) {
      return false;
    }

    // Status filter
    if (params.status && book.status !== params.status) {
      return false;
    }

    // Tags filter
    if (params.tags?.length && !params.tags.every((tag) => book.tags.includes(tag))) {
      return false;
    }

    // Date range filter
    if (params.publishedDate) {
      const publishedDate = new Date(book.publishedDate);
      if (
        (params.publishedDate.from && publishedDate < new Date(params.publishedDate.from)) ||
        (params.publishedDate.to && publishedDate > new Date(params.publishedDate.to))
      ) {
        return false;
      }
    }

    // Rating filter
    if (params.rating !== undefined && (book.rating ?? 0) < params.rating) {
      return false;
    }

    return true;
  });
};

// Sort books based on parameters
const sortBooks = (books: Book[], sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc') => {
  const sorted = [...books].sort((a, b) => {
    if (!sortBy) return 0;

    let comparison = 0;
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'author':
        comparison = a.author.localeCompare(b.author);
        break;
      case 'publishedDate':
        comparison = new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime();
        break;
      case 'rating':
        comparison = (a.rating ?? 0) - (b.rating ?? 0);
        break;
      default:
        return 0;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return sorted;
};

export const bookHandlers = [
  // GET /api/books - List books with pagination
  http.get('/api/books', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 10;

    return HttpResponse.json({
      data: mockBooks.slice((page - 1) * limit, page * limit),
      meta: {
        total: mockBooks.length,
        page,
        limit,
      },
    });
  }),

  // GET /api/books/:id - Get book details
  http.get('/api/books/:id', ({ params }) => {
    const book = mockBooks.find((b) => b.id === params.id);
    if (!book) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({ data: book });
  }),

  // GET /api/books/search - Search books
  http.get('/api/books/search', ({ request }) => {
    const url = new URL(request.url);
    const searchParams: SearchBooksParams = {
      q: url.searchParams.get('q') || undefined,
      category: url.searchParams.get('category') || undefined,
      status: (url.searchParams.get('status') as Book['status']) || undefined,
      tags: url.searchParams.get('tags')?.split(','),
      publishedDate: {
        from: url.searchParams.get('publishedDate.from') || undefined,
        to: url.searchParams.get('publishedDate.to') || undefined,
      },
      rating: url.searchParams.get('rating')
        ? Number(url.searchParams.get('rating'))
        : undefined,
      sortBy: (url.searchParams.get('sortBy') as SearchBooksParams['sortBy']) || undefined,
      sortOrder: (url.searchParams.get('sortOrder') as SearchBooksParams['sortOrder']) || 'asc',
    };

    let filteredBooks = filterBooks(mockBooks, searchParams);
    filteredBooks = sortBooks(filteredBooks, searchParams.sortBy, searchParams.sortOrder);

    return HttpResponse.json({
      data: filteredBooks,
      meta: {
        total: filteredBooks.length,
      },
    });
  }),

  // GET /api/books/categories - List categories
  http.get('/api/books/categories', () => {
    return HttpResponse.json({
      data: categories,
    });
  }),

  // GET /api/books/tags - List tags
  http.get('/api/books/tags', () => {
    return HttpResponse.json({
      data: tags,
    });
  }),
];