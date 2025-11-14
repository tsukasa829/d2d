"use client";
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSessionStore } from '@/src/stores/sessionStore';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, grant1DayPass } = useSessionStore();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const grantPass = async () => {
      try {
        // URLパラメータからuserIdを取得（存在すれば）
        const userIdFromUrl = searchParams.get('userId');
        const targetUserId = userIdFromUrl || user?.sessionId;

        if (!targetUserId) {
          setError('ユーザーIDが見つかりません');
          setProcessing(false);
          return;
        }

        // API経由でフラグを立てる
        const res = await fetch(`/api/admin/users/${targetUserId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ has1DayPass: true }),
        });

        if (!res.ok) {
          throw new Error('フラグの更新に失敗しました');
        }

        // Zustand storeを更新（現在のユーザーの場合）
        if (targetUserId === user?.sessionId) {
          grant1DayPass();
        }

        setProcessing(false);
      } catch (err: any) {
        console.error('Error granting 1-day pass:', err);
        setError(err.message || '処理中にエラーが発生しました');
        setProcessing(false);
      }
    };

    grantPass();
  }, [searchParams, user, grant1DayPass]);

  if (processing) {
    return (
      <div className="min-h-[100svh] bg-green-50 flex items-center justify-center">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
          <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
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
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            トップへ戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-green-50 flex items-center justify-center">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-green-600 mb-4">購入完了！</h1>
        <p className="text-gray-700 mb-6">
          1日パスが有効になりました。<br />
          コンテンツをお楽しみください。
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          トップへ戻る
        </button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[100svh] bg-green-50 flex items-center justify-center">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
          <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700">読み込み中...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
