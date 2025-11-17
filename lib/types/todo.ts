export interface Todo {
  id: string;          // UUID
  user_id: string;     // UUID
  title: string;
  completed: boolean;
  created_at: Date;
}
