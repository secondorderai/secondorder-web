import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UIMessage } from 'ai';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ChatMessageList } from './chat-message-list';

describe('ChatMessageList', () => {
  const scrollIntoViewMock = vi.fn();

  beforeEach(() => {
    scrollIntoViewMock.mockReset();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
  });

  it('renders onboarding guidance and suggested task prompts for empty threads', async () => {
    const user = userEvent.setup();
    const onPromptSelect = vi.fn();

    render(
      <ChatMessageList
        messages={[]}
        isLoading={false}
        threadId="11111111-1111-4111-8111-111111111111"
        onPromptSelect={onPromptSelect}
      />,
    );

    expect(screen.getByText('Meta-thinking chat')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Bring a messy problem. SecondOrder will frame it before answering.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /It surfaces the task type, plan, and confidence signals/,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Planning')).toBeInTheDocument();
    expect(screen.getByText('Analysis')).toBeInTheDocument();
    expect(screen.getByText('Decisions')).toBeInTheDocument();
    expect(screen.getByText('Troubleshooting')).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: /Help me plan a staged launch for a new customer onboarding flow\./,
      }),
    );

    expect(onPromptSelect).toHaveBeenCalledWith(
      'Help me plan a staged launch for a new customer onboarding flow.',
    );
  });

  it('avoids smooth scrolling while a response is streaming', () => {
    const baseMessage: UIMessage = {
      id: 'assistant-1',
      role: 'assistant',
      parts: [{ type: 'text', text: 'First draft' }],
    };

    const { rerender } = render(
      <ChatMessageList
        messages={[baseMessage]}
        isLoading={true}
        threadId="11111111-1111-4111-8111-111111111111"
        onPromptSelect={vi.fn()}
      />,
    );

    expect(scrollIntoViewMock).toHaveBeenLastCalledWith({ behavior: 'auto' });

    rerender(
      <ChatMessageList
        messages={[
          {
            ...baseMessage,
            parts: [{ type: 'text', text: 'First draft with more streamed text' }],
          },
        ]}
        isLoading={true}
        threadId="11111111-1111-4111-8111-111111111111"
        onPromptSelect={vi.fn()}
      />,
    );

    expect(scrollIntoViewMock).toHaveBeenLastCalledWith({ behavior: 'auto' });
  });

  it('uses smooth scrolling when a new message is appended after streaming', () => {
    const messages: UIMessage[] = [
      {
        id: 'user-1',
        role: 'user',
        parts: [{ type: 'text', text: 'Hello' }],
      },
    ];

    const { rerender } = render(
      <ChatMessageList
        messages={messages}
        isLoading={true}
        threadId="11111111-1111-4111-8111-111111111111"
        onPromptSelect={vi.fn()}
      />,
    );

    rerender(
      <ChatMessageList
        messages={[
          ...messages,
          {
            id: 'assistant-1',
            role: 'assistant',
            parts: [{ type: 'text', text: 'Reply' }],
          },
        ]}
        isLoading={false}
        threadId="11111111-1111-4111-8111-111111111111"
        onPromptSelect={vi.fn()}
      />,
    );

    expect(scrollIntoViewMock).toHaveBeenLastCalledWith({ behavior: 'smooth' });
  });
});
