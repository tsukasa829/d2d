"use client";
import StripeBuyButton from '@/components/stripe/StripeBuyButton';
import { useSessionStore } from '@/lib/stores/sessionStore';

export default function OneDayPassPage() {
  const { user } = useSessionStore();

  return (
    <div className="min-h-[100svh] bg-white">
      <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold mb-4">1日お試しパス</h1>
      <p className="text-gray-700 mb-6">
        7日間のプログラムの前に、まずは1日だけのお試しで体験できます。
        操作感や内容を確認してから本購入をご検討ください。
      </p>

      <div className="rounded-lg border bg-white p-6 shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-2">含まれる内容</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>初日コンテンツのフルアクセス</li>
          <li>基本ガイドとスタートチェックリスト</li>
          <li>チャットサポートの体験</li>
        </ul>
      </div>

      <div className="mb-6">
        <StripeBuyButton clientReferenceId={user?.sessionId} />
      </div>

      <p className="text-xs text-gray-500">
        注: 表示されない場合は環境変数
        <code className="mx-1">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> と
        <code className="mx-1">NEXT_PUBLIC_STRIPE_BUY_BUTTON_ID</code> を設定し、サーバーを再起動してください。
      </p>
      </div>
    </div>
  );
}
