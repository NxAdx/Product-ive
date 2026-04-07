import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import type { PersistedDatabase } from './types';

const DB_NAME = 'product_ive.db';
const DB_VERSION = 1;

let dbPromise: Promise<PersistedDatabase> | null = null;

const MIGRATION_V1 = `
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY NOT NULL,
  rule_id TEXT NOT NULL,
  engine TEXT NOT NULL,
  started_at INTEGER NOT NULL,
  completed_at INTEGER NOT NULL,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  points_earned INTEGER NOT NULL DEFAULT 0,
  reflection_score INTEGER,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS point_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL,
  rule_id TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_point_events_session_id ON point_events(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_completed_at ON sessions(completed_at);
`;

async function runMigrations(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL;');
  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version;');
  const currentVersion = result?.user_version ?? 0;

  if (currentVersion < 1) {
    await db.execAsync(MIGRATION_V1);
    await db.execAsync(`PRAGMA user_version = ${DB_VERSION};`);
  }
}

export async function getDatabase(): Promise<PersistedDatabase> {
  if (!dbPromise) {
    dbPromise = openDatabaseAsync(DB_NAME).then(async (db) => {
      await runMigrations(db);
      return db as PersistedDatabase;
    });
  }
  return dbPromise;
}

export async function initializeDatabase(): Promise<void> {
  await getDatabase();
}
