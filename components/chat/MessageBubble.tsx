"use client";
import Image from 'next/image';
import { motion } from 'motion/react';
import { Message } from '@/lib/types/chat';

export default function MessageBubble({ message, index = 0 }: { message: Message; index?: number }) {
  const isUser = message.type === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
    >
      <div className={`flex items-end gap-2 max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar - 空文字の場合は非表示 */}
        {message.avatar !== '' && (
          <div className="flex-shrink-0 flex flex-col items-center gap-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/40 shadow-lg overflow-hidden ${
              isUser 
                ? 'bg-gradient-to-br from-[#E9D5FF]/80 to-[#B794F6]/80' 
                : 'bg-gradient-to-br from-[#B794F6]/80 to-[#9333EA]/80'
            }`}>
              {message.avatar && message.avatar.startsWith('/') ? (
                <Image src={message.avatar} alt={isUser ? 'user' : 'bot'} width={40} height={40} unoptimized className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg">{message.avatar || (isUser ? '😊' : '🧑‍⚕️')}</span>
              )}
            </div>
          </div>
        )}

        {/* Message Bubble */}
        <div className="flex flex-col">
          <div
            className={`px-4 py-3 rounded-2xl shadow-lg backdrop-blur-md border ${
              isUser
                ? 'bg-gradient-to-br from-[#B794F6]/70 to-[#9333EA]/70 text-white border-white/30 rounded-br-sm'
                : 'bg-white/70 border-white/50 text-gray-800 rounded-bl-sm'
            }`}
          >
            <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
