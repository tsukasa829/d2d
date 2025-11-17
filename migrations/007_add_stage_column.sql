-- stage列追加: 数値(整数/小数)を保持。初期値0。
-- 例: 0, 1, 1.1, 3 などの進行段階を表す。
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS stage NUMERIC(4,1) DEFAULT 0 NOT NULL;
