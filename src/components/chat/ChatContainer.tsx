"use client";
import { useEffect, useRef, useState } from 'react';
import { Menu, MoreVertical } from 'lucide-react';
import MessageBubble from './MessageBubble';
import ChoiceButtons from './ChoiceButtons';
import ImageMessage from './ImageMessage';
import NavigationButton from './NavigationButton';
import NavigationButtons from './NavigationButtons';
import { ChatManager } from '../../lib/chat/chat-manager';
import { parseScript } from '../../lib/chat/script-parser';
import { Message } from '../../types/chat';

export default function ChatContainer({ sessionId }: { sessionId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [choices, setChoices] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const managerRef = useRef<ChatManager | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const prevLenRef = useRef<number>(0);
  const shouldScrollRef = useRef<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      // スクリプト取得（API経由）
      let res = await fetch(`/api/chat-script/${sessionId}`);
      if (!res.ok) {
        // フォールバック: example.md を読む
        res = await fetch(`/api/chat-script/example`);
      }
      const md = res.ok ? await res.text() : '';
      const script = parseScript(md);
      managerRef.current = new ChatManager(script);

      // 初期化
      const initial = managerRef.current.initialize();
      setMessages(initial);
      prevLenRef.current = initial.length;
      setChoices(managerRef.current.getCurrentChoices());
      setLoading(false);
    })();
  }, [sessionId]);

  // 新規メッセージが挿入されたときのみ一度だけ最下部へスクロール
  useEffect(() => {
    if (shouldScrollRef.current) {
      shouldScrollRef.current = false;
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  // Botの遅延送信でメッセージ更新があるためポーリングで反映（簡易）
  useEffect(() => {
    const t = setInterval(() => {
      const mgr = managerRef.current;
      if (!mgr) return;
      const list = mgr.getMessages();
      if (list.length !== prevLenRef.current) {
        prevLenRef.current = list.length;
        shouldScrollRef.current = true;
      }
      setMessages(list);
      setChoices(mgr.getCurrentChoices());
    }, 200);
    return () => clearInterval(t);
  }, []);

  const handleSelect = (value: string) => {
    managerRef.current?.handleUserChoice(value);
    setChoices([]);
  };

  return (
    <div className="h-screen flex flex-col max-w-md mx-auto bg-gradient-to-br from-[#E9D5FF] via-purple-100 to-[#B794F6]">
      {/* Header */}
      <div className="bg-white/20 backdrop-blur-md border-b border-white/30 text-white px-4 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <button onClick={() => window.history.back()} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="tracking-wide font-semibold">D2D カウンセリング</h1>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors opacity-0 pointer-events-none">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {loading ? (
          <div className="text-center text-white drop-shadow-lg">読み込み中...</div>
        ) : (
          messages.map((m, index) => {
            // 画像メッセージ
            if (m.imageUrl) {
              return <ImageMessage key={m.id} imageUrl={m.imageUrl} isBot={m.type === 'bot'} />;
            }
            // 複数ボタン
            if (m.buttons && m.buttons.length > 0) {
              return <NavigationButtons key={m.id} buttons={m.buttons} isBot={m.type === 'bot'} />;
            }
            // 単一ボタン
            if (m.buttonLabel && m.buttonUrl) {
              return <NavigationButton key={m.id} label={m.buttonLabel} url={m.buttonUrl} isBot={m.type === 'bot'} />;
            }
            // 通常テキストメッセージ
            return <MessageBubble key={m.id} message={m} index={index} />;
          })
        )}
      </div>

      {/* Input Area with Choice Buttons */}
      <div className="bg-white/30 backdrop-blur-md border-t border-white/40 px-4 py-4 shadow-lg">
        <ChoiceButtons choices={choices} onSelect={handleSelect} />
      </div>
    </div>
  );
}
