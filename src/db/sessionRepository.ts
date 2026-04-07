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
