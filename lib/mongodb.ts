import mongoose from 'mongoose';
import dns from 'node:dns';

// Ensure public DNS fallback on Node environments where local resolver fails SRV queries
if (typeof dns.setServers === 'function') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (_) {}
}

const PRIMARY_URI = process.env.MONGODB_URI;
const LOCAL_URI = 'mongodb://127.0.0.1:27017/fastrack_db';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function tryConnect(uri: string, timeoutMs: number = 3500): Promise<typeof mongoose> {
  return mongoose.connect(uri, {
    bufferCommands: false,
    serverSelectionTimeoutMS: timeoutMs,
  });
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      // 1. If PRIMARY_URI is provided, try it first with 3.5s timeout
      if (PRIMARY_URI) {
        try {
          const inst = await tryConnect(PRIMARY_URI, 3500);
          console.log('Connected to primary MongoDB URI successfully!');
          return inst;
        } catch (err: any) {
          console.warn(`Primary MongoDB URI unreachable (${err.message.slice(0, 50)}...). Attempting local fallback...`);
          try {
            await mongoose.disconnect();
          } catch (_) {}
        }
      }

      // 2. Connect to local MongoDB fallback
      try {
        const inst = await tryConnect(LOCAL_URI, 3000);
        console.log('Connected to local MongoDB fastrack_db successfully!');
        return inst;
      } catch (err: any) {
        console.warn(`Local MongoDB fallback failed (${err.message.slice(0, 50)}...).`);
        throw err;
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
