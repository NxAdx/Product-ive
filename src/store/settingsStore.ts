import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SettingsStore {
  // Notifications
  notificationsEnabled: boolean;
  notificationTime: string; // HH:MM format
  streakReminders: boolean;

  // In-App Updater
  autoCheckUpdates: boolean;
  lastUpdateCheckDate?: string;

  // Preferences
  soundEnabled: boolean;
  hapicsEnabled: boolean;

  setNotificationsEnabled: (enabled: boolean) => void;
  setNotificationTime: (time: string) => void;
  setStreakReminders: (enabled: boolean) => void;
  setAutoCheckUpdates: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setHapicsEnabled: (enabled: boolean) => void;
  setLastUpdateCheckDate: (date: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      notificationsEnabled: true,
      notificationTime: '09:00',
      streakReminders: true,
      autoCheckUpdates: true,
      soundEnabled: true,
      hapicsEnabled: true,

      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setNotificationTime: (time) => set({ notificationTime: time }),
      setStreakReminders: (enabled) => set({ streakReminders: enabled }),
      setAutoCheckUpdates: (enabled) => set({ autoCheckUpdates: enabled }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setHapicsEnabled: (enabled) => set({ hapicsEnabled: enabled }),
      setLastUpdateCheckDate: (date) => set({ lastUpdateCheckDate: date }),
    }),
    { name: 'settings', storage: createJSONStorage(() => AsyncStorage) }
  )
);
