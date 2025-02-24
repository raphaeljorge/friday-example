import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import type { Shelf, ShelfBook } from '@/features/shelf/types';
import type { Book } from '@/features/books/types';

// Create mock book
const createMockBook = (): Book => ({
  id: faker.string.uuid(),
  title: faker.lorem.words(3),
  author: faker.person.fullName(),
  isbn: faker.string.numeric(13),
  coverImage: faker.image.url(),
  description: faker.lorem.paragraph(),
  publishedDate: faker.date.past().toISOString(),
  publisher: faker.company.name(),
  categories: Array.from({ length: 2 }, () => faker.word.noun()),
  tags: Array.from({ length: 3 }, () => faker.word.noun()),
  status: faker.helpers.arrayElement(['available', 'reserved', 'borrowed']),
  copies: {
    total: faker.number.int({ min: 1, max: 5 }),
    available: faker.number.int({ min: 0, max: 3 }),
  },
});

// Create mock shelf book
const createMockShelfBook = (): ShelfBook => ({
  book: createMockBook(),
  addedAt: faker.date.recent().toISOString(),
  notes: faker.helpers.maybe(() => faker.lorem.sentence()),
  status: faker.helpers.arrayElement(['want-to-read', 'reading', 'completed']),
});

// Create mock shelves
const mockShelves: Shelf[] = Array.from({ length: 3 }, () => ({
  id: faker.string.uuid(),
  name: faker.lorem.words(2),
  description: faker.helpers.maybe(() => faker.lorem.sentence()),
  books: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, createMockShelfBook),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
}));

interface CreateShelfRequest {
  name: string;
  description?: string;
}

interface UpdateShelfRequest {
  name?: string;
  description?: string;
}

interface UpdateShelfBookRequest {
  status?: ShelfBook['status'];
  notes?: string;
}

export const shelfHandlers = [
  // GET /api/shelves - Get all shelves
  http.get('/api/shelves', () => {
    return HttpResponse.json({
      data: mockShelves,
    });
  }),

  // GET /api/shelves/:id - Get shelf by ID
  http.get('/api/shelves/:id', ({ params }) => {
    const shelf = mockShelves.find((s) => s.id === params.id);
    if (!shelf) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({
      data: shelf,
    });
  }),

  // POST /api/shelves - Create new shelf
  http.post('/api/shelves', async ({ request }) => {
    const data = await request.json() as CreateShelfRequest;
    const newShelf: Shelf = {
      id: faker.string.uuid(),
      name: data.name,
      description: data.description,
      books: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockShelves.push(newShelf);
    return HttpResponse.json({
      data: newShelf,
    });
  }),

  // PUT /api/shelves/:id - Update shelf
  http.put('/api/shelves/:id', async ({ params, request }) => {
    const data = await request.json() as UpdateShelfRequest;
    const shelfIndex = mockShelves.findIndex((s) => s.id === params.id);
    if (shelfIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    const updatedShelf = {
      ...mockShelves[shelfIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    mockShelves[shelfIndex] = updatedShelf;
    return HttpResponse.json({
      data: updatedShelf,
    });
  }),

  // DELETE /api/shelves/:id - Delete shelf
  http.delete('/api/shelves/:id', ({ params }) => {
    const shelfIndex = mockShelves.findIndex((s) => s.id === params.id);
    if (shelfIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    mockShelves.splice(shelfIndex, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // POST /api/shelves/:shelfId/books/:bookId - Add book to shelf
  http.post('/api/shelves/:shelfId/books/:bookId', async ({ params, request }) => {
    const data = await request.json() as UpdateShelfBookRequest;
    const shelf = mockShelves.find((s) => s.id === params.shelfId);
    if (!shelf) {
      return new HttpResponse(null, { status: 404 });
    }
    const newShelfBook: ShelfBook = {
      book: createMockBook(), // In a real app, we'd fetch the actual book
      addedAt: new Date().toISOString(),
      status: data.status || 'want-to-read',
      notes: data.notes,
    };
    shelf.books.push(newShelfBook);
    return HttpResponse.json({
      data: shelf,
    });
  }),

  // PUT /api/shelves/:shelfId/books/:bookId - Update book in shelf
  http.put('/api/shelves/:shelfId/books/:bookId', async ({ params, request }) => {
    const data = await request.json() as UpdateShelfBookRequest;
    const shelf = mockShelves.find((s) => s.id === params.shelfId);
    if (!shelf) {
      return new HttpResponse(null, { status: 404 });
    }
    const bookIndex = shelf.books.findIndex((b) => b.book.id === params.bookId);
    if (bookIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    const updatedBook = {
      ...shelf.books[bookIndex],
      ...data,
    };
    shelf.books[bookIndex] = updatedBook;
    return HttpResponse.json({
      data: shelf,
    });
  }),

  // DELETE /api/shelves/:shelfId/books/:bookId - Remove book from shelf
  http.delete('/api/shelves/:shelfId/books/:bookId', ({ params }) => {
    const shelf = mockShelves.find((s) => s.id === params.shelfId);
    if (!shelf) {
      return new HttpResponse(null, { status: 404 });
    }
    const bookIndex = shelf.books.findIndex((b) => b.book.id === params.bookId);
    if (bookIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    shelf.books.splice(bookIndex, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];