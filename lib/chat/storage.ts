import { createClient } from '@libsql/client';

export const chatStorageClient = createClient({
  url: process.env.MASTRA_STORAGE_URL ?? 'file:./.mastra/secondorder.db',
  authToken: process.env.MASTRA_STORAGE_AUTH_TOKEN,
});
