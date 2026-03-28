import {
  CHAT_RESOURCE_COOKIE,
  CHAT_RESOURCE_COOKIE_MAX_AGE,
} from './constants';

type CookieStore = {
  get(name: string): { value: string } | undefined;
};

export function getOrCreateResourceId(cookieStore: CookieStore) {
  const existing = cookieStore.get(CHAT_RESOURCE_COOKIE)?.value;

  if (existing) {
    return {
      resourceId: existing,
      shouldSetCookie: false,
    };
  }

  return {
    resourceId: crypto.randomUUID(),
    shouldSetCookie: true,
  };
}

export function createResourceCookieHeader(resourceId: string): string {
  return [
    `${CHAT_RESOURCE_COOKIE}=${resourceId}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${CHAT_RESOURCE_COOKIE_MAX_AGE}`,
  ].join('; ');
}
