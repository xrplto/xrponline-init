import ChatInterface from './components/ChatInterface';

export default function ChatPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Chat</h1>
      <ChatInterface />
    </main>
  );
} 