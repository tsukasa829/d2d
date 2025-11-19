"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSessionStore } from "@/lib/stores/sessionStore";

export default function StageUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, updateStage } = useSessionStore();

  useEffect(() => {
    const nextStageParam = searchParams.get("nextStage");
    
    if (!nextStageParam || !user) {
      router.push("/");
      return;
    }

    const nextStage = Number(nextStageParam);
    
    if (isNaN(nextStage)) {
      router.push("/");
      return;
    }

    const currentStage = user.stage ?? 0;

    console.log('[StageUp] Current stage:', currentStage, 'Next stage:', nextStage);

    if (nextStage <= currentStage) {
      console.log('[StageUp] Rejected: nextStage <= currentStage');
      router.push("/");
      return;
    }

    // ステージ更新処理
    const updateUserStage = async () => {
      try {
        console.log('[StageUp] Sending POST to /api/session/stage with stage:', nextStage, 'sessionId:', user.sessionId);
        const response = await fetch("/api/session/stage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stage: nextStage, sessionId: user.sessionId }),
        });

        console.log('[StageUp] Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('[StageUp] API response:', data);
          updateStage(nextStage);
        } else {
          const errorData = await response.json();
          console.error('[StageUp] API error:', errorData);
        }
      } catch (error) {
        console.error("Stage update error:", error);
      } finally {
        router.push("/");
      }
    };

    updateUserStage();
  }, [searchParams, user, updateStage, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B794F6]/20 via-[#9333EA]/20 to-[#7E22CE]/20 flex items-center justify-center p-4">
      <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border-2 border-white/40 p-8 max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9333EA] mx-auto mb-4"></div>
        <p className="text-gray-700">読み込み中...</p>
      </div>
    </div>
  );
}
