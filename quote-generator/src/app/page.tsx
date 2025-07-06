"use client";

import { useEffect, useState } from "react";
import QuoteCard from "@/components/QuoteCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Quote {
  quote: string;
  author: string;
  category: string;
}

// Helper: Map category to background image
const getBackgroundImage = (category: string | null) => {
  if (!category) return "/default.jpg";
  const map: { [key: string]: string } = {
    inspiration: "/bg-inspiration.jpeg",
    initiative: "/bg-initiative.jpeg",
    selfgrowth: "/bg-selfgrowth.jpg",
    action: "/bg-action.jpg",
    mindset: "/bg-mindset.jpeg",
    individuality: "/bg-individuality.jpg",
    happiness:"/bg-happiness.jpg",
    persistence:"/bg-persistence.jpg",
    life: "/bg-life.jpg",
    success: "/bg-success.jpg",
    love: "/bg-love.jpg",
    motivation: "/motivation-bg.jpg",
  };
  return map[category.toLowerCase()] || "/default.jpg";
};

export default function Home() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [results, setResults] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchRandomQuote = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/quotes");

      if (!res.ok) throw new Error("Failed to fetch quote");

      const data = await res.json();
      if (!data) throw new Error("No quote received");

      setQuote(data);
      setResults([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/quotes?search=${encodeURIComponent(search)}`);
      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();
      setResults(data);
      setQuote(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search error occurred");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomQuote();
  }, []);

  // Determine which category to use for background
  const currentCategory = quote?.category || (results.length > 0 ? results[0].category : null);
  const bgImage = getBackgroundImage(currentCategory);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <main className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl p-8 shadow-xl max-w-xl w-full space-y-6">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by author or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading}>
            Search
          </Button>
          <Button variant="outline" onClick={fetchRandomQuote} disabled={loading}>
            New Quote
          </Button>
        </div>

        {loading && <p className="text-center text-gray-600">Loading...</p>}

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {!loading && quote && <QuoteCard quote={quote} />}

        {!loading && results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Search Results ({results.length})</h2>
            {results.map((q, index) => (
              <QuoteCard key={`${q.quote}-${index}`} quote={q} />
            ))}
          </div>
        )}

        {!loading && results.length === 0 && search.trim() && !quote && (
          <p className="text-center text-gray-500">No quotes found matching your search</p>
        )}
      </main>
    </div>
  );
}
