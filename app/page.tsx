"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { Calendar, Clock } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useSessionStore } from "@/lib/stores/sessionStore";
import { useState, useEffect } from "react";

export default function Home() {
  const { user } = useSessionStore();
  const stage = user?.stage ?? 0;
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  // カウントダウン計算
  useEffect(() => {
    if (!user?.stageupDate) {
      setRemainingSeconds(null);
      return;
    }

    const calculateRemaining = () => {
      if (!user.stageupDate) return;

      // stageが1のときは待機時間0
      if (stage === 1) {
        setRemainingSeconds(null);
        return;
      }

      // stageupDateはUTCで保存されているため、そのまま使用（ブラウザが自動的にローカルタイムゾーンに変換）
      const stageupTime = new Date(user.stageupDate).getTime();
      const oneHourLater = stageupTime + 5 * 60 * 1000; // 5分後
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((oneHourLater - now) / 1000));

      console.log('[Countdown] stageupDate (UTC):', user.stageupDate);
      console.log('[Countdown] stageupTime (local):', new Date(stageupTime).toLocaleString('ja-JP'));
      console.log('[Countdown] oneHourLater (local):', new Date(oneHourLater).toLocaleString('ja-JP'));
      console.log('[Countdown] now (local):', new Date(now).toLocaleString('ja-JP'));
      console.log('[Countdown] remaining seconds:', remaining);

      if (remaining === 0) {
        setRemainingSeconds(null);
      } else {
        setRemainingSeconds(remaining);
      }
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, [user?.stageupDate, stage]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const days = [
    { day: 1, title: "悲しみと仲良くなる", completed: stage > 1, accessible: stage >= 1, path: "/chat/day1" },
    { day: 2, title: "自分の怒りに気づく", completed: stage > 2, accessible: stage >= 2, path: "/chat/day2" },
    { day: 3, title: "封印してきた、本当の願い", completed: stage > 3, accessible: stage >= 3, path: "/chat/day3" },
    { day: 4, title: "あなたの中にいる敵の正体", completed: stage > 4, accessible: stage >= 4, path: "/chat/day4" },
    { day: 5, title: "１人反省会ループを終わらせる", completed: stage > 5, accessible: stage >= 5, path: "/chat/day5" },
    { day: 6, title: "心のなかに自分応援団ができる", completed: stage > 6, accessible: stage >= 6, path: "/chat/day6" },
    { day: 7, title: "頑張らなくても自然に愛される人に", completed: stage > 7, accessible: stage >= 7, path: "/chat/day7" },
  ];
  const completedCount = days.filter((d) => d.completed).length;

  return (
    <div className="h-screen flex flex-col max-w-md mx-auto bg-gradient-to-br from-[#E9D5FF] via-purple-100 to-[#B794F6]">
      {/* Header (shared) */}
      <PageHeader title="D2D" subtitle="本当のあなたに出会う７Dayプログラム">
        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between text-sm">
            <span>進捗状況</span>
            <span>{completedCount}/7 完了</span>
          </div>
          <div className="h-2 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden border border-white/30">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / 7) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-white/90 rounded-full shadow-lg"
            />
          </div>
        </div>
      </PageHeader>

      {/* Day List */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-3">
          {days.map((day, index) => {
            const isActive = day.accessible && !day.completed;
            const isLocked = !day.accessible;
            const isCurrentStage = day.day === Math.floor(stage); // 現在のステージ（最後に完了した日）
            const isCountingDown = isCurrentStage && remainingSeconds !== null && remainingSeconds > 0;

            const DayCard = (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border-2 transition-all ${day.completed
                    ? 'border-white/60 opacity-60 cursor-not-allowed'
                    : isLocked
                      ? 'border-white/30 opacity-40 cursor-not-allowed'
                      : isCountingDown
                        ? 'border-white/40 cursor-not-allowed'
                        : 'border-white/40 hover:shadow-xl hover:bg-white/70 cursor-pointer'
                  }`}
              >
                <div className="p-5 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/40 shadow-lg ${day.completed
                      ? 'bg-gradient-to-br from-[#B794F6]/80 to-[#9333EA]/80 text-white'
                      : isLocked
                        ? 'bg-white/40 text-gray-400'
                        : 'bg-white/60 text-[#9333EA]'
                    }`}>
                    {day.completed ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : isCountingDown ? (
                      <Clock className="w-5 h-5" />
                    ) : (
                      <span>{day.day}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className={`${day.completed ? 'text-gray-500 line-through' : isLocked ? 'text-gray-400' : 'text-gray-800'}`}>
                        Day {day.day}
                      </h3>
                    </div>
                    <p className={`${day.completed ? 'text-gray-500' : isLocked ? 'text-gray-400' : 'text-gray-700'}`}>
                      {day.title}
                    </p>
                    {isCurrentStage && remainingSeconds !== null && remainingSeconds > 0 && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-[#9333EA]">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(remainingSeconds)} で次へ進めます</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );

            return day.completed || isLocked || isCountingDown ? (
              <div key={day.day}>{DayCard}</div>
            ) : (
              <Link key={day.day} href={day.path} className="block">
                {DayCard}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
