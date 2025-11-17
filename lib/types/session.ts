export interface User {
  sessionId: string;
  email: string | null;
  trial: boolean;
  has1DayPass: boolean;
  hasStandard: boolean;
  createdAt: Date;
  lastAccessAt: Date;
}

export interface SessionData {
  sessionId: string;
  user: User;
}
