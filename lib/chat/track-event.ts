import type { ChatEventBody } from './contracts';

export async function trackChatEvent(input: ChatEventBody) {
  await fetch('/api/chat/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
    keepalive: true,
  });
}
