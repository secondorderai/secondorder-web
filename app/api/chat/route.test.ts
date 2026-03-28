import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const cookiesMock = vi.fn();
const handleChatStreamMock = vi.fn();
const createUIMessageStreamResponseMock = vi.fn();
const getThreadMock = vi.fn();
const getChatHistoryMock = vi.fn();
const recordChatEventMock = vi.fn();

vi.mock('next/headers', () => ({
  cookies: cookiesMock,
}));

vi.mock('@mastra/ai-sdk', () => ({
  handleChatStream: handleChatStreamMock,
}));

vi.mock('ai', () => ({
  createUIMessageStreamResponse: createUIMessageStreamResponseMock,
}));

vi.mock('@/lib/chat/history', () => ({
  getThread: getThreadMock,
  getChatHistory: getChatHistoryMock,
}));

vi.mock('@/lib/chat/events', () => ({
  recordChatEvent: recordChatEventMock,
}));

vi.mock('@/mastra', () => ({
  mastra: {
    getWorkflow() {
      return {
        async createRun() {
          return {
            async start() {
              return {
                status: 'success',
                result: {
                  taskType: 'planning',
                  shouldUseMeta: true,
                  selectedSkillIds: ['interpret-task', 'build-plan'],
                  selectedSkillNames: ['Interpret Task', 'Build Plan'],
                  meta: {
                    goal: 'Create a migration plan.',
                    constraints: ['Avoid downtime'],
                    plan: ['Assess current state', 'Sequence the migration'],
                    responseStrategy: 'Lead with sequencing and risk mitigation.',
                    confidence: 'medium',
                    limitations: ['Current deployment details are missing'],
                    contextGaps: ['Unknown database size'],
                  },
                },
              };
            },
          };
        },
      };
    },
  },
}));

describe('/api/chat route', () => {
  beforeEach(() => {
    cookiesMock.mockResolvedValue({
      get() {
        return undefined;
      },
    });

    handleChatStreamMock.mockResolvedValue(
      new ReadableStream({
        start(controller) {
          controller.close();
        },
      }),
    );

    createUIMessageStreamResponseMock.mockImplementation(
      () => new Response('streamed'),
    );

    getThreadMock.mockResolvedValue(null);
    getChatHistoryMock.mockResolvedValue([]);
    recordChatEventMock.mockResolvedValue({
      id: 'event-1',
      createdAt: '2026-03-08T00:00:00.000Z',
    });
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('returns 400 for invalid POST payloads', async () => {
    const { POST } = await import('./route');
    const response = await POST(
      new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({ threadId: 'bad-id', messages: 'nope' }),
      }),
    );

    expect(response.status).toBe(400);
  });

  it('returns stored messages for GET history requests', async () => {
    getChatHistoryMock.mockResolvedValue([
      {
        id: 'msg-1',
        role: 'assistant',
        parts: [{ type: 'text', text: 'Hello again' }],
      },
    ]);

    const { GET } = await import('./route');
    const response = await GET(
      new Request('http://localhost:3000/api/chat?threadId=11111111-1111-4111-8111-111111111111'),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.messages).toHaveLength(1);
  });

  it('streams chat responses for valid POST requests', async () => {
    const { POST } = await import('./route');
    const response = await POST(
      new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          threadId: '11111111-1111-4111-8111-111111111111',
          messages: [
            {
              id: 'user-1',
              role: 'user',
              parts: [{ type: 'text', text: 'Create a migration plan.' }],
            },
          ],
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(handleChatStreamMock).toHaveBeenCalledTimes(1);
    expect(createUIMessageStreamResponseMock).toHaveBeenCalledTimes(1);
    expect(recordChatEventMock).toHaveBeenCalledWith({
      eventType: 'thread_started',
      threadId: '11111111-1111-4111-8111-111111111111',
    });
    expect(recordChatEventMock).toHaveBeenCalledWith({
      eventType: 'message_submitted',
      threadId: '11111111-1111-4111-8111-111111111111',
      messageId: 'user-1',
    });
    expect(recordChatEventMock).toHaveBeenCalledWith({
      eventType: 'task_classified',
      threadId: '11111111-1111-4111-8111-111111111111',
      taskType: 'planning',
    });
  });
});
