'use server';

import * as db from './db';
import { runMigrations } from './migrate';
import { User } from './types/user';
import { Todo } from './types/todo';

export async function initializeDatabase(): Promise<{ success: boolean; user: User | null; error?: string }> {
  try {
    await runMigrations();
    
    const demoEmail = 'demo@example.com';
    let user = await db.getUserByEmail(demoEmail);
    
    if (!user) {
      user = await db.createUser(demoEmail, 'デモユーザー');
    }
    
    return { success: true, user };
  } catch (error) {
    console.error('Initialization error:', error);
    return {
      success: false,
      user: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getTodos(userId: string): Promise<Todo[]> {
  return db.getAllTodos(userId);
}

export async function createTodo(userId: string, title: string): Promise<Todo> {
  return db.createTodo(userId, title);
}

export async function toggleTodoAction(id: string, completed: boolean): Promise<Todo> {
  return db.updateTodo(id, { completed });
}

export async function deleteTodoAction(id: string): Promise<void> {
  console.log('deleteTodoAction called with id:', id);
  try {
    const result = await db.deleteTodo(id);
    console.log('deleteTodoAction success');
    return result;
  } catch (error) {
    console.error('deleteTodoAction error:', error);
    throw error;
  }
}
