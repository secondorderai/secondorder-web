'use client';

import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();

  return (
    <main className="flex min-h-screen flex-col bg-bone text-ink">
      <header className="border-b border-ink/10 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/icon.svg"
              width={32}
              height={32}
              alt="SecondOrder icon"
              className="h-8 w-8 rounded-xl border border-ink/10 bg-bone"
            />
            <div className="text-lg font-medium tracking-[0.2em] uppercase">
              SecondOrder
            </div>
          </Link>
          <Link href="/" className="text-sm text-ink/70 hover:text-ink">
            Back to home
          </Link>
        </div>
      </header>

      <div className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-8 sm:px-10">
          <div className="mb-6">
            <h1 className="font-display text-4xl">Chat with SecondOrder</h1>
            <p className="mt-2 text-ink/70">
              Ask questions about meta-thinking, AI reasoning, and cognitive
              systems.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {messages.length === 0 && (
              <div className="rounded-3xl border border-ink/10 bg-white/70 p-8">
                <p className="text-sm uppercase tracking-[0.4em] text-ink/60">
                  Get started
                </p>
                <p className="mt-2 text-ink/70">
                  Start a conversation to learn more about SecondOrder's
                  meta-thinking capabilities.
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-2xl border p-4 ${
                  message.role === 'user'
                    ? 'border-ink/20 bg-white/90'
                    : 'border-ink/10 bg-fog/50'
                }`}
              >
                <p className="text-xs uppercase tracking-[0.3em] text-ink/50">
                  {message.role === 'user' ? 'You' : 'SecondOrder'}
                </p>
                <div className="mt-2 whitespace-pre-wrap text-ink/90">
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="rounded-2xl border border-ink/10 bg-fog/50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-ink/50">
                  SecondOrder
                </p>
                <div className="mt-2 flex items-center gap-2 text-ink/60">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-ink/40" />
                  <div
                    className="h-2 w-2 animate-pulse rounded-full bg-ink/40"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <div
                    className="h-2 w-2 animate-pulse rounded-full bg-ink/40"
                    style={{ animationDelay: '0.4s' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-ink/10 bg-white/70 backdrop-blur">
          <div className="mx-auto w-full max-w-4xl px-6 py-4 sm:px-10">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about meta-thinking, reasoning systems..."
                className="flex-1 rounded-full border border-ink/20 bg-white px-6 py-3 text-sm transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/20"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                Send
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
