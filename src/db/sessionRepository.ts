import { getDatabase } from './database';

export interface SessionRecordInput {
  id: string;
  ruleId: string;
  engine: string;
  startedAt: number;
  completedAt: number;
  durationSeconds: number;
  pointsEarned: number;
  reflectionScore?: number;
}

export interface PointEventRecordInput {
  sessionId?: string;
  amount: number;
  source: string;
  ruleId?: string;
  createdAt?: string;
}

export interface SessionSummaryRecord {
  id: string;
  ruleId: string;
  engine: string;
  startedAt: number;
  completedAt: number;
  durationSeconds: number;
  pointsEarned: number;
  reflectionScore: number | null;
  createdAt: string;
}

export async function insertSessionRecord(record: SessionRecordInput): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO sessions (
      id, rule_id, engine, started_at, completed_at, duration_seconds, points_earned, reflection_score, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    record.id,
    record.ruleId,
    record.engine,
    record.startedAt,
    record.completedAt,
    record.durationSeconds,
    record.pointsEarned,
    typeof record.reflectionScore === 'number' ? record.reflectionScore : null,
    new Date().toISOString()
  );
}

export async function insertPointEvents(events: PointEventRecordInput[]): Promise<void> {
  if (events.length === 0) return;
  const db = await getDatabase();
  await db.withExclusiveTransactionAsync(async (tx) => {
    for (const event of events) {
      await tx.runAsync(
        `INSERT INTO point_events (session_id, amount, source, rule_id, created_at)
         VALUES (?, ?, ?, ?, ?);`,
        event.sessionId ?? null,
        event.amount,
        event.source,
        event.ruleId ?? null,
        event.createdAt ?? new Date().toISOString()
      );
    }
  });
}

export async function getRecentSessions(limit = 8): Promise<SessionSummaryRecord[]> {
  const db = await getDatabase();
  const safeLimit = Math.max(1, Math.min(50, Math.floor(limit)));

  return db.getAllAsync<SessionSummaryRecord>(
    `SELECT
      id AS id,
      rule_id AS ruleId,
      engine AS engine,
      started_at AS startedAt,
      completed_at AS completedAt,
      duration_seconds AS durationSeconds,
      points_earned AS pointsEarned,
      reflection_score AS reflectionScore,
      created_at AS createdAt
     FROM sessions
     ORDER BY completed_at DESC
     LIMIT ?;`,
    safeLimit
  );
}

export async function getTodayPointDelta(): Promise<number> {
  const db = await getDatabase();
  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  ).toISOString();

  const row = await db.getFirstAsync<{ total: number | null }>(
    `SELECT COALESCE(SUM(amount), 0) AS total
     FROM point_events
     WHERE created_at >= ?;`,
    startOfDay
  );

  return row?.total ?? 0;
}

export interface ActivityHistoryPoint {
  date: string;
  count: number;
}

/**
 * Returns session counts grouped by date for the last N weeks.
 */
export async function getActivityHistory(weeks = 12): Promise<ActivityHistoryPoint[]> {
  const db = await getDatabase();
  const now = new Date();
  const daysAgo = weeks * 7;
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - daysAgo);
  const startDateISO = startDate.toISOString();

  // SQLite: date(created_at) returns YYYY-MM-DD
  return db.getAllAsync<ActivityHistoryPoint>(
    `SELECT date(created_at) as date, count(*) as count 
     FROM sessions 
     WHERE created_at >= ? 
     GROUP BY date(created_at)
     ORDER BY date ASC;`,
    startDateISO
  );
}

export interface WellbeingAssessment {
  id: string;
  score: number; // 1-5 average or composite
  notes?: string;
  category: string; // 'daily_checkin'
  createdAt: number;
}

/**
 * Saves a wellbeing check-in.
 */
export async function saveWellbeingAssessment(assessment: WellbeingAssessment): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO wellbeing_assessments (id, score, notes, category, created_at)
     VALUES (?, ?, ?, ?, ?);`,
    assessment.id,
    assessment.score,
    assessment.notes ?? null,
    assessment.category,
    assessment.createdAt
  );
}

/**
 * Returns the average score of the most recent check-in.
 */
export async function getLatestWellbeingIndex(): Promise<number | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ score: number }>(
    `SELECT score FROM wellbeing_assessments ORDER BY created_at DESC LIMIT 1;`
  );
  return row?.score ?? null;
}

/**
 * Checks if a check-in was performed in the last 20 hours (prevent spamming).
 */
export async function hasRecentlyCheckedIn(): Promise<boolean> {
  const db = await getDatabase();
  const twentyHoursAgo = Date.now() - 20 * 60 * 60 * 1000;
  const row = await db.getFirstAsync<{ count: number }>(
    `SELECT count(*) as count FROM wellbeing_assessments WHERE created_at >= ?;`,
    twentyHoursAgo
  );
  return (row?.count ?? 0) > 0;
}
