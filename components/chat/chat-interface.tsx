'use client';

import { useChat, type UIMessage } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, FormEvent, useMemo } from 'react';

export function ChatInterface() {
  // Memoize transport to avoid creating new instances on every render
  const transport = useMemo(
    () => new DefaultChatTransport({ api: '/api/chat' }),
    []
  );

  const { messages, sendMessage, status } = useChat({
    transport,
  });
  
  const [input, setInput] = useState('');
  const isLoading = status !== 'ready';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const message = input;
    setInput('');
    await sendMessage({ text: message });
  };

  const handleSuggestionClick = async (suggestion: string) => {
    if (isLoading) return;
    setInput(suggestion);
    await sendMessage({ text: suggestion });
    setInput('');
  };

  return (
    <div className="flex h-[600px] flex-col rounded-3xl border border-ink/10 bg-white/70 backdrop-blur">
      {/* Header */}
      <div className="border-b border-ink/10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Meta-thinking Assistant</h3>
            <p className="mt-1 text-sm text-ink/60">
              Powered by Vercel AI SDK
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                isLoading ? 'bg-yellow-500' : 'bg-green-500'
              )}
            />
            <span className="text-xs text-ink/60">
              {isLoading ? 'Thinking...' : 'Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-ink/60">
                Ask me anything about meta-thinking, AI cognition, or
                SecondOrder.
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-xs text-ink/40">Try asking:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    'What is meta-thinking?',
                    'How does self-auditing work?',
                    'Explain the iterative loop',
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      disabled={isLoading}
                      className="rounded-full bg-ink/5 px-3 py-1.5 text-xs text-ink/70 hover:bg-ink/10 transition disabled:opacity-50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.map((message: UIMessage) => (
          <div
            key={message.id}
            className={cn(
              'flex',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-4 py-3',
                message.role === 'user'
                  ? 'bg-ink text-bone'
                  : 'bg-bone border border-ink/10'
              )}
            >
              <div className="text-sm whitespace-pre-wrap">
                {message.parts.map((part, i) => {
                  if (part.type === 'text') {
                    return <span key={i}>{part.text}</span>;
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl border border-ink/10 bg-bone px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-bounce rounded-full bg-ink/40" />
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-ink/40"
                  style={{ animationDelay: '0.1s' }}
                />
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-ink/40"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-ink/10 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about meta-thinking..."
            disabled={isLoading}
            className="flex-1 rounded-full border border-ink/10 bg-white px-4 py-3 text-sm outline-none placeholder:text-ink/40 focus:border-ink/30 disabled:opacity-50"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}

