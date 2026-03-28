'use client';

import { useState } from 'react';
import type { ChatFeedbackBody } from '@/lib/chat/contracts';
import { Button } from '@/components/ui/button';

const FEEDBACK_OPTIONS: Array<{
  label: string;
  value: ChatFeedbackBody['feedback'];
}> = [
  { label: 'Helpful', value: 'helpful' },
  { label: 'Not helpful', value: 'not_helpful' },
  { label: 'Needs more depth', value: 'needs_more_depth' },
  { label: 'Missed constraints', value: 'missed_constraints' },
];

interface ChatMessageFeedbackProps {
  threadId: string;
  messageId: string;
  taskType: ChatFeedbackBody['taskType'];
}

export function ChatMessageFeedback({
  threadId,
  messageId,
  taskType,
}: ChatMessageFeedbackProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<
    ChatFeedbackBody['feedback'] | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFeedbackSubmit = async (
    feedback: ChatFeedbackBody['feedback'],
  ) => {
    if (isSubmitting || selectedFeedback) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/chat/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId,
          messageId,
          taskType,
          feedback,
        } satisfies ChatFeedbackBody),
      });

      if (!response.ok) {
        throw new Error('Unable to store feedback');
      }

      setSelectedFeedback(feedback);
    } catch {
      setError('Unable to save feedback right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-3 border-t border-ink/10 pt-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
          Response feedback
        </p>
        {selectedFeedback ? (
          <p className="text-xs text-ink/55">Saved</p>
        ) : null}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {FEEDBACK_OPTIONS.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant={selectedFeedback === option.value ? 'default' : 'outline'}
            size="sm"
            disabled={isSubmitting || Boolean(selectedFeedback)}
            onClick={() => handleFeedbackSubmit(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      {error ? (
        <p className="mt-2 text-xs text-rose-700">{error}</p>
      ) : null}
    </div>
  );
}
