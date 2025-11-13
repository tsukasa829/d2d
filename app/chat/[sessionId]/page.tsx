import ChatContainer from '@/src/components/chat/ChatContainer';

export default async function ChatPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return <ChatContainer sessionId={sessionId ?? 'example'} />;
}
