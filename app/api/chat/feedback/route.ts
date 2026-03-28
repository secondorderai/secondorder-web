import { cookies } from 'next/headers';
import { chatFeedbackBodySchema } from '@/lib/chat/contracts';
import { recordChatEvent } from '@/lib/chat/events';
import { recordChatFeedback } from '@/lib/chat/feedback';
import { getThread } from '@/lib/chat/history';
import {
  createResourceCookieHeader,
  getOrCreateResourceId,
} from '@/lib/chat/session';

export const runtime = 'nodejs';

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

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const { resourceId, shouldSetCookie } = getOrCreateResourceId(cookieStore);

  try {
    const body = chatFeedbackBodySchema.safeParse(await request.json());

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

    const hasAccess = await validateThreadAccess(body.data.threadId, resourceId);

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

    const event = await recordChatFeedback(body.data);
    void recordChatEvent({
      eventType: 'feedback_submitted',
      threadId: body.data.threadId,
      messageId: body.data.messageId,
      taskType: body.data.taskType,
      metadata: {
        feedback: body.data.feedback,
      },
    }).catch(() => {});

    return jsonResponse(
      { success: true, event },
      {
        setCookie: shouldSetCookie
          ? createResourceCookieHeader(resourceId)
          : undefined,
      },
    );
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
