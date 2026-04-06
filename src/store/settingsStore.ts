import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SettingsStore {
  // Personalization
  userName: string;
  
  // Notifications
  notificationsEnabled: boolean;
  notificationTime: string; // HH:MM format
  streakReminders: boolean;

  // New: Sleep Reminder
  sleepReminderTime: string; // HH:MM format
  sleepReminderEnabled: boolean;

  // In-App Updater
  autoCheckUpdates: boolean;
  lastUpdateCheckDate?: string;

  // Preferences
  soundEnabled: boolean;
  hapicsEnabled: boolean;

  setUserName: (name: string) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setNotificationTime: (time: string) => void;
  setStreakReminders: (enabled: boolean) => void;
  setSleepReminderTime: (time: string) => void;
  setSleepReminderEnabled: (enabled: boolean) => void;
  setAutoCheckUpdates: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setHapicsEnabled: (enabled: boolean) => void;
  setLastUpdateCheckDate: (date: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      userName: 'User',
      notificationsEnabled: true,
      notificationTime: '09:00',
      streakReminders: true,
      sleepReminderTime: '23:00', // Default 11 PM
      sleepReminderEnabled: true,
      autoCheckUpdates: true,
      soundEnabled: true,
      hapicsEnabled: true,

      setUserName: (name) => set({ userName: name }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setNotificationTime: (time) => set({ notificationTime: time }),
      setStreakReminders: (enabled) => set({ streakReminders: enabled }),
      setSleepReminderTime: (time) => set({ sleepReminderTime: time }),
      setSleepReminderEnabled: (enabled) => set({ sleepReminderEnabled: enabled }),
      setAutoCheckUpdates: (enabled) => set({ autoCheckUpdates: enabled }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setHapicsEnabled: (enabled) => set({ hapicsEnabled: enabled }),
      setLastUpdateCheckDate: (date) => set({ lastUpdateCheckDate: date }),
    }),
    { name: 'settings', storage: createJSONStorage(() => AsyncStorage) }
  )
);
