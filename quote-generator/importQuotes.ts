import 'dotenv/config';
import mongoose from 'mongoose';
import QuoteModel from './src/lib/model/QuoteModel';
import quotes from './quotes.json';

async function importQuotes() {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) throw new Error('MONGODB_URI not found');

    await mongoose.connect(mongoURI, {
      dbName: "nexium-mongo" // Explicit database name
    });
    console.log('✅ Connected to nexium-mongo database');

    // Clear existing quotes
    await QuoteModel.deleteMany();
    console.log('🗑️ Cleared old quotes');

    // Insert new quotes
    const result = await QuoteModel.insertMany(quotes);
    console.log(`✅ ${result.length} quotes imported successfully!`);

    // Verify count
    const count = await QuoteModel.countDocuments();
    console.log(`Total quotes in collection: ${count}`);
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

importQuotes();