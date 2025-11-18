"use client";
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSessionStore } from '@/lib/stores/sessionStore';
import { STAGE_RULES } from '@/lib/stageRules';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, updateStage } = useSessionStore();

  useEffect(() => {
    if (!user?.sessionId) return;

    const rule = STAGE_RULES.find(r => r.path === pathname);
    if (!rule) return;

    const currentStage = user.stage ?? 0;

    // ガード: stageが進みすぎている場合は戻す
    if (rule.maxStage !== undefined && currentStage > rule.maxStage) {
      console.log(`[StageGuard] stage ${currentStage} > maxStage ${rule.maxStage}, redirecting to /`);
      router.push('/');
      return;
    }

    // 自動進行: 条件を満たせばstageを更新
    if (currentStage === rule.requiredStage && currentStage < rule.nextStage) {
      console.log(`[StageGuard] Advancing stage from ${currentStage} to ${rule.nextStage}`);
      fetch(`/api/session/stage?sessionId=${user.sessionId}&stage=${rule.nextStage}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            updateStage(data.user.stage);
          }
        })
        .catch(err => console.error('[StageGuard] Failed to update stage:', err));
    }
  }, [pathname, user, router, updateStage]);

  return <>{children}</>;
}
