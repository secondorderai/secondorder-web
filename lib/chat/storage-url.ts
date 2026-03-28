const LOCAL_STORAGE_URL = 'file:./.mastra/secondorder.db';
const VERCEL_STORAGE_URL = 'file:/tmp/secondorder.db';

export function getDefaultMastraStorageUrl() {
  if (process.env.MASTRA_STORAGE_URL) {
    return process.env.MASTRA_STORAGE_URL;
  }

  if (process.env.VERCEL === '1' || process.env.VERCEL === 'true') {
    return VERCEL_STORAGE_URL;
  }

  return LOCAL_STORAGE_URL;
}
