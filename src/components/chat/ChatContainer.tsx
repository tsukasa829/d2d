"use client";
import { useEffect, useRef, useState } from 'react';
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
    <div className="flex flex-col h-[100svh] bg-gray-50">
      <div className="px-4 py-3 border-b bg-white font-semibold">シンプルBot</div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
        {loading ? (
          <div className="text-center text-gray-500">読み込み中...</div>
        ) : (
          messages.map((m) => {
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
            return <MessageBubble key={m.id} message={m} />;
          })
        )}
      </div>
      <div className="px-4 py-3 border-t bg-white">
        <ChoiceButtons choices={choices} onSelect={handleSelect} />
      </div>
    </div>
  );
}
