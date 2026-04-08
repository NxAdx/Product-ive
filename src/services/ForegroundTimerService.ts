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

interface ForegroundTimerState {
  title: string;
  isPaused: boolean;
  remainingMs: number;
  deadlineAtMs: number | null;
}

let timerState: ForegroundTimerState | null = null;

function clearCompletionTimer() {
  if (activeTimer) {
    clearTimeout(activeTimer);
    activeTimer = null;
  }
}

function formatRemaining(remainingMs: number): string {
  const seconds = Math.max(0, Math.floor(remainingMs / 1000));
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function scheduleCompletionTimer(remainingMs: number) {
  clearCompletionTimer();

  if (remainingMs <= 0) {
    stopForegroundTimer(true).catch(console.error);
    return;
  }

  activeTimer = setTimeout(() => {
    stopForegroundTimer(true).catch(console.error);
  }, remainingMs);
}

async function showRunningNotification(title: string, deadlineAtMs: number) {
  await notifee.displayNotification({
    id: NOTIFICATION_ID,
    title,
    body: 'Time remaining...',
    android: {
      channelId: CHANNEL_ID,
      asForegroundService: true,
      color: AndroidColor.GREEN,
      chronometerDirection: 'down',
      showChronometer: true,
      timestamp: deadlineAtMs,
      showTimestamp: true,
      ongoing: true,
      actions: [
        {
          title: 'Finish Session',
          pressAction: { id: 'finish_session' },
        },
      ],
    },
  });
}

async function showPausedNotification(title: string, remainingMs: number) {
  await notifee.displayNotification({
    id: NOTIFICATION_ID,
    title,
    body: `Paused - ${formatRemaining(remainingMs)} remaining`,
    android: {
      channelId: CHANNEL_ID,
      asForegroundService: true,
      color: AndroidColor.GREEN,
      showChronometer: false,
      showTimestamp: false,
      ongoing: true,
      actions: [
        {
          title: 'Finish Session',
          pressAction: { id: 'finish_session' },
        },
      ],
    },
  });
}

/**
 * Starts a foreground service that displays a ticking chronometer.
 * Automatically vibrates at the expected payload end manually using headless background task if needed,
 * but primarily we schedule an exact notification or rely on state.
 */
export async function startForegroundTimer(durationMs: number, title: string = 'Deep Focus') {
  clearCompletionTimer();

  await ensureChannel();

  const safeDurationMs = Math.max(1000, Math.floor(durationMs));
  const deadlineAtMs = Date.now() + safeDurationMs;

  timerState = {
    title,
    isPaused: false,
    remainingMs: safeDurationMs,
    deadlineAtMs,
  };

  await showRunningNotification(title, deadlineAtMs);
  // Background JS task is kept awake via _layout.tsx notifee.registerForegroundService hook.
  scheduleCompletionTimer(safeDurationMs);
}

export async function pauseForegroundTimer(): Promise<void> {
  if (!timerState || timerState.isPaused || timerState.deadlineAtMs === null) return;

  const remainingMs = Math.max(0, timerState.deadlineAtMs - Date.now());
  clearCompletionTimer();

  timerState = {
    ...timerState,
    isPaused: true,
    remainingMs,
    deadlineAtMs: null,
  };

  await ensureChannel();
  await showPausedNotification(timerState.title, remainingMs);
}

export async function resumeForegroundTimer(): Promise<void> {
  if (!timerState || !timerState.isPaused) return;

  const remainingMs = Math.max(0, timerState.remainingMs);
  if (remainingMs <= 0) {
    await stopForegroundTimer(true);
    return;
  }

  const deadlineAtMs = Date.now() + remainingMs;
  timerState = {
    ...timerState,
    isPaused: false,
    remainingMs,
    deadlineAtMs,
  };

  await ensureChannel();
  await showRunningNotification(timerState.title, deadlineAtMs);
  scheduleCompletionTimer(remainingMs);
}

/**
 * Terminates the foreground service chronometer and sends the completion vibration
 */
export async function stopForegroundTimer(completed: boolean = false) {
  clearCompletionTimer();
  timerState = null;
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
