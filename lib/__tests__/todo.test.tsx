import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider, useMutation, useQuery } from '@tanstack/react-query';
import { ReactNode } from 'react';
import * as actions from '../actions';
import type { Todo } from '../../types/todo';

// Server Actionsをモック
vi.mock('../actions', () => ({
  getTodos: vi.fn(),
  createTodo: vi.fn(),
  toggleTodoAction: vi.fn(),
  deleteTodoAction: vi.fn(),
}));

// テスト用QueryClientラッパー
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

describe('Todoロジックテスト', () => {
  const mockUserId = 'test-user-123';
  const mockTodo: Todo = {
    id: 'todo-1',
    user_id: mockUserId,
    title: 'テストTodo',
    completed: false,
    created_at: new Date('2025-01-01'),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Todo取得', () => {
    it('ユーザーIDでTodo一覧を取得できる', async () => {
      const mockTodos = [mockTodo];
      vi.mocked(actions.getTodos).mockResolvedValue(mockTodos);

      const { result } = renderHook(
        () =>
          useQuery({
            queryKey: ['todos', mockUserId],
            queryFn: () => actions.getTodos(mockUserId),
          }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockTodos);
      expect(actions.getTodos).toHaveBeenCalledWith(mockUserId);
    });

    it('取得エラー時はエラー状態になる', async () => {
      vi.mocked(actions.getTodos).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(
        () =>
          useQuery({
            queryKey: ['todos', mockUserId],
            queryFn: () => actions.getTodos(mockUserId),
          }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error?.message).toBe('Network error');
    });
  });

  describe('Todo追加', () => {
    it('新しいTodoを追加できる', async () => {
      const newTodo = { ...mockTodo, id: 'todo-2', title: '新しいTodo' };
      vi.mocked(actions.createTodo).mockResolvedValue(newTodo);

      const { result } = renderHook(
        () =>
          useMutation({
            mutationFn: ({ userId, title }: { userId: string; title: string }) =>
              actions.createTodo(userId, title),
          }),
        { wrapper: createWrapper() }
      );

      result.current.mutate({ userId: mockUserId, title: '新しいTodo' });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(newTodo);
      expect(actions.createTodo).toHaveBeenCalledWith(mockUserId, '新しいTodo');
    });

    it('空のタイトルでも呼び出しは可能（バリデーションはUI層）', async () => {
      const emptyTodo = { ...mockTodo, id: 'todo-3', title: '' };
      vi.mocked(actions.createTodo).mockResolvedValue(emptyTodo);

      const { result } = renderHook(
        () =>
          useMutation({
            mutationFn: ({ userId, title }: { userId: string; title: string }) =>
              actions.createTodo(userId, title),
          }),
        { wrapper: createWrapper() }
      );

      result.current.mutate({ userId: mockUserId, title: '' });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(actions.createTodo).toHaveBeenCalledWith(mockUserId, '');
    });
  });

  describe('Todo更新（Toggle）', () => {
    it('Todoのcompletedをトグルできる', async () => {
      const toggledTodo = { ...mockTodo, completed: true };
      vi.mocked(actions.toggleTodoAction).mockResolvedValue(toggledTodo);

      const { result } = renderHook(
        () =>
          useMutation({
            mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
              actions.toggleTodoAction(id, completed),
          }),
        { wrapper: createWrapper() }
      );

      result.current.mutate({ id: mockTodo.id, completed: true });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.completed).toBe(true);
      expect(actions.toggleTodoAction).toHaveBeenCalledWith(mockTodo.id, true);
    });

    it('存在しないTodoのトグルはエラーになる', async () => {
      vi.mocked(actions.toggleTodoAction).mockRejectedValue(
        new Error('Todo not found')
      );

      const { result } = renderHook(
        () =>
          useMutation({
            mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
              actions.toggleTodoAction(id, completed),
          }),
        { wrapper: createWrapper() }
      );

      result.current.mutate({ id: 'non-existent', completed: true });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error?.message).toBe('Todo not found');
    });
  });

  describe('Todo削除', () => {
    it('Todoを削除できる', async () => {
      vi.mocked(actions.deleteTodoAction).mockResolvedValue(undefined);

      const { result } = renderHook(
        () =>
          useMutation({
            mutationFn: ({ id }: { id: string }) => actions.deleteTodoAction(id),
          }),
        { wrapper: createWrapper() }
      );

      result.current.mutate({ id: mockTodo.id });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(actions.deleteTodoAction).toHaveBeenCalledWith(mockTodo.id);
    });

    it('存在しないTodoの削除はエラーになる', async () => {
      vi.mocked(actions.deleteTodoAction).mockRejectedValue(
        new Error('Todo not found')
      );

      const { result } = renderHook(
        () =>
          useMutation({
            mutationFn: ({ id }: { id: string }) => actions.deleteTodoAction(id),
          }),
        { wrapper: createWrapper() }
      );

      result.current.mutate({ id: 'non-existent' });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error?.message).toBe('Todo not found');
    });
  });

  describe('楽観的更新ロジック', () => {
    it('Mutation実行前にキャッシュを更新し、失敗時にロールバックする', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
      });

      const Wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );
      const wrapper = Wrapper;

      // 初期データをキャッシュに設定
      queryClient.setQueryData(['todos', mockUserId], [mockTodo]);

      vi.mocked(actions.deleteTodoAction).mockRejectedValue(new Error('Delete failed'));

      const { result } = renderHook(
        () =>
          useMutation({
            mutationFn: ({ id }: { id: string }) => actions.deleteTodoAction(id),
            onMutate: async (variables) => {
              await queryClient.cancelQueries({ queryKey: ['todos', mockUserId] });
              const prev = queryClient.getQueryData<Todo[]>(['todos', mockUserId]) || [];
              // 楽観的削除
              queryClient.setQueryData(
                ['todos', mockUserId],
                prev.filter((t) => t.id !== variables.id)
              );
              return { prev };
            },
            onError: (_err, _vars, context) => {
              // ロールバック
              if (context?.prev) {
                queryClient.setQueryData(['todos', mockUserId], context.prev);
              }
            },
          }),
        { wrapper }
      );

      // 削除実行
      result.current.mutate({ id: mockTodo.id });

      // 楽観的更新でキャッシュが空になる
      await waitFor(() => {
        const data = queryClient.getQueryData<Todo[]>(['todos', mockUserId]);
        return data?.length === 0;
      });

      // エラー後ロールバック
      await waitFor(() => expect(result.current.isError).toBe(true));

      const restoredData = queryClient.getQueryData<Todo[]>(['todos', mockUserId]);
      expect(restoredData).toEqual([mockTodo]);
    });
  });
});
