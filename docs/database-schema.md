# Product+ive - Database Schema

> Last Updated: 2026-04-07 (IST)
> Database: SQLite (`expo-sqlite`)

Implementation files:
- Native runtime: `src/db/database.native.ts`
- Web fallback/no-op adapter: `src/db/database.web.ts`
- Repository writes: `src/db/sessionRepository.ts`

## Current Implemented Tables (v1)

### sessions

```sql
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
```

### point_events

```sql
CREATE TABLE IF NOT EXISTS point_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL,
  rule_id TEXT,
  created_at TEXT NOT NULL
);
```

Indexes:

```sql
CREATE INDEX IF NOT EXISTS idx_point_events_session_id ON point_events(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_completed_at ON sessions(completed_at);
```

## Planned Next Tables

The following remain planned for expanded persistence:

- tasks
- positivity snapshots
- spaced_reviews

These domains are still represented in Zustand + AsyncStorage today and will be progressively moved into repository-backed persistence.
