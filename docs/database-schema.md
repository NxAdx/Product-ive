# Product+ive — Database Schema

> **Last Updated:** 2026-04-01 | **Database:** SQLite (expo-sqlite)

---

## Tables

### sessions
```sql
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  rule_id TEXT NOT NULL,
  started_at INTEGER NOT NULL,      -- Unix timestamp
  completed_at INTEGER,             -- NULL if abandoned
  points_earned INTEGER DEFAULT 0,
  engine_data TEXT DEFAULT '{}',    -- JSON: engine-specific data
  created_at TEXT NOT NULL
);
```

### tasks
```sql
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  rule_id TEXT,                     -- Optional rule tag
  priority TEXT DEFAULT 'general',  -- 'frog' | 'quick' | 'big' | 'medium' | 'small' | 'general'
  completed INTEGER DEFAULT 0,
  completed_at INTEGER,
  due_time INTEGER,                 -- Optional Unix timestamp
  created_at TEXT NOT NULL
);
```

### positivity
```sql
CREATE TABLE IF NOT EXISTS positivity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  weekly_score INTEGER DEFAULT 0,
  lifetime_score INTEGER DEFAULT 0,
  current_level TEXT DEFAULT 'seed',
  weekly_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  rules_used TEXT DEFAULT '[]',     -- JSON array of rule IDs
  achievements TEXT DEFAULT '[]',   -- JSON array of achievement IDs
  week_start TEXT NOT NULL          -- ISO date of week start (Monday)
);
```

### point_events
```sql
CREATE TABLE IF NOT EXISTS point_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL,             -- 'session' | 'task' | 'bonus' | 'streak' | 'discovery'
  rule_id TEXT,
  description TEXT,
  created_at TEXT NOT NULL
);
```

### spaced_reviews
```sql
CREATE TABLE IF NOT EXISTS spaced_reviews (
  id TEXT PRIMARY KEY,
  topic TEXT NOT NULL,
  rule_id TEXT NOT NULL,            -- 'srs' or '147'
  intervals TEXT NOT NULL,          -- JSON array: [1,3,7,14,30] or [1,4,7]
  current_step INTEGER DEFAULT 0,
  next_review_at INTEGER,           -- Unix timestamp
  completed INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);
```
