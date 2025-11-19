"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { Calendar } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useSessionStore } from "@/lib/stores/sessionStore";

export default function Home() {
  const { user } = useSessionStore();
  const stage = user?.stage ?? 0;

  const days = [
    { day: 1, title: "初回カウンセリング", completed: stage >= 1, path: "/chat/day1-confirm" },
    { day: 2, title: "ストレス要因の特定", completed: stage >= 2, path: "/chat/day2" },
    { day: 3, title: "対処法の検討", completed: stage >= 3, path: "/chat/day3" },
    { day: 4, title: "実践とフィードバック", completed: stage >= 4, path: "/chat/day4" },
    { day: 5, title: "進捗確認", completed: stage >= 5, path: "/chat/day5" },
    { day: 6, title: "振り返りと調整", completed: stage >= 6, path: "/chat/day6" },
    { day: 7, title: "総合評価", completed: stage >= 7, path: "/chat/day7" },
  ];
  const completedCount = days.filter((d) => d.completed).length;

  return (
    <div className="h-screen flex flex-col max-w-md mx-auto bg-gradient-to-br from-[#E9D5FF] via-purple-100 to-[#B794F6]">
      {/* Header (shared) */}
      <PageHeader title="D2D" subtitle="あなたを変える７日間プログラム">
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
            const currentDay = Math.floor(stage);
            const isCurrentDay = day.day === currentDay && !day.completed;
            
            const DayCard = (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border-2 transition-all ${
                  day.completed 
                    ? 'border-white/60 opacity-60 cursor-not-allowed'
                    : isCurrentDay
                    ? 'border-[#9333EA] hover:shadow-xl hover:bg-white/70 cursor-pointer'
                    : 'border-white/40 hover:shadow-xl hover:bg-white/70 cursor-pointer'
                }`}
              >
                <div className="p-5 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/40 shadow-lg ${
                    day.completed 
                      ? 'bg-gradient-to-br from-[#B794F6]/80 to-[#9333EA]/80 text-white' 
                      : 'bg-white/60 text-[#9333EA]'
                  }`}>
                    {day.completed ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span>{day.day}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className={`${day.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>Day {day.day}</h3>
                    </div>
                    <p className={`${day.completed ? 'text-gray-500' : 'text-gray-700'}`}>{day.title}</p>
                  </div>
                </div>
              </motion.div>
            );

            return day.completed ? (
              <div key={day.day}>{DayCard}</div>
            ) : (
              <Link key={day.day} href={day.path} className="block">
                {DayCard}
              </Link>
            );
          })}
        </div>

        <div className="mt-8 space-y-3">
          <Link
            href="/day2/waiting"
            className="w-full px-6 py-4 bg-white/60 backdrop-blur-md border border-white/60 text-[#9333EA] rounded-2xl hover:shadow-xl hover:bg-white/70 transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" /> 次回予約の確認
          </Link>
        </div>
      </div>
    </div>
  );
}
