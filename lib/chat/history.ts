import { toAISdkV5Messages } from '@mastra/ai-sdk/ui';
import type { UIMessage } from 'ai';
import { mastra } from '@/mastra';

export async function getChatHistory(threadId: string, resourceId: string) {
  const storage = mastra.getStorage();

  if (!storage) {
    return [];
  }

  const memoryStore = await storage.getStore('memory');

  if (!memoryStore) {
    return [];
  }

  const result = await memoryStore.listMessages({
    threadId,
    resourceId,
    perPage: false,
    orderBy: {
      field: 'createdAt',
      direction: 'ASC',
    },
  });

  return toAISdkV5Messages(result.messages) as UIMessage[];
}

export async function getThread(threadId: string) {
  const storage = mastra.getStorage();

  if (!storage) {
    return null;
  }

  const memoryStore = await storage.getStore('memory');

  if (!memoryStore) {
    return null;
  }

  return memoryStore.getThreadById({ threadId });
}
