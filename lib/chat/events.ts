import type { ChatEventBody } from './contracts';
import { chatStorageClient, type ChatStorageClient } from './storage';

export interface ChatEventRecord extends ChatEventBody {
  id: string;
  createdAt: string;
}

export interface ChatEvaluationMetrics {
  metaModeConversationShare: number;
  feedbackPositivityRate: number;
  responseCompletionRate: number;
  averageTurnsPerSuccessfulThread: number | null;
  metaPlanViewRate: number;
}

let initPromise: Promise<void> | null = null;

async function ensureChatEventsTable(client: ChatStorageClient = chatStorageClient) {
  if (!initPromise) {
    initPromise = client
      .execute(`
        CREATE TABLE IF NOT EXISTS chat_events (
          id TEXT PRIMARY KEY,
          event_type TEXT NOT NULL,
          thread_id TEXT NOT NULL,
          message_id TEXT,
          task_type TEXT,
          metadata TEXT,
          created_at TEXT NOT NULL
        )
      `)
      .then(() => undefined);
  }

  return initPromise;
}

function parseMetadata(value: string | null | undefined) {
  if (!value) {
    return undefined;
  }

  try {
    return JSON.parse(value) as ChatEventBody['metadata'];
  } catch {
    return undefined;
  }
}

export function calculateChatEvaluationMetrics(
  events: ChatEventRecord[],
): ChatEvaluationMetrics {
  const submittedThreads = new Set<string>();
  const metaThreads = new Set<string>();
  const successfulThreads = new Set<string>();
  const metaMessageIds = new Set<string>();
  const viewedPlanMessageIds = new Set<string>();
  const turnsByThread = new Map<string, number>();

  let feedbackCount = 0;
  let positiveFeedbackCount = 0;
  let messageSubmittedCount = 0;
  let responseCompletedCount = 0;

  for (const event of events) {
    if (event.eventType === 'message_submitted') {
      messageSubmittedCount += 1;
      submittedThreads.add(event.threadId);
      turnsByThread.set(event.threadId, (turnsByThread.get(event.threadId) ?? 0) + 1);
    }

    if (event.eventType === 'meta_mode_used') {
      metaThreads.add(event.threadId);

      if (event.messageId) {
        metaMessageIds.add(event.messageId);
      }
    }

    if (event.eventType === 'plan_preview_expanded' && event.messageId) {
      viewedPlanMessageIds.add(event.messageId);
    }

    if (event.eventType === 'response_completed') {
      responseCompletedCount += 1;
    }

    if (event.eventType === 'feedback_submitted') {
      feedbackCount += 1;

      if (event.metadata?.feedback === 'helpful') {
        positiveFeedbackCount += 1;
        successfulThreads.add(event.threadId);
      }
    }
  }

  const successfulThreadTurns = [...successfulThreads]
    .map((threadId) => turnsByThread.get(threadId) ?? 0)
    .filter((turns) => turns > 0);

  return {
    metaModeConversationShare:
      submittedThreads.size === 0 ? 0 : metaThreads.size / submittedThreads.size,
    feedbackPositivityRate:
      feedbackCount === 0 ? 0 : positiveFeedbackCount / feedbackCount,
    responseCompletionRate:
      messageSubmittedCount === 0 ? 0 : responseCompletedCount / messageSubmittedCount,
    averageTurnsPerSuccessfulThread:
      successfulThreadTurns.length === 0
        ? null
        : successfulThreadTurns.reduce((sum, turns) => sum + turns, 0) /
          successfulThreadTurns.length,
    metaPlanViewRate:
      metaMessageIds.size === 0 ? 0 : viewedPlanMessageIds.size / metaMessageIds.size,
  };
}

export async function recordChatEvent(
  input: ChatEventBody,
  client: ChatStorageClient = chatStorageClient,
) {
  await ensureChatEventsTable(client);

  const event: ChatEventRecord = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };

  await client.execute(
    `
      INSERT INTO chat_events (
        id,
        event_type,
        thread_id,
        message_id,
        task_type,
        metadata,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      event.id,
      event.eventType,
      event.threadId,
      event.messageId ?? null,
      event.taskType ?? null,
      event.metadata ? JSON.stringify(event.metadata) : null,
      event.createdAt,
    ],
  );

  return event;
}

export async function getChatEvaluationMetrics(client: ChatStorageClient = chatStorageClient) {
  await ensureChatEventsTable(client);

  const result = await client.execute(`
    SELECT
      id,
      event_type,
      thread_id,
      message_id,
      task_type,
      metadata,
      created_at
    FROM chat_events
  `);

  const events: ChatEventRecord[] = result.rows.map((row) => ({
    id: String(row.id),
    eventType: String(row.event_type) as ChatEventBody['eventType'],
    threadId: String(row.thread_id),
    messageId: row.message_id ? String(row.message_id) : undefined,
    taskType: row.task_type ? String(row.task_type) as ChatEventBody['taskType'] : undefined,
    metadata: parseMetadata(row.metadata ? String(row.metadata) : undefined),
    createdAt: String(row.created_at),
  }));

  return calculateChatEvaluationMetrics(events);
}
