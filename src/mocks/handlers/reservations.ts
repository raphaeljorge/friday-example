import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import type {
  Reservation,
  ReservationStatus,
  NotificationType,
  RecurrencePattern,
  CreateReservationRequest,
  UpdateReservationRequest,
  ReservationHistoryEntry,
} from '@/features/reservations/types';
import {
  validateCreateReservation,
  validateUpdateReservation,
} from '@/features/reservations/utils/validation';

// Create mock notification preferences
const createMockNotificationPreferences = () =>
  (
    [
      'confirmation',
      'reminder',
      'overdue',
      'cancellation',
    ] as NotificationType[]
  ).map((type) => ({
    type,
    email: faker.datatype.boolean(),
    push: faker.datatype.boolean(),
  }));

// Create mock history entry
const createMockHistoryEntry = (
  status: ReservationStatus,
  note?: string
): ReservationHistoryEntry => ({
  timestamp: faker.date.recent().toISOString(),
  status,
  note: note ?? faker.helpers.maybe(() => faker.lorem.sentence()),
});

// Create mock reservation
const createMockReservation = (
  override?: Partial<Reservation>
): Reservation => ({
  id: faker.string.uuid(),
  bookId: faker.string.uuid(),
  userId: faker.string.uuid(),
  status: faker.helpers.arrayElement([
    'pending',
    'confirmed',
    'cancelled',
    'completed',
    'overdue',
  ]) as ReservationStatus,
  reservationDate: faker.date.recent().toISOString(),
  pickupDate: faker.date.soon().toISOString(),
  returnDate: faker.date.future().toISOString(),
  notes: faker.helpers.maybe(() => faker.lorem.sentence()),
  waitlistPosition: faker.helpers.maybe(() =>
    faker.number.int({ min: 1, max: 10 })
  ),
  notifications: createMockNotificationPreferences(),
  recurrence: faker.helpers.maybe(() => ({
    pattern: faker.helpers.arrayElement([
      'weekly',
      'biweekly',
      'monthly',
    ]) as RecurrencePattern,
    endDate: faker.date.future().toISOString(),
  })),
  history: [
    createMockHistoryEntry('pending'),
    ...faker.helpers.multiple(
      () =>
        createMockHistoryEntry(
          faker.helpers.arrayElement([
            'confirmed',
            'cancelled',
            'completed',
            'overdue',
          ]) as ReservationStatus
        ),
      {
        count: { min: 1, max: 3 },
      }
    ),
  ],
  ...override,
});

// Create mock reservations
const mockReservations: Reservation[] = Array.from({ length: 10 }, () =>
  createMockReservation()
);

// Calculate waitlist position and estimated availability
const calculateWaitlistEstimate = (position: number) => {
  const averageLoanDays = 14;
  const estimatedDays = position * averageLoanDays;
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + estimatedDays);
  return estimatedDate.toISOString();
};

