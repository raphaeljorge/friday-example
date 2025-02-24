import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import type {
  ReadingHistoryEntry,
  ReadingStatus,
  CreateReadingHistoryRequest,
  UpdateReadingHistoryRequest,
  ReadingStats,
} from '@/features/history/types';
import { createMockBook } from './books';

// Create mock reading history entry
const createMockHistoryEntry = (override?: Partial<ReadingHistoryEntry>): ReadingHistoryEntry => ({
  id: faker.string.uuid(),
  book: createMockBook(),
  startDate: faker.date.past().toISOString(),
  endDate: faker.helpers.maybe(() => faker.date.recent().toISOString()),
  status: faker.helpers.arrayElement(['completed', 'in-progress', 'abandoned']) as ReadingStatus,
  progress: {
    currentPage: faker.number.int({ min: 1, max: 500 }),
    totalPages: 500,
    lastReadAt: faker.date.recent().toISOString(),
    notes: faker.helpers.maybe(() => faker.lorem.paragraph()),
  },
  rating: faker.helpers.maybe(() => faker.number.int({ min: 1, max: 5 })),
  review: faker.helpers.maybe(() => faker.lorem.paragraph()),
  tags: faker.helpers.multiple(() => faker.word.sample(), {
    count: { min: 0, max: 5 },
  }),
  ...override,
});

// Create mock reading history entries
const mockHistory: ReadingHistoryEntry[] = Array.from({ length: 20 }, () =>
  createMockHistoryEntry()
);

// Calculate mock reading stats
const calculateReadingStats = (): ReadingStats => {
  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth();

  const completedBooks = mockHistory.filter((entry) => entry.status === 'completed');
  const booksThisYear = completedBooks.filter(
    (entry) => new Date(entry.endDate!).getFullYear() === thisYear
  );
  const booksThisMonth = booksThisYear.filter(
    (entry) => new Date(entry.endDate!).getMonth() === thisMonth
  );

  const totalRating = completedBooks.reduce(
    (sum, entry) => sum + (entry.rating || 0),
    0
  );
  const averageRating = totalRating / (completedBooks.length || 1);

  const pagesRead = mockHistory.reduce(
    (sum, entry) => sum + entry.progress.currentPage,
    0
  );

  // Calculate reading streak
  const sortedEntries = [...mockHistory]
    .filter((entry) => entry.status === 'completed')
    .sort((a, b) => new Date(b.endDate!).getTime() - new Date(a.endDate!).getTime());

  let streak = 0;
  let currentDate = new Date();
  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.endDate!);
    const daysDiff = Math.floor(
      (currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysDiff <= 1) {
      streak++;
      currentDate = entryDate;
    } else {
      break;
    }
  }

  // Calculate favorite genres
  const genreCounts = mockHistory.reduce((counts, entry) => {
    entry.book.categories.forEach((category) => {
      counts[category] = (counts[category] || 0) + 1;
    });
    return counts;
  }, {} as Record<string, number>);

  const favoriteGenres = Object.entries(genreCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Calculate reading by month
  const monthCounts = new Array(12).fill(0);
  mockHistory.forEach((entry) => {
    if (entry.status === 'completed' && entry.endDate) {
      const month = new Date(entry.endDate).getMonth();
      monthCounts[month]++;
    }
  });

  const readingByMonth = monthCounts.map((count, index) => ({
    month: new Date(2024, index).toLocaleString('default', { month: 'short' }),
    count,
  }));

  return {
    totalBooksRead: completedBooks.length,
    booksThisYear: booksThisYear.length,
    booksThisMonth: booksThisMonth.length,
    averageRating,
    pagesRead,
    readingStreak: streak,
    favoriteGenres,
    readingByMonth,
  };
};

