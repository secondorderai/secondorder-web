import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const cookiesMock = vi.fn();
const getThreadMock = vi.fn();
const recordChatEventMock = vi.fn();

vi.mock('next/headers', () => ({
  cookies: cookiesMock,
}));

vi.mock('@/lib/chat/history', () => ({
  getThread: getThreadMock,
}));

vi.mock('@/lib/chat/events', () => ({
  recordChatEvent: recordChatEventMock,
}));

describe('/api/chat/events route', () => {
  beforeEach(() => {
    cookiesMock.mockResolvedValue({
      get() {
        return undefined;
      },
    });

    getThreadMock.mockResolvedValue(null);
    recordChatEventMock.mockResolvedValue({
      id: 'event-1',
      createdAt: '2026-03-08T00:00:00.000Z',
    });
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('returns 400 for invalid payloads', async () => {
    const { POST } = await import('./route');
    const response = await POST(
      new Request('http://localhost:3000/api/chat/events', {
        method: 'POST',
        body: JSON.stringify({ threadId: 'bad-id' }),
      }),
    );

    expect(response.status).toBe(400);
    expect(recordChatEventMock).not.toHaveBeenCalled();
  });

  it('returns 404 when the thread is not accessible', async () => {
    getThreadMock.mockResolvedValue({
      id: 'thread-1',
      resourceId: '22222222-2222-4222-8222-222222222222',
    });

    const { POST } = await import('./route');
    const response = await POST(
      new Request('http://localhost:3000/api/chat/events', {
        method: 'POST',
        body: JSON.stringify({
          eventType: 'plan_preview_expanded',
          threadId: '11111111-1111-4111-8111-111111111111',
          messageId: 'assistant-1',
          taskType: 'planning',
        }),
      }),
    );

    expect(response.status).toBe(404);
    expect(recordChatEventMock).not.toHaveBeenCalled();
  });

  it('stores instrumentation events for valid requests', async () => {
    const { POST } = await import('./route');
    const response = await POST(
      new Request('http://localhost:3000/api/chat/events', {
        method: 'POST',
        body: JSON.stringify({
          eventType: 'plan_preview_expanded',
          threadId: '11111111-1111-4111-8111-111111111111',
          messageId: 'assistant-1',
          taskType: 'planning',
          metadata: {
            planLength: 2,
          },
        }),
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(recordChatEventMock).toHaveBeenCalledWith({
      eventType: 'plan_preview_expanded',
      threadId: '11111111-1111-4111-8111-111111111111',
      messageId: 'assistant-1',
      taskType: 'planning',
      metadata: {
        planLength: 2,
      },
    });
    expect(payload.success).toBe(true);
  });
});
