import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logRuntimeEvent } from '../utils/runtimeLogs';

/**
 * NotificationManager - Handles all notification permissions and setup
 * 
 * Responsibilities:
 * - Request notification permissions (iOS & Android)
 * - Configure notification handlers
 * - Track permission state
 * - Provide UI hints about notifications
 */

const NOTIFICATION_PERMISSION_KEY = 'notification_permission_requested';

interface PermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
  timestamp: number;
}

/**
 * Request notification permissions from the user
 * On iOS: Shows system permission prompt
 * On Android: Requests SCHEDULE_EXACT_ALARM permission (post-31)
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    // Check if we've already asked today
    const lastAsked = await AsyncStorage.getItem(NOTIFICATION_PERMISSION_KEY);
    if (lastAsked) {
      const lastAskedTime = parseInt(lastAsked, 10);
      const oneDayMs = 24 * 60 * 60 * 1000;
      if (Date.now() - lastAskedTime < oneDayMs) {
        // Already asked within 24 hours
        return await checkNotificationPermissions();
      }
    }

    // Request permission
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

    // Log the request
    await logRuntimeEvent('notification_permission_requested', {
      granted,
      platform: Platform.OS,
    }).catch(() => {});

    // Track that we asked
    await AsyncStorage.setItem(NOTIFICATION_PERMISSION_KEY, Date.now().toString());

    return granted;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    await logRuntimeEvent('notification_permission_error', {
      error: String(error),
    }).catch(() => {});
    return false;
  }
}

/**
 * Check current notification permission status
 */
export async function checkNotificationPermissions(): Promise<boolean> {
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
 * Sets up how notifications are handled when app is in foreground
 */
export function setupNotificationHandlers() {
  // Set notification handler behavior
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  // Handle notification when app is foregrounded
  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const { notification } = response;
    console.log('Notification received:', notification);
    
    logRuntimeEvent('notification_tapped', {
      title: notification.request.content.title,
    }).catch(() => {});
  });

  return subscription;
}

/**
 * Schedule a test notification (for debugging)
 */
export async function scheduleTestNotification() {
  try {
    const hasPermission = await checkNotificationPermissions();
    if (!hasPermission) {
      console.warn('No notification permission - requesting...');
      await requestNotificationPermissions();
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Product +ive Test',
        body: 'Notification permissions are working!',
        sound: 'default',
        badge: 1,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });

    await logRuntimeEvent('test_notification_scheduled').catch(() => {});
  } catch (error) {
    console.error('Error scheduling test notification:', error);
  }
}

/**
 * Get permission status with details
 */
export async function getPermissionStatus(): Promise<PermissionStatus> {
  try {
    const { status, canAskAgain } = await Notifications.getPermissionsAsync();
    return {
      granted: status === 'granted',
      canAskAgain: canAskAgain ?? false,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error getting permission status:', error);
    return {
      granted: false,
      canAskAgain: false,
      timestamp: Date.now(),
    };
  }
}

/**
 * Initialize notification system on app startup
 * This should be called from app/_layout.tsx
 */
export async function initializeNotifications(): Promise<void> {
  try {
    // Check if permissions already granted
    const hasPermission = await checkNotificationPermissions();
    
    if (!hasPermission) {
      console.log('Notifications not yet permitted - user will be prompted later');
    }

    // Setup handlers regardless of permission state
    setupNotificationHandlers();

    await logRuntimeEvent('notifications_initialized', {
      hasPermission,
    }).catch(() => {});
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
}
