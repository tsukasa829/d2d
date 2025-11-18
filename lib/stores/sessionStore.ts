import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/session';

interface SessionStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  updateEmail: (email: string) => void;
  updateStage: (stage: number) => void;
  toggleTrial: () => void;
  grant1DayPass: () => void;
  grantStandard: () => void;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      updateEmail: (email) =>
        set((state) =>
          state.user ? { user: { ...state.user, email } } : state
        ),
      updateStage: (stage) =>
        set((state) =>
          state.user ? { user: { ...state.user, stage } } : state
        ),
      toggleTrial: () =>
        set((state) =>
          state.user ? { user: { ...state.user, trial: !state.user.trial } } : state
        ),
      grant1DayPass: () =>
        set((state) =>
          state.user ? { user: { ...state.user, has1DayPass: true } } : state
        ),
      grantStandard: () =>
        set((state) =>
          state.user ? { user: { ...state.user, hasStandard: true } } : state
        ),
    }),
    {
      name: 'session-storage',
    }
  )
);
