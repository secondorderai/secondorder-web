'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { ChatHeader } from './_components/chat-header';
import { ChatInput } from './_components/chat-input';
import { ChatMessageList } from './_components/chat-message-list';

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState('');

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const messageText = input;
    setInput('');
    await sendMessage({ text: messageText });
  };

  return (
    <main className="flex h-screen flex-col bg-bone">
      <ChatHeader />
      <ChatMessageList messages={messages} isLoading={isLoading} />
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </main>
  );
}
