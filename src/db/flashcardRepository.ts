import { getDatabase } from './database.native';

export interface FlashCardRecord {
  id: string;
  rule_id: string;
  front: string;
  back: string;
  ease_factor: number;
  interval: number;
  repetitions: number;
  next_review: number; // timestamp
  created_at: string;
}

export interface SessionContentRecord {
  id?: number;
  session_id: string;
  content: string;
  created_at: string;
}

/**
 * Flashcard Repository
 */
export async function getFlashcardsByRule(ruleId: string): Promise<FlashCardRecord[]> {
  const db = await getDatabase();
  return await db.getAllAsync<FlashCardRecord>(
    'SELECT * FROM flashcards WHERE rule_id = ? ORDER BY next_review ASC',
    [ruleId]
  );
}

export async function upsertFlashcard(card: FlashCardRecord): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT OR REPLACE INTO flashcards (id, rule_id, front, back, ease_factor, interval, repetitions, next_review, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [card.id, card.rule_id, card.front, card.back, card.ease_factor, card.interval, card.repetitions, card.next_review, card.created_at]
  );
}

export async function deleteFlashcard(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM flashcards WHERE id = ?', [id]);
}

/**
 * Session Content Repository (Blurting/Freewrite Transcripts)
 */
export async function insertSessionContent(record: SessionContentRecord): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT INTO session_contents (session_id, content, created_at) VALUES (?, ?, ?)',
    [record.session_id, record.content, record.created_at]
  );
}

export async function getSessionContent(sessionId: string): Promise<SessionContentRecord | null> {
  const db = await getDatabase();
  return await db.getFirstAsync<SessionContentRecord>(
    'SELECT * FROM session_contents WHERE session_id = ?',
    [sessionId]
  );
}
