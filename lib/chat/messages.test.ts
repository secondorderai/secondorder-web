import { describe, expect, it } from 'vitest';
import {
  getLastUserMessageText,
  getMessageTextContent,
  isMessageTooLong,
} from './messages';

describe('chat message helpers', () => {
  it('extracts text from UI message parts', () => {
    const content = getMessageTextContent({
      role: 'assistant',
      parts: [
        { type: 'text', text: 'Hello' },
        { type: 'text', text: ' world' },
      ],
    });

    expect(content).toBe('Hello world');
  });

  it('returns the latest user message text', () => {
    const latestUserMessage = getLastUserMessageText([
      {
        role: 'user',
        parts: [{ type: 'text', text: 'First' }],
      },
      {
        role: 'assistant',
        parts: [{ type: 'text', text: 'Reply' }],
      },
      {
        role: 'user',
        parts: [{ type: 'text', text: 'Second' }],
      },
    ]);

    expect(latestUserMessage).toBe('Second');
  });

  it('detects oversized messages', () => {
    expect(isMessageTooLong('a'.repeat(4001))).toBe(true);
    expect(isMessageTooLong('a'.repeat(4000))).toBe(false);
  });
});
