import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/session';

interface SessionStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  updateEmail: (email: string) => void;
  toggleTrial: () => void;
  grant1DayPass: () => void;
  grantStandard: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      updateEmail: (email) =>
        set((state) =>
          state.user ? { user: { ...state.user, email } } : state
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
