"use client";
import { useRouter } from 'next/navigation';

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-[100svh] bg-yellow-50 flex items-center justify-center">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="text-yellow-500 text-6xl mb-4">⚠</div>
        <h1 className="text-2xl font-bold text-yellow-600 mb-4">購入がキャンセルされました</h1>
        <p className="text-gray-700 mb-6">
          決済がキャンセルされました。<br />
          もう一度お試しいただくか、トップへお戻りください。
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push('/product/1daypass')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            購入ページへ
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            トップへ戻る
          </button>
        </div>
      </div>
    </div>
  );
}
