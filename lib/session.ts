import { getDBClient } from './dbClient';
import type { User } from '@/lib/types/session';

export async function getAllSessions(): Promise<User[]> {
  const db = getDBClient();
  const result = await db.query<any>(
    `SELECT session_id, email, trial, has_1day_pass, has_standard, stage, 
            stageup_date AT TIME ZONE 'UTC' as stageup_date, 
            created_at AT TIME ZONE 'UTC' as created_at, 
            last_access_at AT TIME ZONE 'UTC' as last_access_at
     FROM sessions
     ORDER BY created_at DESC`
  );
  return result.rows.map((row: any) => ({
    sessionId: row.session_id,
    email: row.email,
    trial: row.trial,
    has1DayPass: row.has_1day_pass,
    hasStandard: row.has_standard,
    stage: Number(row.stage) ?? 0,
    stageupDate: row.stageup_date ? new Date(row.stageup_date) : null,
    createdAt: new Date(row.created_at),
    lastAccessAt: new Date(row.last_access_at),
  }));
}

export async function getSession(sessionId: string): Promise<User | null> {
  const db = getDBClient();
  const result = await db.query<any>(
    `SELECT session_id, email, trial, has_1day_pass, has_standard, stage, 
            stageup_date AT TIME ZONE 'UTC' as stageup_date, 
            created_at AT TIME ZONE 'UTC' as created_at, 
            last_access_at AT TIME ZONE 'UTC' as last_access_at
     FROM sessions
     WHERE session_id = $1`,
    [sessionId]
  );
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    sessionId: row.session_id,
    email: row.email,
    trial: row.trial,
    has1DayPass: row.has_1day_pass,
    hasStandard: row.has_standard,
    stage: Number(row.stage) ?? 0,
    stageupDate: row.stageup_date ? new Date(row.stageup_date) : null,
    createdAt: new Date(row.created_at),
    lastAccessAt: new Date(row.last_access_at),
  };
}

export async function createSession(sessionId: string): Promise<User> {
  const db = getDBClient();
  // UTCで保存
  const now = new Date();
  await db.query(
    `INSERT INTO sessions (session_id, email, trial, has_1day_pass, has_standard, stage, stageup_date, created_at, last_access_at)
     VALUES ($1, NULL, FALSE, FALSE, FALSE, 1, $2, $2, $2)
     ON CONFLICT (session_id) DO NOTHING`,
    [sessionId, now.toISOString()]
  );
  return {
    sessionId,
    email: '',
    trial: false,
    has1DayPass: false,
    hasStandard: false,
    stage: 1,
    stageupDate: now,
    createdAt: now,
    lastAccessAt: now,
  };
}

export async function updateSessionEmail(sessionId: string, email: string): Promise<void> {
  const db = getDBClient();
  await db.query(
    `UPDATE sessions SET email = $1, last_access_at = CURRENT_TIMESTAMP WHERE session_id = $2`,
    [email, sessionId]
  );
}

export async function updateSession1DayPass(sessionId: string, has1DayPass: boolean): Promise<void> {
  const db = getDBClient();
  await db.query(
    `UPDATE sessions SET has_1day_pass = $1, last_access_at = CURRENT_TIMESTAMP WHERE session_id = $2`,
    [has1DayPass, sessionId]
  );
}

export async function updateSessionStandard(sessionId: string, hasStandard: boolean): Promise<void> {
  const db = getDBClient();
  await db.query(
    `UPDATE sessions SET has_standard = $1, last_access_at = CURRENT_TIMESTAMP WHERE session_id = $2`,
    [hasStandard, sessionId]
  );
}

export async function updateSessionTrial(sessionId: string, trial: boolean): Promise<void> {
  const db = getDBClient();
  await db.query(
    `UPDATE sessions SET trial = $1, last_access_at = CURRENT_TIMESTAMP WHERE session_id = $2`,
    [trial, sessionId]
  );
}

export async function updateSessionStage(sessionId: string, stage: number): Promise<void> {
  const db = getDBClient();
  // UTCで保存
  const now = new Date();
  console.log('[updateSessionStage] Updating stage to', stage, 'for session', sessionId, 'at UTC:', now.toISOString());
  const result = await db.query(
    `UPDATE sessions SET stage = $1, stageup_date = $2, last_access_at = $2 WHERE session_id = $3`,
    [stage, now.toISOString(), sessionId]
  );
  console.log('[updateSessionStage] Update result:', result.rowCount, 'rows affected');
}

export async function deleteSession(sessionId: string): Promise<void> {
  const db = getDBClient();
  await db.query(`DELETE FROM sessions WHERE session_id = $1`, [sessionId]);
}
