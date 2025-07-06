import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI in .env.local");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "nexium-mongo", // Explicitly use your database name
      bufferCommands: false,
    }).then((mongoose) => {
      console.log("Connected to MongoDB (nexium-mongo)");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}