export const historyHandlers = [
  // GET /api/reading-history - List reading history
  http.get('/api/reading-history', () => {
    return HttpResponse.json({
      data: mockHistory,
      meta: {
        total: mockHistory.length,
        completed: mockHistory.filter((entry) => entry.status === 'completed').length,
        inProgress: mockHistory.filter((entry) => entry.status === 'in-progress').length,
        abandoned: mockHistory.filter((entry) => entry.status === 'abandoned').length,
      },
    });
  }),

  // GET /api/reading-history/:id - Get reading history entry
  http.get('/api/reading-history/:id', ({ params }) => {
    const entry = mockHistory.find((h) => h.id === params.id);
    if (!entry) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({ data: entry });
  }),

  // POST /api/reading-history - Create reading history entry
  http.post('/api/reading-history', async ({ request }) => {
    const data = await request.json() as CreateReadingHistoryRequest;
    const newEntry = createMockHistoryEntry({
      book: createMockBook({ id: data.bookId }),
      startDate: data.startDate,
      status: data.status,
      progress: {
        ...data.progress,
        lastReadAt: new Date().toISOString(),
      },
      tags: data.tags || [],
    });
    mockHistory.push(newEntry);
    return HttpResponse.json({ data: newEntry });
  }),

  // PUT /api/reading-history/:id - Update reading history entry
  http.put('/api/reading-history/:id', async ({ params, request }) => {
    const data = await request.json() as UpdateReadingHistoryRequest;
    const index = mockHistory.findIndex((h) => h.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    const updatedEntry = {
      ...mockHistory[index],
      ...(data.status && { status: data.status }),
      ...(data.endDate && { endDate: data.endDate }),
      ...(data.progress && {
        progress: {
          ...mockHistory[index].progress,
          ...data.progress,
          lastReadAt: new Date().toISOString(),
        },
      }),
      ...(data.rating !== undefined && { rating: data.rating }),
      ...(data.review !== undefined && { review: data.review }),
      ...(data.tags && { tags: data.tags }),
    };
    mockHistory[index] = updatedEntry;

    return HttpResponse.json({ data: updatedEntry });
  }),

  // DELETE /api/reading-history/:id - Delete reading history entry
  http.delete('/api/reading-history/:id', ({ params }) => {
    const index = mockHistory.findIndex((h) => h.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    mockHistory.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // GET /api/reading-history/stats - Get reading stats
  http.get('/api/reading-history/stats', () => {
    return HttpResponse.json({
      data: calculateReadingStats(),
    });
  }),

  // PUT /api/reading-history/:id/progress - Update reading progress
  http.put('/api/reading-history/:id/progress', async ({ params, request }) => {
    const data = await request.json() as { currentPage: number; notes?: string };
    const index = mockHistory.findIndex((h) => h.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    const updatedEntry = {
      ...mockHistory[index],
      progress: {
        ...mockHistory[index].progress,
        currentPage: data.currentPage,
        lastReadAt: new Date().toISOString(),
        ...(data.notes && { notes: data.notes }),
      },
    };
    mockHistory[index] = updatedEntry;

    return HttpResponse.json({ data: updatedEntry });
  }),

  // PUT /api/reading-history/:id/review - Add review
  http.put('/api/reading-history/:id/review', async ({ params, request }) => {
    const data = await request.json() as { rating: number; review: string };
    const index = mockHistory.findIndex((h) => h.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    const updatedEntry = {
      ...mockHistory[index],
      rating: data.rating,
      review: data.review,
    };
    mockHistory[index] = updatedEntry;

    return HttpResponse.json({ data: updatedEntry });
  }),

  // PUT /api/reading-history/:id/tags - Update tags
  http.put('/api/reading-history/:id/tags', async ({ params, request }) => {
    const data = await request.json() as { tags: string[] };
    const index = mockHistory.findIndex((h) => h.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    const updatedEntry = {
      ...mockHistory[index],
      tags: data.tags,
    };
    mockHistory[index] = updatedEntry;

    return HttpResponse.json({ data: updatedEntry });
  }),
];