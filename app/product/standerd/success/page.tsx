"use client";
import { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSessionStore } from "@/lib/stores/sessionStore";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, grantStandard } = useSessionStore();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const resolveSessionId = () => {
      const qpUser = searchParams.get('userId') || searchParams.get('sessionId');
      if (qpUser) return qpUser;

      try {
        const fromLocal = localStorage.getItem('sessionId');
        if (fromLocal) return fromLocal;
      } catch {}

      try {
        const persisted = JSON.parse(localStorage.getItem('session-storage') || 'null');
        const persistedId = persisted?.state?.user?.sessionId as string | undefined;
        if (persistedId) return persistedId;
      } catch {}

      if (user?.sessionId) return user.sessionId;
      return undefined;
    };

    const grantPass = async () => {
      try {
        // 最大5秒（10回）リトライしてsessionIdを解決
        let targetUserId: string | undefined;
        for (let i = 0; i < 10; i++) {
          targetUserId = resolveSessionId();
          if (targetUserId) break;
          await sleep(500);
        }

        if (!targetUserId) {
          setError('ユーザーIDが見つかりません');
          setProcessing(false);
          return;
        }

        // 同一ユーザーでの重複実行ガード（セッション単位）
        const dedupeKey = `${targetUserId}:standard`;
        const completedKey = `granted:${dedupeKey}`;
        if (sessionStorage.getItem(completedKey) === '1') {
          // 既に処理済みの場合も同じくリダイレクト
          router.push('/stageup?nextStage=4');
          return;
        }

        const res = await fetch(`/api/admin/users/${targetUserId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hasStandard: true }),
        });

        if (!res.ok) {
          throw new Error('フラグの更新に失敗しました');
        }

        // 完了記録（同一セッション内の二重実行を防止）
        sessionStorage.setItem(completedKey, '1');

        if (targetUserId === user?.sessionId) {
          grantStandard();
        }

        setProcessing(false);
        
        // 完了後に/stageup?nextStage=4へリダイレクト
        router.push('/stageup?nextStage=4');
      } catch (err: any) {
        console.error('Error granting standard pass:', err);
        setError(err.message || '処理中にエラーが発生しました');
        setProcessing(false);
      }
    };

    if (hasRunRef.current) return;
    hasRunRef.current = true;
    grantPass();
  }, [searchParams, user, grantStandard]);

  if (processing) {
    return (
      <div className="min-h-[100svh] bg-gradient-to-br from-[#E9D5FF] via-purple-100 to-[#B794F6] flex items-center justify-center">
        <div className="max-w-md p-8 bg-white/80 backdrop-blur-md rounded-lg shadow-lg text-center">
          <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700">処理中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[100svh] bg-gradient-to-br from-[#E9D5FF] via-purple-100 to-[#B794F6] flex items-center justify-center">
        <div className="max-w-md p-8 bg-white/80 backdrop-blur-md rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">エラー</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            トップへ戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-gradient-to-br from-[#E9D5FF] via-purple-100 to-[#B794F6] flex items-center justify-center">
      <div className="max-w-md p-8 bg-white/80 backdrop-blur-md rounded-lg shadow-lg text-center">
        <div className="text-purple-500 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-purple-600 mb-4">スタンダードプラン購入完了</h1>
        <p className="text-gray-700 mb-6">
          スタンダードプランが有効になりました。<br />
          すべてのコンテンツをお楽しみください。
        </p>
      </div>
    </div>
  );
}

export default function StandardSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[100svh] bg-gradient-to-br from-[#E9D5FF] via-purple-100 to-[#B794F6] flex items-center justify-center">
        <div className="max-w-md p-8 bg-white/80 backdrop-blur-md rounded-lg shadow-lg text-center">
          <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700">読み込み中...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
