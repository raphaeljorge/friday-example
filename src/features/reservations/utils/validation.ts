import type { CreateReservationRequest, UpdateReservationRequest, ReservationValidationError } from '../types';

const MAX_RESERVATION_DAYS = 30;
const MIN_PICKUP_DAYS = 1;
const MAX_ADVANCE_DAYS = 90;

export function validateReservationDates(
  pickupDate: string,
  returnDate: string
): ReservationValidationError[] {
  const errors: ReservationValidationError[] = [];
  const now = new Date();
  const pickup = new Date(pickupDate);
  const return_ = new Date(returnDate);

  // Validate pickup date
  const daysUntilPickup = Math.floor((pickup.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntilPickup < MIN_PICKUP_DAYS) {
    errors.push({
      field: 'pickupDate',
      message: `Pickup date must be at least ${MIN_PICKUP_DAYS} day from now`,
    });
  }
  if (daysUntilPickup > MAX_ADVANCE_DAYS) {
    errors.push({
      field: 'pickupDate',
      message: `Cannot reserve more than ${MAX_ADVANCE_DAYS} days in advance`,
    });
  }

  // Validate return date
  if (return_ <= pickup) {
    errors.push({
      field: 'returnDate',
      message: 'Return date must be after pickup date',
    });
  }

  const reservationDays = Math.floor((return_.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
  if (reservationDays > MAX_RESERVATION_DAYS) {
    errors.push({
      field: 'returnDate',
      message: `Maximum reservation period is ${MAX_RESERVATION_DAYS} days`,
    });
  }

  return errors;
}

export function validateCreateReservation(
  request: CreateReservationRequest
): ReservationValidationError[] {
  const errors: ReservationValidationError[] = [];

  // Validate required fields
  if (!request.bookId) {
    errors.push({
      field: 'bookId',
      message: 'Book ID is required',
    });
  }

  if (!request.pickupDate) {
    errors.push({
      field: 'pickupDate',
      message: 'Pickup date is required',
    });
  }

  if (!request.returnDate) {
    errors.push({
      field: 'returnDate',
      message: 'Return date is required',
    });
  }

  // Validate dates if both are provided
  if (request.pickupDate && request.returnDate) {
    errors.push(...validateReservationDates(request.pickupDate, request.returnDate));
  }

  // Validate recurrence
  if (request.recurrence) {
    const recurrenceEnd = new Date(request.recurrence.endDate);
    const pickup = new Date(request.pickupDate);
    if (recurrenceEnd <= pickup) {
      errors.push({
        field: 'recurrence.endDate',
        message: 'Recurrence end date must be after pickup date',
      });
    }

    const daysUntilEnd = Math.floor(
      (recurrenceEnd.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilEnd > MAX_ADVANCE_DAYS) {
      errors.push({
        field: 'recurrence.endDate',
        message: `Recurring reservations cannot extend beyond ${MAX_ADVANCE_DAYS} days`,
      });
    }
  }

  return errors;
}

export function validateUpdateReservation(
  request: UpdateReservationRequest
): ReservationValidationError[] {
  const errors: ReservationValidationError[] = [];

  // Validate dates if both are provided
  if (request.pickupDate && request.returnDate) {
    errors.push(...validateReservationDates(request.pickupDate, request.returnDate));
  }

  // Validate status transitions
  if (request.status === 'completed' && !request.returnDate) {
    errors.push({
      field: 'status',
      message: 'Return date is required to complete a reservation',
    });
  }

  return errors;
}

export function calculateWaitlistPosition(
  currentPosition: number,
  averageLoanDays: number
): { estimatedDays: number; estimatedDate: string } {
  const estimatedDays = currentPosition * averageLoanDays;
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + estimatedDays);

  return {
    estimatedDays,
    estimatedDate: estimatedDate.toISOString(),
  };
}