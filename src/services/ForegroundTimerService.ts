import notifee, { AndroidImportance, AndroidColor } from '@notifee/react-native';
import { Vibration } from 'react-native';
import { useSettingsStore } from '../store/settingsStore';

const NOTIFICATION_ID = 'pomodoro_timer_foreground';
const CHANNEL_ID = 'active_session_timers';
const SILENT_CHANNEL_ID = 'active_session_timers_silent';

/**
 * Ensures the Android Notification Channel exists based on haptics setting
 */
async function ensureChannel(hapticsEnabled: boolean) {
  if (hapticsEnabled) {
    await notifee.createChannel({
      id: CHANNEL_ID,
      name: 'Active Session (Vibrate)',
      importance: AndroidImportance.HIGH,
      vibration: true,
    });
  } else {
    await notifee.createChannel({
      id: SILENT_CHANNEL_ID,
      name: 'Active Session (Silent)',
      importance: AndroidImportance.DEFAULT,
      vibration: false,
    });
  }
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

async function showRunningNotification(title: string, deadlineAtMs: number, hapticsEnabled: boolean) {
  await notifee.displayNotification({
    id: NOTIFICATION_ID,
    title,
    body: 'Time remaining...',
    android: {
      channelId: hapticsEnabled ? CHANNEL_ID : SILENT_CHANNEL_ID,
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

async function showPausedNotification(title: string, remainingMs: number, hapticsEnabled: boolean) {
  await notifee.displayNotification({
    id: NOTIFICATION_ID,
    title,
    body: `Paused - ${formatRemaining(remainingMs)} remaining`,
    android: {
      channelId: hapticsEnabled ? CHANNEL_ID : SILENT_CHANNEL_ID,
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

interface StartTimerOptions {
  durationMs: number;
  title?: string;
  deadlineAtMs: number;
}

/**
 * Starts a foreground service that displays a ticking chronometer.
 */
export async function startForegroundTimer(options: StartTimerOptions) {
  const { durationMs, title = 'Deep Focus', deadlineAtMs } = options;
  clearCompletionTimer();

  const { hapticsEnabled } = useSettingsStore.getState();
  await ensureChannel(hapticsEnabled);

  const safeDurationMs = Math.max(1000, Math.floor(durationMs));

  timerState = {
    title,
    isPaused: false,
    remainingMs: safeDurationMs,
    deadlineAtMs,
  };

  await showRunningNotification(title, deadlineAtMs, hapticsEnabled);
  scheduleCompletionTimer(safeDurationMs);
}

export async function pauseForegroundTimer(): Promise<void> {
  if (!timerState || timerState.isPaused || timerState.deadlineAtMs === null) return;

  const now = Date.now();
  const remainingMs = Math.max(0, timerState.deadlineAtMs - now);
  clearCompletionTimer();

  timerState = {
    ...timerState,
    isPaused: true,
    remainingMs,
    deadlineAtMs: null,
  };

  const { hapticsEnabled } = useSettingsStore.getState();
  await ensureChannel(hapticsEnabled);
  await showPausedNotification(timerState.title, remainingMs, hapticsEnabled);
}

export async function resumeForegroundTimer(deadlineAtMs: number): Promise<void> {
  if (!timerState || !timerState.isPaused) return;

  const remainingMs = Math.max(0, timerState.remainingMs);
  if (remainingMs <= 0) {
    await stopForegroundTimer(true);
    return;
  }

  timerState = {
    ...timerState,
    isPaused: false,
    remainingMs,
    deadlineAtMs,
  };

  const { hapticsEnabled } = useSettingsStore.getState();
  await ensureChannel(hapticsEnabled);
  await showRunningNotification(timerState.title, deadlineAtMs, hapticsEnabled);
  scheduleCompletionTimer(remainingMs);
}

/**
 * Terminates the foreground service chronometer and sends the completion vibration
 */
export async function stopForegroundTimer(completed: boolean = false) {
  clearCompletionTimer();
  timerState = null;
  const { hapticsEnabled } = useSettingsStore.getState();

  if (completed) {
    if (hapticsEnabled) {
      Vibration.vibrate([0, 500, 200, 500, 200, 1000]);
    }
    
    await ensureChannel(hapticsEnabled);
    await notifee.displayNotification({
      id: `${NOTIFICATION_ID}_complete`,
      title: 'Session Complete!',
      body: 'Excellent focus. Take a short break.',
      android: {
        channelId: hapticsEnabled ? CHANNEL_ID : SILENT_CHANNEL_ID,
        color: AndroidColor.GREEN,
        importance: hapticsEnabled ? AndroidImportance.HIGH : AndroidImportance.DEFAULT,
      },
    });
  }

  await notifee.stopForegroundService();
  await notifee.cancelNotification(NOTIFICATION_ID);
}
