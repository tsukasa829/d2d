"use client";
import { motion } from 'motion/react';

export default function ChoiceButtons({
  choices,
  disabled,
  onSelect,
}: {
  choices: { label: string; value: string }[];
  disabled?: boolean;
  onSelect: (value: string) => void;
}) {
  if (!choices?.length) return null;
  return (
    <div className="flex flex-col gap-3">
      {choices.map((c, index) => (
        <motion.button
          key={c.value}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          disabled={disabled}
          onClick={() => onSelect(c.value)}
          className="w-full px-5 py-3 rounded-full bg-white/60 backdrop-blur-sm border border-white/60 text-gray-800 hover:bg-white/80 hover:border-white/80 hover:shadow-lg disabled:bg-gray-300/50 disabled:cursor-not-allowed disabled:text-gray-500 transition-all active:scale-95 font-medium"
        >
          {c.label}
        </motion.button>
      ))}
    </div>
  );
}
