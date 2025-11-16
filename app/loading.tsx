"use client";
import { motion } from 'motion/react';

export default function Loading() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#E9D5FF] via-[#B794F6] to-[#9333EA]">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 blur-3xl rounded-full" />
            <h1 className="relative text-8xl text-white mb-4 tracking-wider">D2D</h1>
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-white/90 tracking-widest"
        >
          Counseling Support
        </motion.p>
      </motion.div>
    </div>
  );
}
