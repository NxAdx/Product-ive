import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { logRuntimeEvent } from '../utils/runtimeLogs';

/**
 * NotificationManager - Handles all notification permissions and setup
 * 
 * NOTE: For SDK 53+ Expo Go compatibility, we avoid top-level imports of expo-notifications
 * to prevent the 'Android Push notifications removed' crash during module evaluation.
 */

const NOTIFICATION_PERMISSION_KEY = 'notification_permission_requested';

interface PermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
  timestamp: number;
}

/**
 * Lazy load expo-notifications only when safe
 */
const getNotifications = () => {
  const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
  if (isExpoGo && Platform.OS === 'android') {
    return null;
  }
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('expo-notifications');
};

/**
 * Request notification permissions from the user
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  const Notifications = getNotifications();
  if (!Notifications) {
    console.warn('Push notifications are not supported in Expo Go on Android. Skipping permission request.');
    return false;
  }

  try {
    const lastAsked = await AsyncStorage.getItem(NOTIFICATION_PERMISSION_KEY);
    if (lastAsked) {
      const lastAskedTime = parseInt(lastAsked, 10);
      const oneDayMs = 24 * 60 * 60 * 1000;
      if (Date.now() - lastAskedTime < oneDayMs) {
        return await checkNotificationPermissions();
      }
    }

    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowCriticalAlerts: false,
        allowProvisional: true,
      },
    });

    const granted = status === 'granted';
    await logRuntimeEvent('notification_permission_requested', { granted, platform: Platform.OS }).catch(() => {});
    await AsyncStorage.setItem(NOTIFICATION_PERMISSION_KEY, Date.now().toString());

    return granted;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

/**
 * Check current notification permission status
 */
export async function checkNotificationPermissions(): Promise<boolean> {
  const Notifications = getNotifications();
  if (!Notifications) return false;

  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error checking notification permissions:', error);
    return false;
  }
}

/**
 * Configure notification handlers
 */
export function setupNotificationHandlers() {
  const Notifications = getNotifications();
  if (!Notifications) return null;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  return Notifications.addNotificationResponseReceivedListener((response: any) => {
    const { notification } = response;
    logRuntimeEvent('notification_tapped', { title: notification.request.content.title }).catch(() => {});
  });
}

/**
 * Initialize notification system
 */
export async function initializeNotifications(): Promise<void> {
  const Notifications = getNotifications();
  if (!Notifications) {
    console.warn('Skipping notification initialization in Expo Go on Android.');
    return;
  }

  try {
    const hasPermission = await checkNotificationPermissions();
    setupNotificationHandlers();
    await logRuntimeEvent('notifications_initialized', { hasPermission }).catch(() => {});
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
}

import { useSettingsStore } from '../store/settingsStore';

/**
 * Fire an immediate local notification for active in-app events.
 */
export async function notifyNow(
  title: string,
  body: string,
  data?: Record<string, unknown>
): Promise<void> {
  const Notifications = getNotifications();
  if (!Notifications) return;

  const { hapticsEnabled } = useSettingsStore.getState();

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: hapticsEnabled,
      },
      trigger: null,
    });
  } catch (error) {
    console.error('Error sending immediate notification:', error);
  }
}

/**
 * Schedule or sync wellness reminders with the OS
 */
export async function scheduleWellnessReminders(notifications: any[]): Promise<void> {
  const Notifications = getNotifications();
  if (!Notifications) return;

  const { hapticsEnabled } = useSettingsStore.getState();

  try {
    // 1. Cancel all existing scheduled wellness notifications to avoid duplicates
    await Notifications.cancelAllScheduledNotificationsAsync();

    for (const notification of notifications) {
      if (!notification.enabled) continue;

      const { id, label, description, intervalMinutes, notificationTime } = notification;

      // Case A: Time-based (e.g., Sleep Reminder at 23:00)
      if (notificationTime !== undefined) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: label,
            body: description,
            data: { id, type: 'wellness' },
            sound: hapticsEnabled,
          },
          trigger: {
            type: 'daily',
            hour: notificationTime,
            minute: 0,
          },
        });
      }
      
      // Case B: Interval-based (e.g., Hydration every 45 mins)
      else if (intervalMinutes !== undefined) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: label,
            body: description,
            data: { id, type: 'wellness' },
            sound: hapticsEnabled,
          },
          trigger: {
            type: 'timeInterval',
            seconds: intervalMinutes * 60,
            repeats: true,
          },
        });
      }
    }

    await logRuntimeEvent('wellness_notifications_scheduled', { count: notifications.filter(n => n.enabled).length });
  } catch (error) {
    console.error('Error scheduling wellness notifications:', error);
  }
}

/**
 * Get permission status with details
 */
export async function getPermissionStatus(): Promise<PermissionStatus> {
  const Notifications = getNotifications();
  if (!Notifications) {
    return { granted: false, canAskAgain: false, timestamp: Date.now() };
  }

  try {
    const { status, canAskAgain } = await Notifications.getPermissionsAsync();
    return {
      granted: status === 'granted',
      canAskAgain: canAskAgain ?? false,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error getting permission status:', error);
    return { granted: false, canAskAgain: false, timestamp: Date.now() };
  }
}
