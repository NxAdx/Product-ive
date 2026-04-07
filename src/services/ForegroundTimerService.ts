import notifee, { AndroidImportance, AndroidColor } from '@notifee/react-native';
import { Vibration } from 'react-native';

const NOTIFICATION_ID = 'pomodoro_timer_foreground';
const CHANNEL_ID = 'active_session_timers';

/**
 * Ensures the Android Notification Channel exists
 */
async function ensureChannel() {
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Active Session Timers',
    importance: AndroidImportance.HIGH,
    vibration: true,
  });
}

let activeTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Starts a foreground service that displays a ticking chronometer.
 * Automatically vibrates at the expected payload end manually using headless background task if needed,
 * but primarily we schedule an exact notification or rely on state.
 */
export async function startForegroundTimer(durationMs: number, title: string = 'Deep Focus') {
  if (activeTimer) {
    clearTimeout(activeTimer);
  }

  await ensureChannel();

  // Create a foreground service notification with a Chronometer
  await notifee.displayNotification({
    id: NOTIFICATION_ID,
    title: title,
    body: 'Time remaining...',
    android: {
      channelId: CHANNEL_ID,
      asForegroundService: true,
      color: AndroidColor.GREEN,
      chronometerDirection: 'down',
      showChronometer: true,
      timestamp: Date.now() + durationMs, // OS counts down to this exact millisecond
      showTimestamp: true,
      ongoing: true, // Cannot be dismissed manually while running
      // Add a cancel action if they want to stop it from the notification shade
      actions: [
        {
          title: 'Finish Session',
          pressAction: { id: 'finish_session' },
        },
      ],
    },
  });

  // Background JS task is kept awake via _layout.tsx notifee.registerForegroundService hook.
  // This allows setTimeout to deterministically fire in suspended mode. 
  activeTimer = setTimeout(() => {
    stopForegroundTimer(true).catch(console.error);
  }, durationMs);
}

/**
 * Terminates the foreground service chronometer and sends the completion vibration
 */
export async function stopForegroundTimer(completed: boolean = false) {
  if (activeTimer) {
    clearTimeout(activeTimer);
    activeTimer = null;
  }
  // If the timer completed organically, vibrate!
  if (completed) {
    Vibration.vibrate([0, 500, 200, 500, 200, 1000]); // Heavy vibration pattern
    
    await ensureChannel();
    await notifee.displayNotification({
      id: `${NOTIFICATION_ID}_complete`,
      title: 'Session Complete!',
      body: 'Excellent focus. Take a short break.',
      android: {
        channelId: CHANNEL_ID,
        color: AndroidColor.GREEN,
        importance: AndroidImportance.HIGH,
      },
    });
  }

  // Remove the active foreground sticky notification
  await notifee.stopForegroundService();
  await notifee.cancelNotification(NOTIFICATION_ID);
}
