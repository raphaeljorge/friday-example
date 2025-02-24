import { apiClient } from '@/lib/api/client';
import type {
  Reservation,
  ReservationResponse,
  ReservationsResponse,
  CreateReservationRequest,
  UpdateReservationRequest,
  WaitlistResponse,
  ReservationValidationError,
} from '../types';
import { validateCreateReservation, validateUpdateReservation } from '../utils/validation';

class ReservationError extends Error {
  constructor(public errors: ReservationValidationError[]) {
    super('Reservation validation failed');
    this.name = 'ReservationError';
  }
}

export async function getReservations(): Promise<ReservationsResponse> {
  const response = await apiClient.get<ReservationsResponse>('/reservations');
  return response.data;
}

export async function getReservation(id: string): Promise<ReservationResponse> {
  const response = await apiClient.get<ReservationResponse>(`/reservations/${id}`);
  return response.data;
}

export async function createReservation(
  request: CreateReservationRequest
): Promise<ReservationResponse> {
  // Validate request
  const errors = validateCreateReservation(request);
  if (errors.length > 0) {
    throw new ReservationError(errors);
  }

  const response = await apiClient.post<ReservationResponse>('/reservations', request);
  return response.data;
}

export async function updateReservation(
  id: string,
  request: UpdateReservationRequest
): Promise<ReservationResponse> {
  // Validate request
  const errors = validateUpdateReservation(request);
  if (errors.length > 0) {
    throw new ReservationError(errors);
  }

  const response = await apiClient.put<ReservationResponse>(`/reservations/${id}`, request);
  return response.data;
}

export async function cancelReservation(id: string): Promise<void> {
  await apiClient.delete(`/reservations/${id}`);
}

export async function getReservationHistory(id: string): Promise<ReservationResponse> {
  const response = await apiClient.get<ReservationResponse>(`/reservations/${id}/history`);
  return response.data;
}

export async function getWaitlistPosition(bookId: string): Promise<WaitlistResponse> {
  const response = await apiClient.get<WaitlistResponse>(`/books/${bookId}/waitlist`);
  return response.data;
}

export async function joinWaitlist(bookId: string): Promise<WaitlistResponse> {
  const response = await apiClient.post<WaitlistResponse>(`/books/${bookId}/waitlist`);
  return response.data;
}

export async function leaveWaitlist(bookId: string): Promise<void> {
  await apiClient.delete(`/books/${bookId}/waitlist`);
}

export async function updateNotificationPreferences(
  id: string,
  notifications: Reservation['notifications']
): Promise<ReservationResponse> {
  const response = await apiClient.put<ReservationResponse>(
    `/reservations/${id}/notifications`,
    { notifications }
  );
  return response.data;
}

export async function createRecurringReservation(
  request: CreateReservationRequest
): Promise<ReservationResponse[]> {
  // Validate request
  const errors = validateCreateReservation(request);
  if (errors.length > 0) {
    throw new ReservationError(errors);
  }

  const response = await apiClient.post<{ data: ReservationResponse[] }>(
    '/reservations/recurring',
    request
  );
  return response.data.data;
}

export async function getOverdueReservations(): Promise<ReservationsResponse> {
  const response = await apiClient.get<ReservationsResponse>('/reservations/overdue');
  return response.data;
}

export async function markReservationComplete(
  id: string,
  returnDate: string
): Promise<ReservationResponse> {
  const response = await apiClient.put<ReservationResponse>(`/reservations/${id}/complete`, {
    returnDate,
  });
  return response.data;
}

export async function extendReservation(
  id: string,
  newReturnDate: string
): Promise<ReservationResponse> {
  const response = await apiClient.put<ReservationResponse>(`/reservations/${id}/extend`, {
    returnDate: newReturnDate,
  });
  return response.data;
}