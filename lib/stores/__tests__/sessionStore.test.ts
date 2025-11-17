import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSessionStore } from '../sessionStore';

describe('sessionStore', () => {
  beforeEach(() => {
    useSessionStore.setState({ user: null });
  });

  it('初期状態はuserがnull', () => {
    const { user } = useSessionStore.getState();
    expect(user).toBeNull();
  });

  it('setUserでユーザーを設定できる', () => {
    const { setUser } = useSessionStore.getState();
    const mockUser = {
      sessionId: 'test-123',
      email: null,
      trial: false,
      has1DayPass: false,
      hasStandard: false,
      createdAt: new Date(),
      lastAccessAt: new Date(),
    };
    setUser(mockUser);
    const { user } = useSessionStore.getState();
    expect(user?.sessionId).toBe('test-123');
  });

  it('updateEmailでメールアドレスを更新', () => {
    const { setUser, updateEmail } = useSessionStore.getState();
    setUser({
      sessionId: 'test-123',
      email: null,
      trial: false,
      has1DayPass: false,
      hasStandard: false,
      createdAt: new Date(),
      lastAccessAt: new Date(),
    });
    updateEmail('test@example.com');
    const { user } = useSessionStore.getState();
    expect(user?.email).toBe('test@example.com');
  });

  it('toggleTrialでトライアルフラグを切り替え', () => {
    const { setUser, toggleTrial } = useSessionStore.getState();
    setUser({
      sessionId: 'test-123',
      email: null,
      trial: false,
      has1DayPass: false,
      hasStandard: false,
      createdAt: new Date(),
      lastAccessAt: new Date(),
    });
    
    // false → true
    toggleTrial();
    expect(useSessionStore.getState().user?.trial).toBe(true);
    
    // true → false
    toggleTrial();
    expect(useSessionStore.getState().user?.trial).toBe(false);
  });

  it('grant1DayPassで1日パスを付与', () => {
    const { setUser, grant1DayPass } = useSessionStore.getState();
    setUser({
      sessionId: 'test-123',
      email: null,
      trial: false,
      has1DayPass: false,
      hasStandard: false,
      createdAt: new Date(),
      lastAccessAt: new Date(),
    });
    grant1DayPass();
    const { user } = useSessionStore.getState();
    expect(user?.has1DayPass).toBe(true);
  });

  it('grantStandardでStandardを付与', () => {
    const { setUser, grantStandard } = useSessionStore.getState();
    setUser({
      sessionId: 'test-123',
      email: null,
      trial: false,
      has1DayPass: false,
      hasStandard: false,
      createdAt: new Date(),
      lastAccessAt: new Date(),
    });
    grantStandard();
    const { user } = useSessionStore.getState();
    expect(user?.hasStandard).toBe(true);
  });
});
