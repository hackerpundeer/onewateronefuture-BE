import mongoose from 'mongoose';

export let isMongoConnected = false;
export let mongoConnectionError: string | null = null;

mongoose.connection.on('error', (err) => {
  console.warn('Mongoose connection error:', err.message);
  mongoConnectionError = err.message;
  isMongoConnected = false;
});

mongoose.connection.on('disconnected', () => {
  isMongoConnected = false;
});

export function markMongoDisconnected(message: string) {
  mongoConnectionError = message;
  isMongoConnected = false;
}

export async function connectDatabase(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('MONGODB_URI is required in production');
    }
    console.warn('No MONGODB_URI set — using in-memory fallback for development');
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });

    await mongoose.connection.db?.admin().ping();
    isMongoConnected = true;
    mongoConnectionError = null;
    console.log('MongoDB connected successfully');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown connection error';
    mongoConnectionError = message;
    isMongoConnected = false;
    if (process.env.NODE_ENV === 'production') {
      throw err;
    }
    console.warn(`MongoDB connection failed: ${message}`);
    console.warn('Continuing with in-memory fallback for development');
  }
}

export function getDatabaseStatus() {
  const readyState = mongoose.connection.readyState;
  const live = isMongoConnected && readyState === 1;

  return {
    database: live ? 'MongoDB' : 'In-Memory Fallback',
    mongoUriConfigured: !!process.env.MONGODB_URI,
    mongoConnected: live,
    connectionError: mongoConnectionError,
    readyState,
  };
}

export async function isMongoLive(): Promise<boolean> {
  if (!isMongoConnected || mongoose.connection.readyState !== 1) {
    isMongoConnected = false;
    return false;
  }

  try {
    await mongoose.connection.db?.admin().ping();
    return true;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'MongoDB ping failed';
    markMongoDisconnected(message);
    return false;
  }
}
