import { handleChatStream } from '@mastra/ai-sdk';
import { createUIMessageStreamResponse } from 'ai';
import {
  MASTRA_RESOURCE_ID_KEY,
  MASTRA_THREAD_ID_KEY,
  RequestContext,
} from '@mastra/core/request-context';
import { cookies } from 'next/headers';
import { chatPostBodySchema, historyQuerySchema } from '@/lib/chat/contracts';
import { recordChatEvent } from '@/lib/chat/events';
import { getChatHistory, getThread } from '@/lib/chat/history';
import { isMessageTooLong, getLastUserMessageText } from '@/lib/chat/messages';
import {
  createResourceCookieHeader,
  getOrCreateResourceId,
} from '@/lib/chat/session';
import { mastra } from '@/mastra';

export const runtime = 'nodejs';

function normalizeMessages(
  messages: Array<{
    id?: string;
    role: 'system' | 'user' | 'assistant';
    parts: Array<{ type: string; text?: string }>;
    metadata?: unknown;
  }>,
) {
  return messages.map((message) => ({
    ...message,
    id: message.id ?? crypto.randomUUID(),
  }));
}

function jsonResponse(
  body: Record<string, unknown>,
  init?: ResponseInit & { setCookie?: string },
) {
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');

  if (init?.setCookie) {
    headers.append('Set-Cookie', init.setCookie);
  }

  return new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers,
  });
}

async function validateThreadAccess(threadId: string, resourceId: string) {
  const thread = await getThread(threadId);

  if (thread && thread.resourceId && thread.resourceId !== resourceId) {
    return false;
  }

  return true;
}

function recordChatEventSafely(
  input: Parameters<typeof recordChatEvent>[0],
) {
  void recordChatEvent(input).catch(() => {});
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const { resourceId, shouldSetCookie } = getOrCreateResourceId(cookieStore);
  const query = historyQuerySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams),
  );

  if (!query.success) {
    return jsonResponse(
      { error: 'Invalid thread ID' },
      {
        status: 400,
        setCookie: shouldSetCookie
          ? createResourceCookieHeader(resourceId)
          : undefined,
      },
    );
  }

  const hasAccess = await validateThreadAccess(query.data.threadId, resourceId);

  if (!hasAccess) {
    return jsonResponse(
      { error: 'Thread not found' },
      {
        status: 404,
        setCookie: shouldSetCookie
          ? createResourceCookieHeader(resourceId)
          : undefined,
      },
    );
  }

  const messages = await getChatHistory(query.data.threadId, resourceId);

  return jsonResponse(
    { messages },
    {
      setCookie: shouldSetCookie
        ? createResourceCookieHeader(resourceId)
        : undefined,
    },
  );
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const { resourceId, shouldSetCookie } = getOrCreateResourceId(cookieStore);

  try {
    const body = chatPostBodySchema.safeParse(await request.json());

    if (!body.success) {
      return jsonResponse(
        { error: 'Invalid request body' },
        {
          status: 400,
          setCookie: shouldSetCookie
            ? createResourceCookieHeader(resourceId)
            : undefined,
        },
      );
    }

    const normalizedMessages = normalizeMessages(body.data.messages);
    const latestUserMessage = getLastUserMessageText(normalizedMessages);

    if (isMessageTooLong(latestUserMessage)) {
      return jsonResponse(
        { error: 'Message too long' },
        {
          status: 400,
          setCookie: shouldSetCookie
            ? createResourceCookieHeader(resourceId)
            : undefined,
        },
      );
    }

    const existingThread = await getThread(body.data.threadId);

    if (existingThread && existingThread.resourceId && existingThread.resourceId !== resourceId) {
      return jsonResponse(
        { error: 'Thread not found' },
        {
          status: 404,
          setCookie: shouldSetCookie
            ? createResourceCookieHeader(resourceId)
            : undefined,
        },
      );
    }

    const latestMessage = normalizedMessages.at(-1);

    if (!existingThread) {
      recordChatEventSafely({
        eventType: 'thread_started',
        threadId: body.data.threadId,
      });
    }

    if (latestMessage?.role === 'user') {
      recordChatEventSafely({
        eventType: 'message_submitted',
        threadId: body.data.threadId,
        messageId: latestMessage.id,
      });
    }

    const workflow = mastra.getWorkflow('metaChatWorkflow');
    const run = await workflow.createRun({ resourceId });
    const workflowResult = await run.start({
      inputData: {
        messages: normalizedMessages,
        threadId: body.data.threadId,
        resourceId,
      },
    });

    if (workflowResult.status !== 'success') {
      return jsonResponse(
        { error: 'Unable to prepare chat response' },
        {
          status: 500,
          setCookie: shouldSetCookie
            ? createResourceCookieHeader(resourceId)
            : undefined,
        },
      );
    }

    recordChatEventSafely({
      eventType: 'task_classified',
      threadId: body.data.threadId,
      taskType: workflowResult.result.taskType,
    });

    const requestContext = new RequestContext<Record<string, unknown>>(
      Object.entries({
        ...workflowResult.result,
        threadId: body.data.threadId,
        resourceId,
      }),
    );
    requestContext.set(MASTRA_THREAD_ID_KEY, body.data.threadId);
    requestContext.set(MASTRA_RESOURCE_ID_KEY, resourceId);

    const stream = await handleChatStream({
      mastra,
      agentId: 'secondOrderAgent',
      params: {
        messages: normalizedMessages as never,
        memory: {
          thread: body.data.threadId,
          resource: resourceId,
        },
        requestContext,
      },
    });
    const assistantMessageMetadata = {
      taskType: workflowResult.result.taskType,
      shouldUseMeta: workflowResult.result.shouldUseMeta,
      meta: workflowResult.result.meta,
    };
    let assistantMessageId: string | null = null;
    const streamWithMetadata = stream.pipeThrough(
      new TransformStream({
        transform(chunk, controller) {
          if (chunk.type === 'text-start' && !assistantMessageId) {
            assistantMessageId = chunk.id;

            if (workflowResult.result.shouldUseMeta) {
              recordChatEventSafely({
                eventType: 'meta_mode_used',
                threadId: body.data.threadId,
                messageId: assistantMessageId,
                taskType: workflowResult.result.taskType,
              });
            }
          }

          if (chunk.type === 'start' || chunk.type === 'finish') {
            if (chunk.type === 'finish') {
              recordChatEventSafely({
                eventType: 'response_completed',
                threadId: body.data.threadId,
                messageId: assistantMessageId ?? undefined,
                taskType: workflowResult.result.taskType,
              });
            }

            controller.enqueue({
              ...chunk,
              messageMetadata: assistantMessageMetadata,
            });
            return;
          }

          controller.enqueue(chunk);
        },
      }),
    );

    const response = createUIMessageStreamResponse({
      stream: streamWithMetadata as never,
    });

    if (shouldSetCookie) {
      response.headers.append(
        'Set-Cookie',
        createResourceCookieHeader(resourceId),
      );
    }

    return response;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred';

    return jsonResponse(
      { error: message },
      {
        status: 500,
        setCookie: shouldSetCookie
          ? createResourceCookieHeader(resourceId)
          : undefined,
      },
    );
  }
}
