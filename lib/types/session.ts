export interface User {
  sessionId: string;
  email: string | null;
  has1DayPass: boolean;
  hasStandard: boolean;
  stage: number; // 進行段階 (例: 0,1,1.1,3)
  stageupDate: Date | null; // ステージアップ日時
  createdAt: Date;
  lastAccessAt: Date;
}

export interface SessionData {
  sessionId: string;
  user: User;
}
