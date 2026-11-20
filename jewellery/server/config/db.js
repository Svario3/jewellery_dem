import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongodInstance = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri && !mongoUri.includes('memory')) {
      try {
        console.log(`Connecting to external MongoDB: ${mongoUri.split('@')[1] || mongoUri}...`);
        const conn = await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
        return conn;
      } catch (externalErr) {
        console.warn(`⚠️ External MongoDB connection failed (${externalErr.message}). Falling back to high-performance Embedded MongoDB Memory Server...`);
      }
    }

    // High performance embedded fallback
    console.log('Starting Embedded MongoDB Engine...');
    mongodInstance = await MongoMemoryServer.create({
      instance: {
        dbName: 'aurelia_jewels',
      },
    });
    const memoryUri = mongodInstance.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`✅ Embedded MongoDB ready: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

export default connectDB;
