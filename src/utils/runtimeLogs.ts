import AsyncStorage from '@react-native-async-storage/async-storage';

const RUNTIME_LOG_KEY = 'runtime_logs_v1';
const MAX_ENTRIES = 200;

type RuntimeLogEntry = {
  ts: string;
  event: string;
  payload?: Record<string, unknown>;
};

export async function logRuntimeEvent(
  event: string,
  payload?: Record<string, unknown>
): Promise<void> {
  try {
    const existing = await AsyncStorage.getItem(RUNTIME_LOG_KEY);
    const parsed = existing ? (JSON.parse(existing) as RuntimeLogEntry[]) : [];
    const nextEntry: RuntimeLogEntry = {
      ts: new Date().toISOString(),
      event,
      payload,
    };
    const next = [...parsed, nextEntry].slice(-MAX_ENTRIES);
    await AsyncStorage.setItem(RUNTIME_LOG_KEY, JSON.stringify(next));
  } catch {
    // Logging must never break app flow.
  }
}

export async function getRuntimeLogs(): Promise<RuntimeLogEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(RUNTIME_LOG_KEY);
    return raw ? (JSON.parse(raw) as RuntimeLogEntry[]) : [];
  } catch {
    return [];
  }
}

export async function clearRuntimeLogs(): Promise<void> {
  try {
    await AsyncStorage.removeItem(RUNTIME_LOG_KEY);
  } catch {
    // no-op
  }
}
