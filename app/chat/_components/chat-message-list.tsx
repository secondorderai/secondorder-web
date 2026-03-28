'use client';

import { useEffect, useRef } from 'react';
import type { UIMessage } from 'ai';
import { Button } from '@/components/ui/button';
import { ChatMessage } from './chat-message';

interface ChatMessageListProps {
  messages: UIMessage[];
  isLoading: boolean;
  threadId: string;
  onPromptSelect: (prompt: string) => void;
}

const suggestedPrompts = [
  {
    label: 'Planning',
    prompt: 'Help me plan a staged launch for a new customer onboarding flow.',
  },
  {
    label: 'Analysis',
    prompt: 'Analyze why our activation rate dropped after the last release.',
  },
  {
    label: 'Decisions',
    prompt: 'Compare whether we should build this in-house or buy an external tool.',
  },
  {
    label: 'Troubleshooting',
    prompt: 'Troubleshoot why our API is timing out under a modest production load.',
  },
] as const;

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

export function ChatMessageList({
  messages,
  isLoading,
  threadId,
  onPromptSelect,
}: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousMessageCountRef = useRef(messages.length);

  useEffect(() => {
    const hasNewMessage = messages.length > previousMessageCountRef.current;
    const behavior: ScrollBehavior =
      isLoading || !hasNewMessage ? 'auto' : 'smooth';

    messagesEndRef.current?.scrollIntoView({ behavior });
    previousMessageCountRef.current = messages.length;
  }, [isLoading, messages]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {messages.length === 0 && (
          <div className="rounded-[2rem] border border-ink/10 bg-white/90 px-6 py-8 shadow-soft-edge sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink/55">
                Meta-thinking chat
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
                Bring a messy problem. SecondOrder will frame it before answering.
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink/72 sm:text-base">
                It surfaces the task type, plan, and confidence signals so you can
                inspect how the assistant is approaching the work instead of
                getting a black-box reply.
              </p>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {suggestedPrompts.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onPromptSelect(item.prompt)}
                  className="group rounded-[1.5rem] border border-ink/12 bg-bone p-4 text-left transition hover:-translate-y-0.5 hover:border-ink/25 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink">
                    {item.prompt}
                  </p>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  onPromptSelect(
                    'Help me think through a problem step by step and call out any weak assumptions.',
                  )
                }
              >
                Start with a meta-thinking prompt
              </Button>
            </div>
          </div>
        )}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} threadId={threadId} />
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <TypingIndicator />
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
