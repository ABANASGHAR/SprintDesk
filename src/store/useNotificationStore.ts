import { create } from 'zustand';
import type { AppNotification } from '../types/notification';

interface NotificationState {
  notifications: AppNotification[];
  isPopoverOpen: boolean;
  currentPage: number;
  pageSize: number;

  setNotifications: (notifs: AppNotification[]) => void;
  addNotification: (notif: AppNotification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setIsPopoverOpen: (open: boolean) => void;
  setCurrentPage: (page: number) => void;
  unreadCount: () => number;
}

const STORAGE_KEY = 'sprintdesk_notifications';

const loadPersistedNotifs = (): AppNotification[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const savePersistedNotifs = (notifs: AppNotification[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
  } catch {
    // ignore
  }
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: loadPersistedNotifs(),
  isPopoverOpen: false,
  currentPage: 1,
  pageSize: 5,

  setNotifications: (notifs) => {
    const existing = loadPersistedNotifs();
    const map = new Map<string, AppNotification>();
    [...existing, ...notifs].forEach((n) => map.set(n.id, n));
    const merged = Array.from(map.values());
    savePersistedNotifs(merged);
    set({ notifications: merged });
  },

  addNotification: (notif) => {
    const current = get().notifications;
    if (current.some((n) => n.id === notif.id)) return;
    const next = [notif, ...current];
    savePersistedNotifs(next);
    set({ notifications: next });
  },

  markAsRead: (id) => {
    const current = get().notifications;
    const next = current.map((n) => (n.id === id ? { ...n, read: true } : n));
    savePersistedNotifs(next);
    set({ notifications: next });
  },

  markAllAsRead: () => {
    const current = get().notifications;
    const next = current.map((n) => ({ ...n, read: true }));
    savePersistedNotifs(next);
    set({ notifications: next });
  },

  setIsPopoverOpen: (open) => set({ isPopoverOpen: open }),
  setCurrentPage: (page) => set({ currentPage: page }),

  unreadCount: () => {
    return get().notifications.filter((n) => !n.read).length;
  },
}));
