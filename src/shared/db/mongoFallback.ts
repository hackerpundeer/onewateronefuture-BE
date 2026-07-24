import { isMongoLive, markMongoDisconnected } from '../../db.js';

export async function withMongoFallback<T>(
  label: string,
  mongoFn: () => Promise<T>,
  memoryFn: () => T
): Promise<T> {
  const live = await isMongoLive();
  if (!live) return memoryFn();

  try {
    return await mongoFn();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'MongoDB operation failed';
    console.warn(`MongoDB ${label} failed: ${message}`);
    markMongoDisconnected(message);
    if (process.env.NODE_ENV === 'production') throw err;
    return memoryFn();
  }
}
