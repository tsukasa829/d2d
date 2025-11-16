import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSessionStore } from '@/stores/sessionStore';
import StandardPlanSuccessPage from '../page';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock('@/stores/sessionStore', () => ({
  useSessionStore: vi.fn(),
}));

global.fetch = vi.fn();

describe('StandardPlanSuccessPage', () => {
  const mockPush = vi.fn();
  const mockGrantStandard = vi.fn();
  const mockSearchParams = {
    get: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push: mockPush });
    (useSearchParams as any).mockReturnValue(mockSearchParams);
    (useSessionStore as any).mockReturnValue({
      user: { sessionId: 'test-user-123', email: null, trial: false, has1DayPass: false, hasStandard: false, createdAt: new Date().toISOString(), lastAccessAt: new Date().toISOString() },
      grantStandard: mockGrantStandard,
    });

    global.localStorage = {
      getItem: vi.fn(() => 'test-user-123'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    } as any;

    global.sessionStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    } as any;

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
  });

  it('処理中に「処理中...」を表示する', () => {
    render(<StandardPlanSuccessPage />);
    expect(screen.getByText('処理中...')).toBeInTheDocument();
  });

  it('成功時に完了メッセージを表示する', async () => {
    render(<StandardPlanSuccessPage />);

    await waitFor(() => {
      expect(screen.getByText('スタンダードプランが有効化されました')).toBeInTheDocument();
    }, { timeout: 6000 });
  });

  it('localStorageからsessionIdを取得してPATCHする', async () => {
    render(<StandardPlanSuccessPage />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/admin/users/test-user-123',
        expect.objectContaining({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hasStandard: true }),
        })
      );
    }, { timeout: 6000 });
  });

  it('URLパラメータのuserIdを優先して使用する', async () => {
    mockSearchParams.get.mockImplementation((key: string) => {
      if (key === 'userId') return 'url-user-456';
      return null;
    });

    render(<StandardPlanSuccessPage />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/admin/users/url-user-456',
        expect.anything()
      );
    }, { timeout: 6000 });
  });

  it('API失敗時にエラーを表示する', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
    });

    render(<StandardPlanSuccessPage />);

    await waitFor(() => {
      expect(screen.getByText('エラー')).toBeInTheDocument();
      expect(screen.getByText('フラグの更新に失敗しました')).toBeInTheDocument();
    }, { timeout: 6000 });
  });

  it('sessionIdが解決できない場合はエラーを表示する', async () => {
    (useSessionStore as any).mockReturnValue({
      user: null,
      grantStandard: mockGrantStandard,
    });
    global.localStorage.getItem = vi.fn(() => null);
    mockSearchParams.get.mockReturnValue(null);

    render(<StandardPlanSuccessPage />);

    await waitFor(() => {
      expect(screen.getByText('ユーザーIDが見つかりません')).toBeInTheDocument();
    }, { timeout: 7000 });
  }, 10000);

  it('sessionStorageのデデュープキーで重複実行を防ぐ', async () => {
    global.sessionStorage.getItem = vi.fn((key) => {
      if (key === 'granted:test-user-123:standard') return '1';
      return null;
    });

    render(<StandardPlanSuccessPage />);

    await waitFor(() => {
      expect(screen.getByText('スタンダードプランが有効化されました')).toBeInTheDocument();
    }, { timeout: 6000 });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('現在のユーザーの場合、ZustandのgrantStandardを呼ぶ', async () => {
    render(<StandardPlanSuccessPage />);

    await waitFor(() => {
      expect(mockGrantStandard).toHaveBeenCalled();
    }, { timeout: 6000 });
  });

  it('別ユーザーのsessionIdの場合、Zustandは更新しない', async () => {
    mockSearchParams.get.mockImplementation((key: string) => {
      if (key === 'userId') return 'other-user-999';
      return null;
    });

    render(<StandardPlanSuccessPage />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    }, { timeout: 6000 });

    expect(mockGrantStandard).not.toHaveBeenCalled();
  });
});
