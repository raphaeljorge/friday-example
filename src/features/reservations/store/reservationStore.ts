import { create } from 'zustand';

interface ReservationStore {
  selectedDate: string | null;
  notes: string;
  setSelectedDate: (date: string | null) => void;
  setNotes: (notes: string) => void;
  reset: () => void;
}

export const useReservationStore = create<ReservationStore>((set) => ({
  selectedDate: null,
  notes: '',
  setSelectedDate: (date) => set({ selectedDate: date }),
  setNotes: (notes) => set({ notes }),
  reset: () => set({ selectedDate: null, notes: '' }),
}));
