import { Platform } from 'react-native';
import type { PersistedDatabase } from './types';

async function loadDbModule(): Promise<{ getDatabase: () => Promise<PersistedDatabase>; initializeDatabase: () => Promise<void> }> {
  if (Platform.OS === 'web') {
    return await import('./database.web');
  }
  return await import('./database.native');
}

export const getDatabase: () => Promise<PersistedDatabase> = async () => {
  const mod = await loadDbModule();
  return mod.getDatabase();
};

export const initializeDatabase: () => Promise<void> = async () => {
  const mod = await loadDbModule();
  return mod.initializeDatabase();
};
