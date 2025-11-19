-- stageup_date列追加: ステージアップした日時を記録するタイムスタンプ
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS stageup_date TIMESTAMP;
