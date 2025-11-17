"use client";
import { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSessionStore } from "@/lib/stores/sessionStore";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, toggleTrial } = useSessionStore();
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
        const dedupeKey = `${targetUserId}:trial`;
        const completedKey = `granted:${dedupeKey}`;
        if (sessionStorage.getItem(completedKey) === '1') {
          setProcessing(false);
          return;
        }

        const res = await fetch(`/api/admin/users/${targetUserId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trial: true }),
        });

        if (!res.ok) {
          throw new Error('フラグの更新に失敗しました');
        }

        // 完了記録（同一セッション内の二重実行を防止）
        sessionStorage.setItem(completedKey, '1');

        if (targetUserId === user?.sessionId) {
          toggleTrial();
        }

        setProcessing(false);
      } catch (err: any) {
        console.error('Error granting trial:', err);
        setError(err.message || '処理中にエラーが発生しました');
        setProcessing(false);
      }
    };

    if (hasRunRef.current) return;
    hasRunRef.current = true;
    grantPass();
  }, [searchParams, user, toggleTrial]);

  if (processing) {
    return (
      <div className="min-h-[100svh] bg-blue-50 flex items-center justify-center">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700">処理中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[100svh] bg-red-50 flex items-center justify-center">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">エラー</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
          >
            トップに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-blue-50 flex items-center justify-center">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="mb-4">
          <svg
            className="w-16 h-16 mx-auto text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          トライアル開始完了
        </h1>
        <p className="text-gray-600 mb-6">
          トライアルが正常に開始されました。<br />
          ご利用いただきありがとうございます。
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          トップに戻る
        </button>
      </div>
    </div>
  );
}

export default function TrialSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100svh] bg-blue-50 flex items-center justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
