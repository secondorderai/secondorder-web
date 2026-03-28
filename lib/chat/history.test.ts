import { beforeEach, describe, expect, it, vi } from 'vitest';

const getStoreMock = vi.fn();
const getStorageMock = vi.fn();

vi.mock('@/mastra', () => ({
  mastra: {
    getStorage: getStorageMock,
  },
}));

describe('chat history', () => {
  beforeEach(() => {
    getStoreMock.mockReset();
    getStorageMock.mockReset();
  });

  it('returns null for getThread when storage is unavailable', async () => {
    getStorageMock.mockReturnValue(null);

    const { getThread } = await import('./history');

    await expect(
      getThread('11111111-1111-4111-8111-111111111111'),
    ).resolves.toBeNull();
  });

  it('reads thread records from the storage-backed memory store', async () => {
    getStorageMock.mockReturnValue({
      getStore: getStoreMock,
    });
    getStoreMock.mockResolvedValue({
      getThreadById: vi.fn().mockResolvedValue({
        id: 'thread-1',
        resourceId: 'resource-1',
      }),
    });

    const { getThread } = await import('./history');

    await expect(getThread('thread-1')).resolves.toEqual({
      id: 'thread-1',
      resourceId: 'resource-1',
    });
    expect(getStoreMock).toHaveBeenCalledWith('memory');
  });
});
