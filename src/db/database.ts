import { Platform } from 'react-native';
import { PersistedDatabase } from './types';

const db = Platform.select({
  native: () => require('./database.native'),
  default: () => require('./database.web'),
})();

export const getDatabase: () => Promise<PersistedDatabase> = db.getDatabase;
export const initializeDatabase: () => Promise<void> = db.initializeDatabase;
