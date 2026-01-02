import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInterface } from './chat-interface';

// Mock the @ai-sdk/react useChat hook
vi.mock('@ai-sdk/react', () => ({
  useChat: vi.fn(() => ({
    messages: [],
    sendMessage: vi.fn(),
    status: 'ready',
  })),
  UIMessage: {},
}));

// Mock the DefaultChatTransport
vi.mock('ai', () => ({
  DefaultChatTransport: vi.fn(),
}));

describe('ChatInterface', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the chat interface', () => {
    render(<ChatInterface />);
    expect(screen.getByText('Meta-thinking Assistant')).toBeInTheDocument();
    expect(screen.getByText('Powered by Vercel AI SDK')).toBeInTheDocument();
  });

  it('should show ready status when not loading', () => {
    render(<ChatInterface />);
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('should show empty state with suggestions when no messages', () => {
    render(<ChatInterface />);
    expect(
      screen.getByText(
        'Ask me anything about meta-thinking, AI cognition, or SecondOrder.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('What is meta-thinking?')).toBeInTheDocument();
    expect(screen.getByText('How does self-auditing work?')).toBeInTheDocument();
    expect(screen.getByText('Explain the iterative loop')).toBeInTheDocument();
  });

  it('should render input field and send button', () => {
    render(<ChatInterface />);
    const input = screen.getByPlaceholderText('Ask about meta-thinking...');
    expect(input).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });

  it('should allow typing in the input field', async () => {
    const user = userEvent.setup();
    render(<ChatInterface />);
    const input = screen.getByPlaceholderText(
      'Ask about meta-thinking...'
    ) as HTMLInputElement;

    await user.type(input, 'Hello');
    expect(input.value).toBe('Hello');
  });

  it('should have send button disabled when input is empty', () => {
    render(<ChatInterface />);
    const sendButton = screen.getByRole('button', { name: 'Send' });
    expect(sendButton).toBeDisabled();
  });

  it('should enable send button when input has text', async () => {
    const user = userEvent.setup();
    render(<ChatInterface />);
    const input = screen.getByPlaceholderText('Ask about meta-thinking...');
    const sendButton = screen.getByRole('button', { name: 'Send' });

    await user.type(input, 'Test message');
    expect(sendButton).not.toBeDisabled();
  });

  it('should render suggestion buttons', () => {
    render(<ChatInterface />);
    const suggestions = [
      'What is meta-thinking?',
      'How does self-auditing work?',
      'Explain the iterative loop',
    ];

    suggestions.forEach((suggestion) => {
      expect(
        screen.getByRole('button', { name: suggestion })
      ).toBeInTheDocument();
    });
  });

  it('should have proper accessibility attributes', () => {
    render(<ChatInterface />);
    const input = screen.getByPlaceholderText('Ask about meta-thinking...');
    expect(input).toHaveAttribute('type', 'text');
  });
});
