import { Platform } from 'react-native';

const db = Platform.select({
  native: () => require('./database.native'),
  default: () => require('./database.web'),
})();

export const { getDatabase, initializeDatabase } = db;
