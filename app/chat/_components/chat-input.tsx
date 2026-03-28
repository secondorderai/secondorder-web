'use client';

import type { ChangeEvent, FormEvent, RefObject } from 'react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  placeholder?: string;
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  placeholder = 'Ask for a plan, analysis, decision, or troubleshooting help...',
  textareaRef,
}: ChatInputProps) {
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form && input.trim()) {
        form.requestSubmit();
      }
    }
  };

  return (
    <div className="border-t border-ink/10 bg-white px-6 py-4">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-3xl items-end gap-3"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          data-testid="chat-input"
          className="flex-1 resize-none rounded-xl border border-ink/20 bg-bone px-4 py-3 text-sm text-ink placeholder:text-ink/50 focus:outline-none focus:ring-2 focus:ring-ink/20 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Chat message input"
        />
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
          data-testid="chat-submit"
        >
          Send
        </Button>
      </form>
    </div>
  );
}
