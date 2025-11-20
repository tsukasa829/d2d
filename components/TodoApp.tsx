'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/lib/stores';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Todo } from '@/lib/types/todo';
import { createTodo as createTodoAction, deleteTodoAction, toggleTodoAction, getTodos as getTodosAction } from '@/lib/actions';

export default function TodoApp() {
  const { currentUser, setUser } = useUserStore();
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();

  // Todos取得用Query
  const {
    data: todos = [],
    isLoading,
    error
  } = useQuery<Todo[], Error>({
    queryKey: ['todos', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      return await getTodosAction(currentUser.id);
    },
    enabled: !!currentUser && isInitialized,
  });

  // 追加Mutation (楽観的更新)
  const addTodoMutation = useMutation({
    mutationFn: async ({ userId, title }: { userId: string; title: string }) => {
      return await createTodoAction(userId, title);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['todos', variables.userId] });
      const prev = queryClient.getQueryData<Todo[]>(['todos', variables.userId]) || [];
      const optimistic: Todo = {
        id: 'optimistic-' + Date.now(),
        user_id: variables.userId,
        title: variables.title,
        completed: false,
        created_at: new Date()
      } as Todo;
      queryClient.setQueryData(['todos', variables.userId], [optimistic, ...prev]);
      return { prev };
    },
    onError: (_err, variables, context) => {
      if (context?.prev) {
        queryClient.setQueryData(['todos', variables.userId], context.prev);
      }
    },
    onSuccess: (data, variables) => {
      const current = queryClient.getQueryData<Todo[]>(['todos', variables.userId]) || [];
      queryClient.setQueryData(['todos', variables.userId], [data, ...current.filter(t => !t.id.startsWith('optimistic-'))]);
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['todos', variables.userId] });
    }
  });

  // Toggle Mutation
  const toggleTodoMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      return await toggleTodoAction(id, completed);
    },
    onMutate: async (variables) => {
      const userId = currentUser?.id;
      if (!userId) return;
      await queryClient.cancelQueries({ queryKey: ['todos', userId] });
      const prev = queryClient.getQueryData<Todo[]>(['todos', userId]) || [];
      queryClient.setQueryData(['todos', userId], prev.map(t => t.id === variables.id ? { ...t, completed: variables.completed } : t));
      return { prev };
    },
    onError: (_err, _vars, context) => {
      const userId = currentUser?.id;
      if (userId && context?.prev) {
        queryClient.setQueryData(['todos', userId], context.prev);
      }
    },
    onSettled: () => {
      const userId = currentUser?.id;
      if (userId) queryClient.invalidateQueries({ queryKey: ['todos', userId] });
    }
  });

  // Delete Mutation
  const deleteTodoMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      return await deleteTodoAction(id);
    },
    onMutate: async (variables) => {
      const userId = currentUser?.id;
      if (!userId) return;
      await queryClient.cancelQueries({ queryKey: ['todos', userId] });
      const prev = queryClient.getQueryData<Todo[]>(['todos', userId]) || [];
      queryClient.setQueryData(['todos', userId], prev.filter(t => t.id !== variables.id));
      return { prev };
    },
    onError: (_err, _vars, context) => {
      const userId = currentUser?.id;
      if (userId && context?.prev) {
        queryClient.setQueryData(['todos', userId], context.prev);
      }
    },
    onSettled: () => {
      const userId = currentUser?.id;
      if (userId) queryClient.invalidateQueries({ queryKey: ['todos', userId] });
    }
  });

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 動的インポートでServer Actionsを使用
        const { initializeDatabase } = await import('@/lib/actions');
        const result = await initializeDatabase();
        
        if (result.success && result.user) {
          setUser(result.user);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Initialization failed:', error);
      }
    };

    initializeApp();
  }, [setUser]);

  // React Queryが自動でロードするので不要になった

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newTodoTitle.trim()) return;

    addTodoMutation.mutate({ userId: currentUser.id, title: newTodoTitle });
    setNewTodoTitle('');
  };

  const handleToggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    toggleTodoMutation.mutate({ id, completed: !todo.completed });
  };

  const handleDeleteTodo = async (id: string) => {
    deleteTodoMutation.mutate({ id });
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">初期化中...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">ユーザー情報を読み込めませんでした</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ToDoアプリ</h1>
          <p className="text-gray-600">
            ようこそ、<span className="font-semibold">{currentUser.name}</span>さん
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {/* 環境判定を簡略化（型エラー回避） */}
            データベース稼働中
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleAddTodo} className="flex gap-2">
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="新しいToDoを入力..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !newTodoTitle.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              追加
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error.message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              ToDo一覧 ({todos.length}件)
            </h2>
          </div>

          {isLoading && todos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              読み込み中...
            </div>
          ) : todos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              ToDoがありません。上のフォームから追加してください。
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleTodo(todo.id)}
                      className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <span
                      className={`flex-1 ${
                        todo.completed
                          ? 'line-through text-gray-400'
                          : 'text-gray-800'
                      }`}
                    >
                      {todo.title}
                    </span>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      削除
                    </button>
                  </div>
                  <div className="ml-8 mt-1 text-xs text-gray-400">
                    {new Date(todo.created_at).toLocaleString('ja-JP')}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
