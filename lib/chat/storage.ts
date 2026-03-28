import { createClient } from '@libsql/client';
import type { InValue } from '@libsql/core/api';
import { Pool } from 'pg';
import { getDefaultMastraStorageUrl } from './storage-url';

export interface ChatStorageClient {
  execute(sql: string, args?: InValue[]): Promise<{ rows: Record<string, unknown>[] }>;
}

class LibSqlChatStorageClient implements ChatStorageClient {
  #client = createClient({
    url: getDefaultMastraStorageUrl(),
    authToken: process.env.MASTRA_STORAGE_AUTH_TOKEN,
  });

  async execute(sql: string, args: InValue[] = []) {
    const result = await this.#client.execute(sql, args);

    return {
      rows: result.rows as Record<string, unknown>[],
    };
  }
}

class PostgresChatStorageClient implements ChatStorageClient {
  #pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === 'development'
        ? false
        : { rejectUnauthorized: false },
  });

  async execute(sql: string, args: InValue[] = []) {
    const result = await this.#pool.query(toPostgresPlaceholders(sql), args);

    return {
      rows: result.rows as Record<string, unknown>[],
    };
  }
}

function toPostgresPlaceholders(sql: string) {
  let index = 0;

  return sql.replace(/\?/g, () => `$${++index}`);
}

export function createChatStorageClient(): ChatStorageClient {
  if (process.env.DATABASE_URL) {
    return new PostgresChatStorageClient();
  }

  return new LibSqlChatStorageClient();
}

export const chatStorageClient = createChatStorageClient();
