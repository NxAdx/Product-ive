import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WellnessNotification {
  id: 'blink-eye' | 'drink-water' | 'sleep-time' | 'posture-check' | '20-20-20';
  label: string;
  description: string;
  enabled: boolean;
  intervalMinutes: number;
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
  markNotificationTriggered: (id: WellnessNotification['id']) => void;
  shouldTriggerNotification: (id: WellnessNotification['id']) => boolean;
}

const DEFAULT_WELLNESS_NOTIFICATIONS: WellnessNotification[] = [
  {
    id: 'blink-eye',
    label: '👀 Blink Eye',
    description: 'Remember to blink and rest your eyes',
    enabled: true,
    intervalMinutes: 30,
  },
  {
    id: 'drink-water',
    label: '💧 Drink Water',
    description: 'Stay hydrated - drink a glass of water',
    enabled: true,
    intervalMinutes: 45,
  },
  {
    id: 'sleep-time',
    label: '😴 Sleep Reminder',
    description: 'It might be time to get some rest',
    enabled: false,
    intervalMinutes: 480, // 8 hours
  },
  {
    id: 'posture-check',
    label: '🧍 Posture Check',
    description: 'Sit up straight and stretch your shoulders',
    enabled: true,
    intervalMinutes: 60,
  },
  {
    id: '20-20-20',
    label: '👓 20-20-20 Rule',
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

        const lastTriggered = notification.lastTriggered || 0;
        const now = Date.now();
        const intervalMs = notification.intervalMinutes * 60 * 1000;

        return now - lastTriggered >= intervalMs;
      },
    }),
    { name: 'wellness', storage: createJSONStorage(() => AsyncStorage) }
  )
);
