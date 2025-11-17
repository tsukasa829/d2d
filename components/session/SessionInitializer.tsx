"use client";
import { useEffect } from 'react';
import { useSessionStore } from '@/lib/stores/sessionStore';

export function SessionInitializer({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useSessionStore();

  useEffect(() => {
    if (!user) {
      // LocalStorageからsessionIdを取得
      const savedSessionId = localStorage.getItem('sessionId');
      
      if (savedSessionId) {
        // 既存セッションを取得
        fetch(`/api/admin/users/${savedSessionId}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.user) {
              setUser(data.user);
            } else {
              // セッションが見つからない場合は新規作成
              createNewSession();
            }
          })
          .catch(() => createNewSession());
      } else {
        // sessionIdがない場合は新規作成
        createNewSession();
      }
    }

    function createNewSession() {
      fetch('/api/session/init', { method: 'POST' })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
            localStorage.setItem('sessionId', data.user.sessionId);
          }
        })
        .catch((err) => console.error('[SessionInitializer] Failed to init session:', err));
    }
  }, [user, setUser]);

  return <>{children}</>;
}
