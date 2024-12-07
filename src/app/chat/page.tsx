'use client';

import ChatInterface from './components/ChatInterface';

export default function ChatPage() {
  return (
    <div className="p-8">
      <ChatInterface onClose={() => window.history.back()} />
    </div>
  );
} 