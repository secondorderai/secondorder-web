import type { ChatFeedbackBody } from './contracts';
import { chatStorageClient } from './storage';

let initPromise: Promise<void> | null = null;

async function ensureFeedbackTable() {
  if (!initPromise) {
    initPromise = chatStorageClient
      .execute(`
        CREATE TABLE IF NOT EXISTS chat_feedback_events (
          id TEXT PRIMARY KEY,
          thread_id TEXT NOT NULL,
          message_id TEXT NOT NULL,
          task_type TEXT NOT NULL,
          feedback TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `)
      .then(() => undefined);
  }

  return initPromise;
}

export async function recordChatFeedback(input: ChatFeedbackBody) {
  await ensureFeedbackTable();

  const event = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  await chatStorageClient.execute(
    `
      INSERT INTO chat_feedback_events (
        id,
        thread_id,
        message_id,
        task_type,
        feedback,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      event.id,
      input.threadId,
      input.messageId,
      input.taskType,
      input.feedback,
      event.createdAt,
    ],
  );

  return event;
}