export const reservationHandlers = [
  // GET /api/reservations - List reservations
  http.get('/api/reservations', () => {
    return HttpResponse.json({
      data: mockReservations,
      meta: {
        total: mockReservations.length,
        waitlisted: mockReservations.filter((r) => r.waitlistPosition).length,
        overdue: mockReservations.filter((r) => r.status === 'overdue').length,
      },
    });
  }),

  // GET /api/reservations/:id - Get reservation details
  http.get('/api/reservations/:id', ({ params }) => {
    const reservation = mockReservations.find((r) => r.id === params.id);
    if (!reservation) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({ data: reservation });
  }),

  // POST /api/reservations - Create reservation
  http.post('/api/reservations', async ({ request }) => {
    const data = (await request.json()) as CreateReservationRequest;

    // Validate request
    const errors = validateCreateReservation(data);
    if (errors.length > 0) {
      return HttpResponse.json({ errors }, { status: 400 });
    }

    const newReservation = createMockReservation({
      bookId: data.bookId,
      pickupDate: data.pickupDate,
      returnDate: data.returnDate,
      notes: data.notes,
      status: 'pending',
      reservationDate: new Date().toISOString(),
      notifications: data.notifications || createMockNotificationPreferences(),
      recurrence: data.recurrence,
      history: [createMockHistoryEntry('pending')],
    });
    mockReservations.push(newReservation);

    return HttpResponse.json({ data: newReservation });
  }),

  // PUT /api/reservations/:id - Update reservation
  http.put('/api/reservations/:id', async ({ params, request }) => {
    const data = (await request.json()) as UpdateReservationRequest;

    // Validate request
    const errors = validateUpdateReservation(data);
    if (errors.length > 0) {
      return HttpResponse.json({ errors }, { status: 400 });
    }

    const index = mockReservations.findIndex((r) => r.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    const updatedReservation = {
      ...mockReservations[index],
      ...(data.status && { status: data.status }),
      ...(data.pickupDate && { pickupDate: data.pickupDate }),
      ...(data.returnDate && { returnDate: data.returnDate }),
      ...(data.notes !== undefined && { notes: data.notes }),
      history: [
        ...mockReservations[index].history,
        createMockHistoryEntry(
          data.status || mockReservations[index].status,
          data.notes
        ),
      ],
    };
    mockReservations[index] = updatedReservation;

    return HttpResponse.json({ data: updatedReservation });
  }),

  // DELETE /api/reservations/:id - Cancel reservation
  http.delete('/api/reservations/:id', ({ params }) => {
    const index = mockReservations.findIndex((r) => r.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    mockReservations[index] = {
      ...mockReservations[index],
      status: 'cancelled',
      history: [
        ...mockReservations[index].history,
        createMockHistoryEntry('cancelled'),
      ],
    };

    return new HttpResponse(null, { status: 204 });
  }),

  // GET /api/reservations/:id/history - Get reservation history
  http.get('/api/reservations/:id/history', ({ params }) => {
    const reservation = mockReservations.find((r) => r.id === params.id);
    if (!reservation) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({ data: reservation });
  }),

  // GET /api/books/:id/waitlist - Get waitlist position
  http.get('/api/books/:id/waitlist', () => {
    const position = faker.number.int({ min: 1, max: 10 });
    return HttpResponse.json({
      data: {
        position,
        estimatedAvailability: calculateWaitlistEstimate(position),
      },
    });
  }),

  // POST /api/books/:id/waitlist - Join waitlist
  http.post('/api/books/:id/waitlist', () => {
    const position = faker.number.int({ min: 1, max: 10 });
    return HttpResponse.json({
      data: {
        position,
        estimatedAvailability: calculateWaitlistEstimate(position),
      },
    });
  }),

  // DELETE /api/books/:id/waitlist - Leave waitlist
  http.delete('/api/books/:id/waitlist', () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // PUT /api/reservations/:id/notifications - Update notification preferences
  http.put(
    '/api/reservations/:id/notifications',
    async ({ params, request }) => {
      const { notifications } = (await request.json()) as {
        notifications: Reservation['notifications'];
      };
      const index = mockReservations.findIndex((r) => r.id === params.id);
      if (index === -1) {
        return new HttpResponse(null, { status: 404 });
      }

      mockReservations[index] = {
        ...mockReservations[index],
        notifications,
      };

      return HttpResponse.json({ data: mockReservations[index] });
    }
  ),

  // POST /api/reservations/recurring - Create recurring reservation
  http.post('/api/reservations/recurring', async ({ request }) => {
    const data = (await request.json()) as CreateReservationRequest;

    // Validate request
    const errors = validateCreateReservation(data);
    if (errors.length > 0) {
      return HttpResponse.json({ errors }, { status: 400 });
    }

    const reservations = Array.from({ length: 3 }, () =>
      createMockReservation({
        bookId: data.bookId,
        pickupDate: data.pickupDate,
        returnDate: data.returnDate,
        notes: data.notes,
        status: 'pending',
        reservationDate: new Date().toISOString(),
        notifications:
          data.notifications || createMockNotificationPreferences(),
        recurrence: data.recurrence,
        history: [createMockHistoryEntry('pending')],
      })
    );
    mockReservations.push(...reservations);

    return HttpResponse.json({ data: reservations });
  }),

  // GET /api/reservations/overdue - Get overdue reservations
  http.get('/api/reservations/overdue', () => {
    const overdueReservations = mockReservations.filter(
      (r) => r.status === 'overdue'
    );
    return HttpResponse.json({
      data: overdueReservations,
      meta: {
        total: overdueReservations.length,
      },
    });
  }),

  // PUT /api/reservations/:id/complete - Mark reservation as complete
  http.put('/api/reservations/:id/complete', async ({ params, request }) => {
    const { returnDate } = (await request.json()) as { returnDate: string };
    const index = mockReservations.findIndex((r) => r.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    const updatedReservation = {
      ...mockReservations[index],
      status: 'completed' as const,
      returnDate,
      history: [
        ...mockReservations[index].history,
        createMockHistoryEntry(
          'completed',
          `Returned on ${new Date(returnDate).toLocaleDateString()}`
        ),
      ],
    };
    mockReservations[index] = updatedReservation;

    return HttpResponse.json({ data: updatedReservation });
  }),

  // PUT /api/reservations/:id/extend - Extend reservation
  http.put('/api/reservations/:id/extend', async ({ params, request }) => {
    const { returnDate } = (await request.json()) as { returnDate: string };
    const index = mockReservations.findIndex((r) => r.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    const updatedReservation = {
      ...mockReservations[index],
      returnDate,
      history: [
        ...mockReservations[index].history,
        createMockHistoryEntry(
          mockReservations[index].status,
          `Extended return date to ${new Date(returnDate).toLocaleDateString()}`
        ),
      ],
    };
    mockReservations[index] = updatedReservation;

    return HttpResponse.json({ data: updatedReservation });
  }),
];
