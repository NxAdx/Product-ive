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
