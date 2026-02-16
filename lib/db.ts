import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        throw new Error(
            'Please define the MONGODB_URI environment variable inside .env.local or Vercel settings'
        );
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        // Log masking secrets
        const maskedUri = MONGODB_URI.replace(/:([^@]+)@/, ':****@');
        console.log(`📡 Connecting to MongoDB... (${maskedUri.split('?')[0]})`);

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
            const dbName = mongooseInstance.connection.name;
            console.log(`✅ MongoDB Connected Successfully to Database: "${dbName}"`);
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error('❌ MONGODB CONNECTION ERROR:', e);
        throw e;
    }

    return cached.conn;
}

export default connectDB;
