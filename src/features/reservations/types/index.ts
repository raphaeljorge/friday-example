export type ReservationStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'overdue';
export type NotificationType =
  | 'confirmation'
  | 'reminder'
  | 'overdue'
  | 'cancellation';
export type RecurrencePattern = 'weekly' | 'biweekly' | 'monthly';

export interface Reservation {
  id: string;
  bookId: string;
  userId: string;
  status: ReservationStatus;
  reservationDate: string;
  pickupDate: string;
  returnDate: string;
  notes?: string;
  waitlistPosition?: number;
  notifications: NotificationPreference[];
  recurrence?: {
    pattern: RecurrencePattern;
    endDate: string;
  };
  history: ReservationHistoryEntry[];
}

export interface NotificationPreference {
  type: NotificationType;
  email: boolean;
  push: boolean;
}

export interface ReservationHistoryEntry {
  timestamp: string;
  status: ReservationStatus;
  note?: string;
}

export interface ReservationResponse {
  data: Reservation;
}

export interface ReservationsResponse {
  data: Reservation[];
  meta: {
    total: number;
    waitlisted: number;
    overdue: number;
  };
}

export interface CreateReservationRequest {
  bookId: string;
  pickupDate: string;
  returnDate: string;
  notes?: string;
  notifications?: NotificationPreference[];
  recurrence?: {
    pattern: RecurrencePattern;
    endDate: string;
  };
}

export interface UpdateReservationRequest {
  status?: ReservationStatus;
  pickupDate?: string;
  returnDate?: string;
  notes?: string;
  notifications?: NotificationPreference[];
}

export interface ReservationValidationError {
  field: string;
  message: string;
}

export interface WaitlistEntry {
  position: number;
  estimatedAvailability?: string;
}

export interface WaitlistResponse {
  data: WaitlistEntry;
}
