import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReadingSession {
  id: string;
  bookId: string;
  startTime: string;
  endTime?: string;
  pagesRead: number;
  notes?: string;
}

interface ProgressStore {
  activeSession?: ReadingSession;
  sessions: ReadingSession[];
  startSession: (bookId: string, currentPage: number) => void;
  endSession: (pagesRead: number, notes?: string) => void;
  updateSessionNotes: (notes: string) => void;
  clearSessions: () => void;
  getSessionsForBook: (bookId: string) => ReadingSession[];
  getTotalPagesRead: (bookId: string) => number;
  getTotalReadingTime: (bookId: string) => number; // in minutes
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      sessions: [],

      startSession: (bookId, currentPage) => {
        if (get().activeSession) {
          // End current session if one exists
          get().endSession(currentPage);
        }

        const newSession: ReadingSession = {
          id: crypto.randomUUID(),
          bookId,
          startTime: new Date().toISOString(),
          pagesRead: 0,
        };

        set((state) => ({
          activeSession: newSession,
          sessions: [...state.sessions],
        }));
      },

      endSession: (pagesRead, notes) => {
        const { activeSession } = get();
        if (!activeSession) return;

        const completedSession: ReadingSession = {
          ...activeSession,
          endTime: new Date().toISOString(),
          pagesRead,
          notes,
        };

        set((state) => ({
          activeSession: undefined,
          sessions: [...state.sessions, completedSession],
        }));
      },

      updateSessionNotes: (notes) => {
        set((state) => ({
          activeSession: state.activeSession
            ? { ...state.activeSession, notes }
            : undefined,
        }));
      },

      clearSessions: () => {
        set({ sessions: [], activeSession: undefined });
      },

      getSessionsForBook: (bookId) => {
        const { sessions } = get();
        return sessions.filter((session) => session.bookId === bookId);
      },

      getTotalPagesRead: (bookId) => {
        const { sessions } = get();
        return sessions
          .filter((session) => session.bookId === bookId)
          .reduce((total, session) => total + session.pagesRead, 0);
      },

      getTotalReadingTime: (bookId) => {
        const { sessions } = get();
        return sessions
          .filter((session) => session.bookId === bookId && session.endTime)
          .reduce((total, session) => {
            const start = new Date(session.startTime);
            const end = new Date(session.endTime!);
            const minutes = Math.round(
              (end.getTime() - start.getTime()) / (1000 * 60)
            );
            return total + minutes;
          }, 0);
      },
    }),
    {
      name: 'reading-progress',
    }
  )
);

// Helper functions for time formatting
export const formatReadingTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};
