import { describe, expect, it } from 'vitest';
import { calculateChatEvaluationMetrics } from './events';

describe('calculateChatEvaluationMetrics', () => {
  it('calculates the baseline chat evaluation metrics from stored events', () => {
    const metrics = calculateChatEvaluationMetrics([
      {
        id: '1',
        createdAt: '2026-03-08T00:00:00.000Z',
        eventType: 'message_submitted',
        threadId: 'thread-1',
        messageId: 'user-1',
      },
      {
        id: '2',
        createdAt: '2026-03-08T00:00:01.000Z',
        eventType: 'meta_mode_used',
        threadId: 'thread-1',
        messageId: 'assistant-1',
        taskType: 'planning',
      },
      {
        id: '3',
        createdAt: '2026-03-08T00:00:02.000Z',
        eventType: 'plan_preview_expanded',
        threadId: 'thread-1',
        messageId: 'assistant-1',
        taskType: 'planning',
      },
      {
        id: '4',
        createdAt: '2026-03-08T00:00:03.000Z',
        eventType: 'response_completed',
        threadId: 'thread-1',
        messageId: 'assistant-1',
        taskType: 'planning',
      },
      {
        id: '5',
        createdAt: '2026-03-08T00:00:04.000Z',
        eventType: 'feedback_submitted',
        threadId: 'thread-1',
        messageId: 'assistant-1',
        taskType: 'planning',
        metadata: {
          feedback: 'helpful',
        },
      },
      {
        id: '6',
        createdAt: '2026-03-08T00:01:00.000Z',
        eventType: 'message_submitted',
        threadId: 'thread-2',
        messageId: 'user-2',
      },
      {
        id: '7',
        createdAt: '2026-03-08T00:01:02.000Z',
        eventType: 'response_completed',
        threadId: 'thread-2',
        messageId: 'assistant-2',
        taskType: 'simple_chat',
      },
      {
        id: '8',
        createdAt: '2026-03-08T00:01:03.000Z',
        eventType: 'feedback_submitted',
        threadId: 'thread-2',
        messageId: 'assistant-2',
        taskType: 'simple_chat',
        metadata: {
          feedback: 'not_helpful',
        },
      },
    ]);

    expect(metrics).toEqual({
      metaModeConversationShare: 0.5,
      feedbackPositivityRate: 0.5,
      responseCompletionRate: 1,
      averageTurnsPerSuccessfulThread: 1,
      metaPlanViewRate: 1,
    });
  });
});
