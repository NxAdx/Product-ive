import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { scheduleWellnessReminders } from '../services/NotificationManager';

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
  _migrate: () => void;
}

const DEFAULT_WELLNESS_NOTIFICATIONS: WellnessNotification[] = [
  {
    id: 'blink-eye',
    label: 'Eye Rest',
    description: 'Reduces digital eye strain and fatigue.',
    enabled: true,
    intervalMinutes: 30,
  },
  {
    id: 'drink-water',
    label: 'Hydration',
    description: 'Improves cognitive focus and clarity.',
    enabled: true,
    intervalMinutes: 45,
  },
  {
    id: 'sleep-time',
    label: 'Circadian Reset',
    description: 'Aligns biological sleep-wake peaks for restorative rest.',
    enabled: false,
    notificationTime: 22, // 10 PM (default)
  },
  {
    id: 'posture-check',
    label: 'Posture Check',
    description: 'Stabilizes core and lung capacity.',
    enabled: true,
    intervalMinutes: 60,
  },
  {
    id: '20-20-20',
    label: '20-20-20 Rule',
    description: 'Reset your gaze: 20 feet away for 20 seconds.',
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

      // v4.0/4.1 Deep Scrub: Clean emojis, dashes, and legacy artifacts
      _migrate: () => {
        const current = get().notifications;
        const cleaned = current.map(n => {
          let label = n.label
            .replace(/[\u2700-\u27bf]|[\u1f300-\u1f64f]|[\u1f680-\u1f6ff]|[\u2600-\u26ff]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '')
            .replace(/^[- \s]+|[- \s]+$/g, '') // Remove leading/trailing dashes/spaces
            .replace(/--+/g, '') // Remove double dashes
            .trim();
          
          // If scrubbed label is empty or invalid, restore from defaults
          if (!label || label === '' || label === '--') {
            const defaultRitual = DEFAULT_WELLNESS_NOTIFICATIONS.find(d => d.id === n.id);
            label = defaultRitual ? defaultRitual.label : n.id;
          }

          return { ...n, label };
        });
        set({ notifications: cleaned });
      },

      setNotificationEnabled: async (id, enabled) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, enabled } : n
          ),
        }));
        // Sync with OS
        await scheduleWellnessReminders(get().notifications);
      },

      setVibrationEnabled: (enabled) => {
        set({ vibrationEnabled: enabled });
      },

      setSoundEnabled: (enabled) => {
        set({ soundEnabled: enabled });
      },

      updateNotificationInterval: async (id, minutes) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, intervalMinutes: minutes } : n
          ),
        }));
        // Sync with OS
        await scheduleWellnessReminders(get().notifications);
      },

      updateNotificationTime: async (id, hour) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, notificationTime: hour } : n
          ),
        }));
        // Sync with OS
        await scheduleWellnessReminders(get().notifications);
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
