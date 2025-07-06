import { NextResponse } from 'next/server';
import QuoteModel from '@/lib/model/QuoteModel';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { connection } = await connectToDatabase();
    console.log("Connected to DB:", connection.readyState === 1 ? "Yes" : "No");

    // Check if collection exists
    const collections = await connection.db.listCollections().toArray();
    const collectionExists = collections.some((col: { name: string }) => col.name === 'quotes');
    console.log("Collection exists:", collectionExists);

    if (!collectionExists) {
      return NextResponse.json(
        { error: "Quotes collection not found" },
        { status: 404 }
      );
    }

    // Get search parameters from URL
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    // If search parameter exists, perform search
    if (search) {
      console.log("Searching for:", search);
      
      // Create case-insensitive regex for search
      const regex = new RegExp(search, "i");
      
      // Search in both author and category fields
      const quotes = await QuoteModel.find({
        $or: [
          { author: regex },
          { category: regex }
        ]
      }).lean();

      console.log("Found quotes:", quotes.length);
      
      return NextResponse.json(quotes);
    }
    // If no search parameter, return random quote
    else {
      const randomQuote = await QuoteModel.aggregate([{ $sample: { size: 1 }}]);
      
      if (!randomQuote || randomQuote.length === 0) {
        return NextResponse.json(
          { error: "No quotes found in collection" },
          { status: 404 }
        );
      }

      console.log("Returning random quote");
      return NextResponse.json(randomQuote[0]);
    }

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}