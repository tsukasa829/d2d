export interface User {
  id: string;          // UUID
  email: string;
  name: string;
  google_id?: string;  // 将来のOAuth用 (snake_case: DBカラム名に合わせる)
  created_at: Date;
}
