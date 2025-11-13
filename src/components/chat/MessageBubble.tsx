"use client";
import Image from 'next/image';
import { Message } from '../../types/chat';

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.type === 'user';
  return (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <Avatar src={message.avatar || '/avatars/bot.png'} alt="bot" />
      )}
      <div className={`${isUser ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'} rounded-2xl px-4 py-2 shadow max-w-[70%]`}>
        {message.content}
      </div>
      {isUser && (
        <Avatar src={message.avatar || '/avatars/user.png'} alt="user" />
      )}
    </div>
  );
}

function Avatar({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-gray-200 bg-white">
      {/* Image最適化を避けるためunoptimizedにする */}
      <Image src={src} alt={alt} width={32} height={32} unoptimized />
    </div>
  );
}
