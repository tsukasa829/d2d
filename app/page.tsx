"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { Calendar } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

export default function Home() {
  const days = [
    { day: 1, title: "初回カウンセリング", completed: true, path: "/chat/day1-confirm" },
    { day: 2, title: "ストレス要因の特定", completed: false, path: "/chat/day2" },
    { day: 3, title: "対処法の検討", completed: false, path: "/chat/day3" },
    { day: 4, title: "実践とフィードバック", completed: false, path: "/chat/day4" },
    { day: 5, title: "進捗確認", completed: false, path: "/chat/day5" },
    { day: 6, title: "振り返りと調整", completed: false, path: "/chat/day6" },
    { day: 7, title: "総合評価", completed: false, path: "/chat/day7" },
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
          {days.map((day, index) => (
            <Link key={day.day} href={day.path} className="block">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border-2 transition-all hover:shadow-xl hover:bg-white/70 ${
                  day.completed ? 'border-white/60' : 'border-white/40'
                }`}
              >
                <div className="p-5 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/40 shadow-lg ${
                    day.completed 
                      ? 'bg-gradient-to-br from-[#B794F6]/80 to-[#9333EA]/80 text-white' 
                      : 'bg-white/60 text-[#9333EA]'
                  }`}>
                    <span>{day.day}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className={`${day.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>Day {day.day}</h3>
                    </div>
                    <p className={`${day.completed ? 'text-gray-500' : 'text-gray-700'}`}>{day.title}</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
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
