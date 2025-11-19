"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSessionStore } from "@/lib/stores/sessionStore";

export default function StageUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, updateStage } = useSessionStore();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const nextStageParam = searchParams.get("nextStage");
    
    if (!nextStageParam) {
      setStatus("error");
      setMessage("nextStageパラメータが指定されていません");
      return;
    }

    const nextStage = Number(nextStageParam);
    
    if (isNaN(nextStage)) {
      setStatus("error");
      setMessage("nextStageパラメータが無効です");
      return;
    }

    if (!user) {
      setStatus("error");
      setMessage("ユーザーセッションが見つかりません");
      return;
    }

    const currentStage = user.stage ?? 0;

    if (nextStage <= currentStage) {
      setStatus("error");
      setMessage(`現在のステージ(${currentStage})より高いステージを指定してください`);
      return;
    }

    // ステージ更新処理
    const updateUserStage = async () => {
      try {
        const response = await fetch("/api/session/stage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stage: nextStage }),
        });

        if (!response.ok) {
          throw new Error("ステージ更新に失敗しました");
        }

        updateStage(nextStage);
        setStatus("success");
        setMessage(`ステージ ${nextStage} に更新しました`);
        
        // 成功後、2秒待ってホームに戻る
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } catch (error) {
        setStatus("error");
        setMessage("ステージ更新中にエラーが発生しました");
      }
    };

    updateUserStage();
  }, [searchParams, user, updateStage, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B794F6]/20 via-[#9333EA]/20 to-[#7E22CE]/20 flex items-center justify-center p-4">
      <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border-2 border-white/40 p-8 max-w-md w-full text-center">
        {status === "processing" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9333EA] mx-auto mb-4"></div>
            <p className="text-gray-700">ステージを更新中...</p>
          </>
        )}
        
        {status === "success" && (
          <>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-800 font-medium">{message}</p>
            <p className="text-gray-600 text-sm mt-2">ホームページに戻ります...</p>
          </>
        )}
        
        {status === "error" && (
          <>
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-gray-800 font-medium">{message}</p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-6 py-2 bg-[#9333EA] text-white rounded-lg hover:bg-[#7E22CE] transition-colors"
            >
              ホームに戻る
            </button>
          </>
        )}
      </div>
    </div>
  );
}
