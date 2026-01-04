'use client';

import { useEffect, useRef } from 'react';
import type { UIMessage } from 'ai';
import { ChatMessage } from './chat-message';

interface ChatMessageListProps {
  messages: UIMessage[];
  isLoading: boolean;
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl border border-ink/10 bg-white px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-ink/40 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-ink/40 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-ink/40" />
        </div>
      </div>
    </div>
  );
}

export function ChatMessageList({ messages, isLoading }: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h2 className="font-display text-xl font-semibold text-ink">
              Welcome to SecondOrder
            </h2>
            <p className="mt-2 text-sm text-ink/70">
              Start a conversation with our meta-thinking AI assistant.
            </p>
          </div>
        )}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <TypingIndicator />
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
