-- セッション/ユーザーテーブル
CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY,
  email TEXT,
  has_1day_pass BOOLEAN DEFAULT FALSE,
  has_standard BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_access_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sessions_email ON sessions(email);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);
