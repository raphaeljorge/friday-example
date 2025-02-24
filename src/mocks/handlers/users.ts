import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'
import type { User, ReadingHistoryItem } from '../../features/users/types'

// Create mock user
const mockUser: User = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  preferences: {
    favoriteCategories: ['Fiction', 'Science', 'Technology'],
    notificationSettings: {
      email: true,
      push: true
    }
  }
}

// Create mock reading history
const mockReadingHistory: ReadingHistoryItem[] = Array.from({ length: 5 }, () => ({
  bookId: faker.string.uuid(),
  startDate: faker.date.past().toISOString(),
  endDate: faker.helpers.maybe(() => faker.date.recent().toISOString()),
  status: faker.helpers.arrayElement(['completed', 'in-progress', 'abandoned'])
}))

export const userHandlers = [
  // GET /api/user/profile - Get user profile
  http.get('/api/user/profile', () => {
    return HttpResponse.json({
      data: mockUser
    })
  }),

  // PUT /api/user/profile - Update profile
  http.put('/api/user/profile', async ({ request }) => {
    const updates = await request.json()
    Object.assign(mockUser, updates)
    
    return HttpResponse.json({
      data: mockUser
    })
  }),

  // GET /api/user/history - Get reading history
  http.get('/api/user/history', () => {
    return HttpResponse.json({
      data: mockReadingHistory
    })
  })
]