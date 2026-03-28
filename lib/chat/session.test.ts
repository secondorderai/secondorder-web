import { describe, expect, it } from 'vitest';
import {
  createResourceCookieHeader,
  getOrCreateResourceId,
} from './session';

describe('chat session helpers', () => {
  it('reuses an existing resource cookie', () => {
    const result = getOrCreateResourceId({
      get(name: string) {
        if (name === 'secondorder_resource_id') {
          return {
            name,
            value: 'existing-resource',
          };
        }

        return undefined;
      },
    });

    expect(result).toEqual({
      resourceId: 'existing-resource',
      shouldSetCookie: false,
    });
  });

  it('creates a new resource id when cookie is absent', () => {
    const result = getOrCreateResourceId({
      get() {
        return undefined;
      },
    });

    expect(result.resourceId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(result.shouldSetCookie).toBe(true);
  });

  it('serializes the resource cookie header', () => {
    const header = createResourceCookieHeader('resource-123');

    expect(header).toContain('secondorder_resource_id=resource-123');
    expect(header).toContain('HttpOnly');
    expect(header).toContain('SameSite=Lax');
  });
});
