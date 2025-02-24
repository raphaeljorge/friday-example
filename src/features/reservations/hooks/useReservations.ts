import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getReservations,
  getReservation,
  createReservation,
  updateReservation,
  cancelReservation,
  getReservationHistory,
  getWaitlistPosition,
  joinWaitlist,
  leaveWaitlist,
  updateNotificationPreferences,
  createRecurringReservation,
  getOverdueReservations,
  markReservationComplete,
  extendReservation,
} from '../api/reservations';
import type { Reservation, UpdateReservationRequest } from '../types';

const reservationKeys = {
  all: ['reservations'] as const,
  lists: () => [...reservationKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...reservationKeys.lists(), filters] as const,
  details: () => [...reservationKeys.all, 'detail'] as const,
  detail: (id: string) => [...reservationKeys.details(), id] as const,
  history: (id: string) => [...reservationKeys.detail(id), 'history'] as const,
  waitlist: (bookId: string) => [...reservationKeys.all, 'waitlist', bookId] as const,
  overdue: () => [...reservationKeys.all, 'overdue'] as const,
};

export function useReservations() {
  return useQuery({
    queryKey: reservationKeys.lists(),
    queryFn: getReservations,
  });
}

export function useReservation(id: string) {
  return useQuery({
    queryKey: reservationKeys.detail(id),
    queryFn: () => getReservation(id),
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
    },
  });
}

export function useCreateRecurringReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRecurringReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
    },
  });
}

export function useUpdateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateReservationRequest) =>
      updateReservation(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
    },
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
    },
  });
}

export function useReservationHistory(id: string) {
  return useQuery({
    queryKey: reservationKeys.history(id),
    queryFn: () => getReservationHistory(id),
  });
}

export function useWaitlistPosition(bookId: string) {
  return useQuery({
    queryKey: reservationKeys.waitlist(bookId),
    queryFn: () => getWaitlistPosition(bookId),
  });
}

export function useJoinWaitlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinWaitlist,
    onSuccess: (_, bookId) => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.waitlist(bookId) });
    },
  });
}

export function useLeaveWaitlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveWaitlist,
    onSuccess: (_, bookId) => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.waitlist(bookId) });
    },
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      notifications,
    }: {
      id: string;
      notifications: Reservation['notifications'];
    }) => updateNotificationPreferences(id, notifications),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.detail(id) });
    },
  });
}

export function useOverdueReservations() {
  return useQuery({
    queryKey: reservationKeys.overdue(),
    queryFn: getOverdueReservations,
  });
}

export function useMarkReservationComplete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, returnDate }: { id: string; returnDate: string }) =>
      markReservationComplete(id, returnDate),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
    },
  });
}

export function useExtendReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newReturnDate }: { id: string; newReturnDate: string }) =>
      extendReservation(id, newReturnDate),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
    },
  });
}