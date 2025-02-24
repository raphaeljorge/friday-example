/** @vitest-environment jsdom */
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReservationList } from './index';
import type { Reservation, ReservationStatus } from '../../types';
import { renderWithProviders } from '@/test/utils';

const mockActiveReservation: Reservation = {
  id: '1',
  bookId: '1',
  userId: '1',
  status: 'pending' as ReservationStatus,
  reservationDate: '2024-01-01',
  pickupDate: '2024-01-02',
  returnDate: '2024-01-03',
  notifications: [],
  history: [],
};

const mockPastReservation: Reservation = {
  id: '2',
  bookId: '2',
  userId: '1',
  status: 'cancelled' as ReservationStatus,
  reservationDate: '2024-01-01',
  pickupDate: '2024-01-02',
  returnDate: '2024-01-03',
  notifications: [],
  history: [],
};

describe('ReservationList', () => {
  const mockOnCancelReservation = vi.fn();
  const mockOnUpdateReservation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders active and past reservations correctly', () => {
    renderWithProviders(
      <ReservationList
        reservations={[mockActiveReservation, mockPastReservation]}
        onCancelReservation={mockOnCancelReservation}
        onUpdateReservation={mockOnUpdateReservation}
      />
    );

    // Check section headers
    expect(screen.getByText('Active Reservations')).toBeInTheDocument();
    expect(screen.getByText('Reservation History')).toBeInTheDocument();

    // Check reservation counts
    expect(screen.getByText('1 active')).toBeInTheDocument();
    expect(screen.getByText('1 past')).toBeInTheDocument();

    // Check reservation details
    expect(screen.getAllByText('Pickup: 2024-01-02')).toHaveLength(2);
    expect(screen.getByText('Status: pending')).toBeInTheDocument();
    expect(screen.getByText('Status: cancelled')).toBeInTheDocument();
  });

  it('renders empty states when no reservations', () => {
    renderWithProviders(
      <ReservationList
        reservations={[]}
        onCancelReservation={mockOnCancelReservation}
        onUpdateReservation={mockOnUpdateReservation}
      />
    );

    expect(screen.getByText('No active reservations')).toBeInTheDocument();
    expect(screen.getByText('No past reservations')).toBeInTheDocument();
  });

  it('handles reservation cancellation', () => {
    renderWithProviders(
      <ReservationList
        reservations={[mockActiveReservation]}
        onCancelReservation={mockOnCancelReservation}
        onUpdateReservation={mockOnUpdateReservation}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnCancelReservation).toHaveBeenCalledWith(mockActiveReservation.id);
  });

  it('handles reservation confirmation', () => {
    renderWithProviders(
      <ReservationList
        reservations={[mockActiveReservation]}
        onCancelReservation={mockOnCancelReservation}
        onUpdateReservation={mockOnUpdateReservation}
      />
    );

    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);

    expect(mockOnUpdateReservation).toHaveBeenCalledWith(mockActiveReservation.id, 'confirmed');
  });

  it('displays reservation notes when available', () => {
    const reservationWithNotes = {
      ...mockActiveReservation,
      notes: 'Test notes',
    };

    renderWithProviders(
      <ReservationList
        reservations={[reservationWithNotes]}
        onCancelReservation={mockOnCancelReservation}
        onUpdateReservation={mockOnUpdateReservation}
      />
    );

    expect(screen.getByText('Notes: Test notes')).toBeInTheDocument();
  });
});