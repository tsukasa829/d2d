import { create } from 'zustand';
import { Todo } from '../types/todo';
import { getTodos, createTodo, toggleTodoAction, deleteTodoAction } from '../lib/actions';

interface TodoState {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  loadTodos: (userId: string) => Promise<void>;
  addTodo: (userId: string, title: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  isLoading: false,
  error: null,

  loadTodos: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const todos = await getTodos(userId);
      set({ todos, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load todos',
        isLoading: false 
      });
    }
  },

  addTodo: async (userId: string, title: string) => {
    if (!title.trim()) {
      set({ error: 'Title cannot be empty' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const newTodo = await createTodo(userId, title);
      set(state => ({ 
        todos: [newTodo, ...state.todos],
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add todo',
        isLoading: false 
      });
    }
  },

  toggleTodo: async (id: string) => {
    const { todos } = get();
    const todo = todos.find(t => t.id === id);
    
    if (!todo) {
      set({ error: 'Todo not found' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const updatedTodo = await toggleTodoAction(id, !todo.completed);
      set(state => ({
        todos: state.todos.map(t => t.id === id ? updatedTodo : t),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update todo',
        isLoading: false 
      });
    }
  },

  deleteTodo: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteTodoAction(id);
      set(state => ({
        todos: state.todos.filter(t => t.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete todo',
        isLoading: false 
      });
    }
  },
}));
