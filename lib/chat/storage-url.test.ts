import { afterEach, describe, expect, it, vi } from 'vitest';

describe('getDefaultMastraStorageUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('uses the explicit MASTRA_STORAGE_URL when provided', async () => {
    vi.stubEnv('MASTRA_STORAGE_URL', 'file:/custom/path.db');
    vi.stubEnv('VERCEL', '1');

    const { getDefaultMastraStorageUrl } = await import('./storage-url');

    expect(getDefaultMastraStorageUrl()).toBe('file:/custom/path.db');
  });

  it('defaults to /tmp on Vercel when no explicit storage URL is set', async () => {
    vi.stubEnv('VERCEL', '1');

    const { getDefaultMastraStorageUrl } = await import('./storage-url');

    expect(getDefaultMastraStorageUrl()).toBe('file:/tmp/secondorder.db');
  });

  it('defaults to the local .mastra path outside Vercel', async () => {
    const { getDefaultMastraStorageUrl } = await import('./storage-url');

    expect(getDefaultMastraStorageUrl()).toBe('file:./.mastra/secondorder.db');
  });
});
