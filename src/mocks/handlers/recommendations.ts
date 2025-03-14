import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import type {
  Recommendation,
  RecommendationGroup,
  RecommendationSource,
  RecommendationReason,
  RecommendationPreferences,
} from '@/features/recommendations/types';
import { createMockBook } from './books';

// Create mock recommendation
const createMockRecommendation = (
  source: RecommendationSource,
  reason: RecommendationReason
): Recommendation => ({
  id: faker.string.uuid(),
  book: createMockBook(),
  source,
  reason,
  score: Number(faker.number.float({ min: 0.5, max: 1 }).toFixed(2)),
  timestamp: faker.date.recent().toISOString(),
});

// Create mock recommendation groups
const createMockRecommendationGroups = (): RecommendationGroup[] => [
  {
    source: 'reading-history',
    title: 'Based on Your Reading History',
    description: 'Books similar to ones you have enjoyed',
    recommendations: Array.from(
      { length: faker.number.int({ min: 3, max: 8 }) },
      () => createMockRecommendation('reading-history', 'based-on-history')
    ),
  },
  {
    source: 'favorite-genres',
    title: 'From Your Favorite Genres',
    description: 'Top picks in genres you love',
    recommendations: Array.from(
      { length: faker.number.int({ min: 3, max: 8 }) },
      () => createMockRecommendation('favorite-genres', 'similar-genre')
    ),
  },
  {
    source: 'similar-books',
    title: 'Similar Books',
    description: 'Books similar to ones in your shelves',
    recommendations: Array.from(
      { length: faker.number.int({ min: 3, max: 8 }) },
      () => createMockRecommendation('similar-books', 'similar-author')
    ),
  },
  {
    source: 'popular',
    title: 'Popular in Your Categories',
    description: 'Trending in your preferred categories',
    recommendations: Array.from(
      { length: faker.number.int({ min: 3, max: 8 }) },
      () => createMockRecommendation('popular', 'popular-in-category')
    ),
  },
  {
    source: 'trending',
    title: 'Trending Now',
    description: 'Books gaining popularity',
    recommendations: Array.from(
      { length: faker.number.int({ min: 3, max: 8 }) },
      () => createMockRecommendation('trending', 'trending-now')
    ),
  },
  {
    source: 'new-releases',
    title: 'New Releases',
    description: 'Recently added to the library',
    recommendations: Array.from(
      { length: faker.number.int({ min: 3, max: 8 }) },
      () => createMockRecommendation('new-releases', 'new-in-category')
    ),
  },
];

// Mock preferences
let mockPreferences: RecommendationPreferences = {
  enabledSources: [
    'reading-history',
    'favorite-genres',
    'similar-books',
    'popular',
    'trending',
    'new-releases',
  ],
  minScore: 0.5,
  maxRecommendations: 10,
  excludedCategories: [],
  excludedAuthors: [],
};

// Mock recommendations storage
let mockRecommendations = createMockRecommendationGroups();

export const recommendationHandlers = [
  // GET /api/recommendations - Get recommendations
  http.get('/api/recommendations', () => {
    const filteredGroups = mockRecommendations
      .filter((group) => mockPreferences.enabledSources.includes(group.source))
      .map((group) => ({
        source: group.source,
        title: group.title,
        description: group.description,
        recommendations: group.recommendations
          .filter((rec) => {
            // Apply preference filters
            if (rec.score < mockPreferences.minScore) return false;
            if (
              mockPreferences.excludedCategories.some((cat) =>
                rec.book.categories.includes(cat)
              )
            )
              return false;
            if (mockPreferences.excludedAuthors.includes(rec.book.author))
              return false;
            return true;
          })
          .slice(0, mockPreferences.maxRecommendations),
      }));

    return HttpResponse.json({
      data: filteredGroups,
    });
  }),

  // GET /api/books/:id/similar - Get similar books
  http.get('/api/books/:id/similar', () => {
    const recommendations = Array.from(
      { length: faker.number.int({ min: 3, max: 8 }) },
      () => createMockRecommendation('similar-books', 'similar-author')
    );

    return HttpResponse.json({
      data: recommendations,
    });
  }),

  // GET /api/recommendations/preferences - Get preferences
  http.get('/api/recommendations/preferences', () => {
    return HttpResponse.json({
      data: mockPreferences,
    });
  }),

  // PUT /api/recommendations/preferences - Update preferences
  http.put('/api/recommendations/preferences', async ({ request }) => {
    const updates =
      (await request.json()) as Partial<RecommendationPreferences>;
    mockPreferences = {
      ...mockPreferences,
      ...updates,
    };

    return HttpResponse.json({
      data: mockPreferences,
    });
  }),

  // POST /api/recommendations/:id/dismiss - Dismiss recommendation
  http.post('/api/recommendations/:id/dismiss', ({ params }) => {
    // Remove recommendation from all groups
    mockRecommendations = mockRecommendations.map((group) => ({
      source: group.source,
      title: group.title,
      description: group.description,
      recommendations: group.recommendations.filter(
        (rec) => rec.id !== params.id
      ),
    }));

    return new HttpResponse(null, { status: 204 });
  }),

  // POST /api/recommendations/refresh - Refresh recommendations
  http.post('/api/recommendations/refresh', () => {
    mockRecommendations = createMockRecommendationGroups();
    return HttpResponse.json({
      data: mockRecommendations,
    });
  }),

  // GET /api/recommendations/trending - Get trending books
  http.get('/api/recommendations/trending', () => {
    const recommendations = Array.from(
      { length: faker.number.int({ min: 5, max: 10 }) },
      () => createMockRecommendation('trending', 'trending-now')
    );

    return HttpResponse.json({
      data: recommendations,
    });
  }),

  // GET /api/recommendations/new-releases - Get new releases
  http.get('/api/recommendations/new-releases', () => {
    const recommendations = Array.from(
      { length: faker.number.int({ min: 5, max: 10 }) },
      () => createMockRecommendation('new-releases', 'new-in-category')
    );

    return HttpResponse.json({
      data: recommendations,
    });
  }),

  // GET /api/recommendations/popular/:category - Get popular in category
  http.get('/api/recommendations/popular/:category', () => {
    const recommendations = Array.from(
      { length: faker.number.int({ min: 5, max: 10 }) },
      () => createMockRecommendation('popular', 'popular-in-category')
    );

    return HttpResponse.json({
      data: recommendations,
    });
  }),
];
