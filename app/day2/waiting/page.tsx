"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export default function Day2WaitingPage() {
  const router = useRouter();
  const totalSeconds = 3600;
  // 繝・Δ縺ｨ縺励※ 45:45 縺九ｉ髢句ｧ・
  const remainingSeconds = 2745;
  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="h-screen flex flex-col max-w-md mx-auto bg-gradient-to-br from-[#E9D5FF] via-purple-100 to-[#B794F6]">
      <div className="bg-white/20 backdrop-blur-md text-white px-4 py-6 shadow-lg border-b border-white/30">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="tracking-wide">蠕・ｩ滉ｸｭ</h1>
            <p className="text-white/90 text-sm mt-1">繧ｫ繧ｦ繝ｳ繧ｻ繝ｩ繝ｼ縺悟ｿ懃ｭ斐＠縺ｾ縺・/p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="relative mb-12">
          <svg className="transform -rotate-90 w-72 h-72">
            <circle cx="144" cy="144" r="120" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="12" fill="none" />
            <motion.circle
              cx="144"
              cy="144"
              r="120"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5 }}
              style={{ strokeDasharray: circumference }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9333EA" />
                <stop offset="100%" stopColor="#B794F6" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#B794F6]/80 to-[#9333EA]/80 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center mb-4 shadow-xl">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <div className="text-6xl bg-gradient-to-r from-[#9333EA] to-[#7C3AED] bg-clip-text text-transparent tabular-nums drop-shadow-lg">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <p className="text-gray-700 mt-2 drop-shadow-sm">谿九ｊ譎る俣</p>
            </motion.div>
          </div>
        </div>

        <div className="w-full space-y-4">
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#E9D5FF]/80 to-[#B794F6]/80 backdrop-blur-sm border border-white/40 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">ｧ鯛坂囎・・/span>
              </div>
              <div className="flex-1">
                <h3 className="text-gray-800 mb-1">繧ｫ繧ｦ繝ｳ繧ｻ繝ｩ繝ｼ謇矩・荳ｭ</h3>
                <p className="text-gray-700 text-sm leading-relaxed">蟆る摩縺ｮ繧ｫ繧ｦ繝ｳ繧ｻ繝ｩ繝ｼ繧呈焔驟阪＠縺ｦ縺・∪縺吶る壼ｸｸ縲・譎る俣莉･蜀・↓蠢懃ｭ斐＞縺溘＠縺ｾ縺吶・/p>
              </div>
            </div>
          </div>

          <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/70 backdrop-blur-sm border border-white/60 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">庁</span>
              </div>
              <div className="flex-1">
                <h3 className="text-gray-800 mb-1">縺雁ｾ・■縺ｮ髢薙↓</h3>
                <p className="text-gray-700 text-sm leading-relaxed">縺願ｩｱ縺励＠縺溘＞蜀・ｮｹ繧偵Γ繝｢縺励※縺翫￥縺ｨ縲√せ繝繝ｼ繧ｺ縺ｫ繧ｫ繧ｦ繝ｳ繧ｻ繝ｪ繝ｳ繧ｰ縺悟ｧ九ａ繧峨ｌ縺ｾ縺吶・/p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-8 space-y-3">
          <button onClick={() => router.back()} className="w-full px-6 py-4 bg-white/60 backdrop-blur-md border border-white/60 text-[#9333EA] rounded-2xl hover:shadow-xl hover:bg-white/70 transition-all shadow-lg">
            繝√Ε繝・ヨ逕ｻ髱｢縺ｫ謌ｻ繧・
          </button>
          <Link href="/" className="w-full block px-6 py-4 bg-white/40 backdrop-blur-md text-[#9333EA] rounded-2xl border border-white/50 hover:bg-white/50 transition-all shadow-lg text-center">
            繝励Ο繧ｰ繝ｩ繝繧堤｢ｺ隱・
          </Link>
        </div>
      </div>
    </div>
  );
}
