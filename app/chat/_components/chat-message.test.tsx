import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UIMessage } from 'ai';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ChatMessage } from './chat-message';

describe('ChatMessage', () => {
  const fetchMock = vi.fn();
  const threadId = '11111111-1111-4111-8111-111111111111';

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders task framing for meta-routed assistant messages', () => {
    const message: UIMessage = {
      id: 'assistant-1',
      role: 'assistant',
      parts: [{ type: 'text', text: 'Start with the migration boundary.' }],
      metadata: {
        taskType: 'planning',
        shouldUseMeta: true,
        meta: {
          goal: 'Create a migration plan for the chat route.',
          constraints: ['Preserve thread URLs', 'Avoid downtime', 'Keep tests green'],
          plan: ['Audit flow', 'Ship API changes', 'Verify rollout'],
          responseStrategy: 'Summarize the path in order.',
          confidence: 'medium',
          limitations: ['Needs production traffic assumptions'],
          contextGaps: ['Current deploy topology'],
        },
      },
    };

    render(<ChatMessage message={message} threadId={threadId} />);

    expect(screen.getByText('Structured meta pass')).toBeInTheDocument();
    expect(screen.getByText('planning')).toBeInTheDocument();
    expect(
      screen.getByText('Create a migration plan for the chat route.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Preserve thread URLs · Avoid downtime +1 more'),
    ).toBeInTheDocument();
    expect(screen.getByText('Confidence')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(
      screen.getByText('Needs production traffic assumptions'),
    ).toBeInTheDocument();
    expect(screen.getByText('More context would help')).toBeInTheDocument();
    expect(screen.getByText('Current deploy topology')).toBeInTheDocument();
    expect(screen.getByText('Plan preview')).toBeInTheDocument();
    expect(screen.getByText('Response feedback')).toBeInTheDocument();
  });

  it('keeps the plan preview collapsed until expanded', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ success: true })));
    const user = userEvent.setup();

    const message: UIMessage = {
      id: 'assistant-3',
      role: 'assistant',
      parts: [{ type: 'text', text: 'Here is the rollout path.' }],
      metadata: {
        taskType: 'planning',
        shouldUseMeta: true,
        meta: {
          goal: 'Roll out the migration in phases.',
          constraints: ['Preserve thread URLs'],
          plan: ['Audit flow', 'Ship API changes', 'Verify rollout'],
          responseStrategy: 'Present the path clearly.',
          confidence: 'medium',
          limitations: [],
          contextGaps: [],
        },
      },
    };

    render(<ChatMessage message={message} threadId={threadId} />);

    const summary = screen.getByText('Plan preview');
    const details = summary.closest('details');

    expect(details).not.toHaveAttribute('open');

    await user.click(summary);

    expect(details).toHaveAttribute('open');
    expect(screen.getByText('Audit flow')).toBeInTheDocument();
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/chat/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: 'plan_preview_expanded',
          threadId,
          messageId: 'assistant-3',
          taskType: 'planning',
          metadata: {
            planLength: 3,
          },
        }),
        keepalive: true,
      });
    });
  });

  it('omits trust-signal summaries when limitations and context gaps are empty', () => {
    const message: UIMessage = {
      id: 'assistant-4',
      role: 'assistant',
      parts: [{ type: 'text', text: 'Here is the rollout path.' }],
      metadata: {
        taskType: 'analysis',
        shouldUseMeta: true,
        meta: {
          goal: 'Assess the rollout path.',
          constraints: ['Preserve thread URLs'],
          plan: [],
          responseStrategy: 'Call out the main tradeoffs.',
          confidence: 'high',
          limitations: [],
          contextGaps: [],
        },
      },
    };

    render(<ChatMessage message={message} threadId={threadId} />);

    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.queryByText('Limitations')).not.toBeInTheDocument();
    expect(screen.queryByText('More context would help')).not.toBeInTheDocument();
  });

  it('keeps simple assistant replies free of framing chrome', () => {
    const message: UIMessage = {
      id: 'assistant-2',
      role: 'assistant',
      parts: [{ type: 'text', text: 'Hello there.' }],
      metadata: {
        taskType: 'simple_chat',
        shouldUseMeta: false,
        meta: {
          goal: '',
          constraints: [],
          plan: [],
          responseStrategy: 'Respond directly and concisely.',
          confidence: 'low',
          limitations: [],
          contextGaps: [],
        },
      },
    };

    render(<ChatMessage message={message} threadId={threadId} />);

    expect(screen.queryByText('Structured meta pass')).not.toBeInTheDocument();
    expect(screen.getByText('Hello there.')).toBeInTheDocument();
  });

  it('submits structured feedback for assistant responses', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ success: true })));

    const user = userEvent.setup();
    const message: UIMessage = {
      id: 'assistant-feedback',
      role: 'assistant',
      parts: [{ type: 'text', text: 'Here is the rollout path.' }],
      metadata: {
        taskType: 'decision',
        shouldUseMeta: true,
        meta: {
          goal: 'Choose the rollout strategy.',
          constraints: [],
          plan: [],
          responseStrategy: 'Lead with the tradeoffs.',
          confidence: 'medium',
          limitations: [],
          contextGaps: [],
        },
      },
    };

    render(<ChatMessage message={message} threadId={threadId} />);

    await user.click(screen.getByRole('button', { name: 'Needs more depth' }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/chat/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId,
          messageId: 'assistant-feedback',
          taskType: 'decision',
          feedback: 'needs_more_depth',
        }),
      });
    });

    expect(screen.getByText('Saved')).toBeInTheDocument();
  });
});
