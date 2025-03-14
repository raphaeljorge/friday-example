import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NotificationType } from '../types';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  reservationId: string;
  timestamp: string;
  read: boolean;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (notification) => {
        const newNotification: Notification = {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          read: false,
          ...notification,
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },

      markAsRead: (id) =>
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          if (!notification || notification.read) return state;

          return {
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
            unreadCount: state.unreadCount - 1,
          };
        }),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      clearNotifications: () =>
        set({
          notifications: [],
          unreadCount: 0,
        }),
    }),
    {
      name: 'reservation-notifications',
    }
  )
);

// Helper functions for creating notification messages
export const createNotificationMessage = {
  confirmation: (title: string) =>
    `Your reservation for "${title}" has been confirmed.`,
  reminder: (title: string, daysUntil: number) =>
    `Reminder: Your reservation for "${title}" ${
      daysUntil === 0
        ? 'is ready for pickup today'
        : `will be ready for pickup in ${daysUntil} days`
    }.`,
  overdue: (title: string, daysOverdue: number) =>
    `Your reservation for "${title}" is ${daysOverdue} ${
      daysOverdue === 1 ? 'day' : 'days'
    } overdue.`,
  cancellation: (title: string) =>
    `Your reservation for "${title}" has been cancelled.`,
  waitlist: (title: string, position: number) =>
    `You are now #${position} on the waitlist for "${title}".`,
  available: (title: string) =>
    `A copy of "${title}" is now available for your waitlisted reservation.`,
};
