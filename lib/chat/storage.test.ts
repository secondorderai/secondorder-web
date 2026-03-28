import { afterEach, describe, expect, it, vi } from 'vitest';

describe('createChatStorageClient', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('uses Postgres when DATABASE_URL is present', async () => {
    vi.stubEnv('DATABASE_URL', 'postgresql://user:pass@localhost:5432/secondorder');

    const { createChatStorageClient } = await import('./storage');

    expect(createChatStorageClient().constructor.name).toBe('PostgresChatStorageClient');
  });

  it('falls back to libsql when DATABASE_URL is absent', async () => {
    const { createChatStorageClient } = await import('./storage');

    expect(createChatStorageClient().constructor.name).toBe('LibSqlChatStorageClient');
  });
});
