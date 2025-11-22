"use client";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, MoreVertical } from 'lucide-react';
import AppHeader from '@/components/ui/AppHeader';
import MessageBubble from './MessageBubble';
import ChoiceButtons from './ChoiceButtons';
import ImageMessage from './ImageMessage';
import NavigationButton from './NavigationButton';
import NavigationButtons from './NavigationButtons';
import { ChatManager } from '@/lib/chat/chat-manager';
import { parseScript } from '@/lib/chat/script-parser';
import { Message } from '@/lib/types/chat';
import LoadingScreen from '@/components/ui/LoadingScreen';

export default function ChatContainer({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [choices, setChoices] = useState<{ label: string; value: string }[]>([]);
  const [isPaymentMode, setIsPaymentMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showChoices, setShowChoices] = useState(false);
  const managerRef = useRef<ChatManager | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const choicesRef = useRef<HTMLDivElement | null>(null);
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
      setIsPaymentMode(managerRef.current.isPaymentMode());
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
        setMessages(list);
        setChoices(mgr.getCurrentChoices());
        setIsPaymentMode(mgr.isPaymentMode());
        setShowChoices(false); // 新しい選択肢が来たら非表示にリセット
      }
    }, 200);
    return () => clearInterval(t);
  }, []);

  // Intersection Observer で選択肢エリアが画面に入ったら表示
  useEffect(() => {
    if (!choicesRef.current || choices.length === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowChoices(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(choicesRef.current);

    return () => observer.disconnect();
  }, [choices]);

  // Redirect logic
  useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.redirectUrl) {
      const delay = lastMsg.redirectDelay || 0;
      const t = setTimeout(() => {
        router.push(lastMsg.redirectUrl!);
      }, delay);
      return () => clearTimeout(t);
    }
  }, [messages, router]);

  const handleSelect = (value: string) => {
    managerRef.current?.handleUserChoice(value);
    setChoices([]);
    setIsPaymentMode(false);
  };

  return (
    <div className="h-screen flex flex-col max-w-md mx-auto bg-gradient-to-br from-[#E9D5FF] via-purple-100 to-[#B794F6]">
      {/* Header (shared) */}
      <AppHeader>
        <div className="flex items-center justify-between w-full px-4">
          <button onClick={() => window.history.back()} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="tracking-wide font-semibold">D2D</h1>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors opacity-0 pointer-events-none">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </AppHeader>

      {/* Chat Messages */}
      {loading ? (
        <LoadingScreen />
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {
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
          }
        </div>
      )}

      {/* Input Area with Choice Buttons */}
      {!loading && (
        <div ref={choicesRef} className="bg-white/30 backdrop-blur-md border-t border-white/40 px-4 py-4 shadow-lg">
          <div className={`transition-opacity duration-500 ${showChoices ? 'opacity-100' : 'opacity-0'}`}>
            <ChoiceButtons choices={choices} onSelect={handleSelect} isPaymentMode={isPaymentMode} />
          </div>
        </div>
      )}
    </div>
  );
}
