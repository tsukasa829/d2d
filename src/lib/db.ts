import { getDBClient } from './dbClient';
import { User } from '../types/user';
import { Todo } from '../types/todo';

export async function getAllTodos(userId: string): Promise<Todo[]> {
  const client = getDBClient();
  const result = await client.query<Todo>(
    'SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  
  return result.rows.map(row => ({
    ...row,
    created_at: new Date(row.created_at),
  }));
}

export async function createTodo(userId: string, title: string): Promise<Todo> {
  const client = getDBClient();
  const result = await client.query<Todo>(
    'INSERT INTO todos (user_id, title) VALUES ($1, $2) RETURNING *',
    [userId, title]
  );
  
  const todo = result.rows[0];
  return {
    ...todo,
    created_at: new Date(todo.created_at),
  };
}

export async function updateTodo(id: string, data: Partial<Pick<Todo, 'title' | 'completed'>>): Promise<Todo> {
  const client = getDBClient();
  
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;
  
  if (data.title !== undefined) {
    updates.push(`title = $${paramIndex++}`);
    values.push(data.title);
  }
  
  if (data.completed !== undefined) {
    updates.push(`completed = $${paramIndex++}`);
    values.push(data.completed);
  }
  
  if (updates.length === 0) {
    throw new Error('No fields to update');
  }
  
  values.push(id);
  
  const result = await client.query<Todo>(
    `UPDATE todos SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );
  
  if (result.rows.length === 0) {
    throw new Error('Todo not found');
  }
  
  const todo = result.rows[0];
  return {
    ...todo,
    created_at: new Date(todo.created_at),
  };
}

export async function deleteTodo(id: string): Promise<void> {
  const client = getDBClient();
  const result = await client.query(
    'DELETE FROM todos WHERE id = $1',
    [id]
  );
  
  if (result.rowCount === 0) {
    throw new Error('Todo not found');
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const client = getDBClient();
  const result = await client.query<User>(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  const user = result.rows[0];
  return {
    ...user,
    created_at: new Date(user.created_at),
  };
}

export async function createUser(email: string, name: string, googleId?: string): Promise<User> {
  const client = getDBClient();
  const result = await client.query<User>(
    'INSERT INTO users (email, name, google_id) VALUES ($1, $2, $3) RETURNING *',
    [email, name, googleId || null]
  );
  
  const user = result.rows[0];
  return {
    ...user,
    created_at: new Date(user.created_at),
  };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const client = getDBClient();
  const result = await client.query<User>(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  const user = result.rows[0];
  return {
    ...user,
    created_at: new Date(user.created_at),
  };
}
