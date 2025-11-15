"use client";
import Link from "next/link";

export default function Home() {
  const days = [
    { day: 1, path: "/chat/day1-confirm", label: "Day 1 - 確認" },
    { day: 2, path: "/chat/day2", label: "Day 2" },
    { day: 3, path: "/chat/day3", label: "Day 3" },
    { day: 4, path: "/chat/day4", label: "Day 4" },
    { day: 5, path: "/chat/day5", label: "Day 5" },
    { day: 6, path: "/chat/day6", label: "Day 6" },
    { day: 7, path: "/chat/day7", label: "Day 7" },
  ];

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">D2D - 目次</h1>
        <nav className="space-y-4">
          {days.map((item) => (
            <Link
              key={item.day}
              href={item.path}
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg font-semibold">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
