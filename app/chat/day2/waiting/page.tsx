"use client";
import { useEffect, useState } from "react";

export default function Day2WaitingPage() {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24時間（秒）

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-[100svh] bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8">Day 2 - 待機中</h1>
        <div className="text-6xl font-mono font-bold text-gray-800">
          {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
          {String(seconds).padStart(2, "0")}
        </div>
        <p className="mt-8 text-gray-600">次のコンテンツまでお待ちください</p>
      </div>
    </div>
  );
}
