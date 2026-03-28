import { MAX_MESSAGE_LENGTH } from './constants';

type MessageLike = {
  role: 'system' | 'user' | 'assistant';
  parts?: Array<{
    type?: string;
    text?: string;
  }>;
  content?: string;
};

export function getMessageTextContent(message: MessageLike): string {
  if (Array.isArray(message.parts) && message.parts.length > 0) {
    return message.parts
      .filter((part) => part?.type === 'text')
      .map((part) => part.text ?? '')
      .join('');
  }

  return message.content ?? '';
}

export function getLastUserMessageText(messages: MessageLike[]): string {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];

    if (message.role === 'user') {
      return getMessageTextContent(message);
    }
  }

  return '';
}

export function isMessageTooLong(message: string): boolean {
  return message.length > MAX_MESSAGE_LENGTH;
}
