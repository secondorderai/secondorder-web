'use client';

import { DefaultChatTransport, type UIMessage } from 'ai';
import { useChat } from '@ai-sdk/react';
import { startTransition, useEffect, useRef, useState } from 'react';
import { ChatHeader } from './chat-header';
import { ChatInput } from './chat-input';
import { ChatMessageList } from './chat-message-list';

interface ChatPageClientProps {
  threadId: string;
}

async function loadThreadMessages(threadId: string) {
  const response = await fetch(
    `/api/chat?${new URLSearchParams({ threadId }).toString()}`,
    {
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    throw new Error('Unable to load chat history');
  }

  const payload = (await response.json()) as { messages: UIMessage[] };
  return payload.messages;
}

export function ChatPageClient({ threadId }: ChatPageClientProps) {
  const [transport] = useState(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        body: {
          threadId,
        },
      }),
  );
  const { messages, sendMessage, setMessages, status } = useChat({
    id: threadId,
    transport,
  });
  const [input, setInput] = useState('');
  const [isHydrating, setIsHydrating] = useState(true);
  const hydratedRef = useRef(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (hydratedRef.current) {
      return;
    }

    let isMounted = true;

    loadThreadMessages(threadId)
      .then((storedMessages) => {
        if (!isMounted || hydratedRef.current) {
          return;
        }

        hydratedRef.current = true;
        startTransition(() => {
          setMessages(storedMessages);
        });
      })
      .catch(() => {
        hydratedRef.current = true;
      })
      .finally(() => {
        if (isMounted) {
          setIsHydrating(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [setMessages, threadId]);

  const isLoading =
    status === 'submitted' || status === 'streaming' || isHydrating;

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

  const handlePromptSelect = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  return (
    <main className="flex h-screen flex-col bg-bone">
      <ChatHeader />
      <ChatMessageList
        messages={messages}
        isLoading={isLoading}
        threadId={threadId}
        onPromptSelect={handlePromptSelect}
      />
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        textareaRef={inputRef}
      />
    </main>
  );
}
