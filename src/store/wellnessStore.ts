import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WellnessNotification {
  id: 'blink-eye' | 'drink-water' | 'sleep-time' | 'posture-check' | '20-20-20';
  label: string;
  description: string;
  enabled: boolean;
  intervalMinutes?: number; // For interval-based notifications
  notificationTime?: number; // For time-based notifications (e.g., 23 for 11 PM)
  lastTriggered?: number;
}

export interface WellnessStore {
  notifications: WellnessNotification[];
  vibrationEnabled: boolean;
  soundEnabled: boolean;
  setNotificationEnabled: (id: WellnessNotification['id'], enabled: boolean) => void;
  setVibrationEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  updateNotificationInterval: (id: WellnessNotification['id'], minutes: number) => void;
  updateNotificationTime: (id: WellnessNotification['id'], hour: number) => void;
  markNotificationTriggered: (id: WellnessNotification['id']) => void;
  shouldTriggerNotification: (id: WellnessNotification['id']) => boolean;
}

const DEFAULT_WELLNESS_NOTIFICATIONS: WellnessNotification[] = [
  {
    id: 'blink-eye',
    label: 'Blink Eye',
    description: 'Remember to blink and rest your eyes',
    enabled: true,
    intervalMinutes: 30,
  },
  {
    id: 'drink-water',
    label: 'Drink Water',
    description: 'Stay hydrated - drink a glass of water',
    enabled: true,
    intervalMinutes: 45,
  },
  {
    id: 'sleep-time',
    label: 'Sleep Reminder',
    description: 'Get good sleep for better productivity',
    enabled: false,
    notificationTime: 23, // 11 PM (default, user can change)
  },
  {
    id: 'posture-check',
    label: 'Posture Check',
    description: 'Sit up straight and stretch your shoulders',
    enabled: true,
    intervalMinutes: 60,
  },
  {
    id: '20-20-20',
    label: '20-20-20 Rule',
    description: 'Look 20 feet away for 20 seconds every 20 minutes',
    enabled: true,
    intervalMinutes: 20,
  },
];

export const useWellnessStore = create<WellnessStore>()(
  persist(
    (set, get) => ({
      notifications: DEFAULT_WELLNESS_NOTIFICATIONS,
      vibrationEnabled: true,
      soundEnabled: true,

      setNotificationEnabled: (id, enabled) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, enabled } : n
          ),
        }));
      },

      setVibrationEnabled: (enabled) => {
        set({ vibrationEnabled: enabled });
      },

      setSoundEnabled: (enabled) => {
        set({ soundEnabled: enabled });
      },

      updateNotificationInterval: (id, minutes) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, intervalMinutes: minutes } : n
          ),
        }));
      },

      updateNotificationTime: (id, hour) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, notificationTime: hour } : n
          ),
        }));
      },

      markNotificationTriggered: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, lastTriggered: Date.now() } : n
          ),
        }));
      },

      shouldTriggerNotification: (id) => {
        const notification = get().notifications.find((n) => n.id === id);
        if (!notification || !notification.enabled) return false;

        // Handle time-based notifications (e.g., sleep reminder at 11 PM)
        if (notification.notificationTime !== undefined) {
          const now = new Date();
          const currentHour = now.getHours();
          
          // Check if current hour matches target hour
          if (currentHour === notification.notificationTime) {
            // Only trigger once per hour
            const lastTriggered = notification.lastTriggered || 0;
            const now_ms = Date.now();
            const oneHourMs = 60 * 60 * 1000;
            
            return now_ms - lastTriggered >= oneHourMs;
          }
          return false;
        }

        // Handle interval-based notifications
        if (notification.intervalMinutes !== undefined) {
          const lastTriggered = notification.lastTriggered || 0;
          const now = Date.now();
          const intervalMs = notification.intervalMinutes * 60 * 1000;
          
          return now - lastTriggered >= intervalMs;
        }

        return false;
      },
    }),
    { name: 'wellness', storage: createJSONStorage(() => AsyncStorage) }
  )
);
