"use client";

import { useEffect, useState } from "react";
import QuoteCard from "@/components/QuoteCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getQuoteBoxStyle } from "@/lib/getQuoteBoxStyle";

interface Quote {
  quote: string;
  author: string;
  category: string;
}

const getBackgroundImage = (category: string | null) => {
  const map: { [key: string]: string } = {
    "action": "/bg-action.jpg",
    "activism": "/bg-activism.jpg",
    "adaptability": "/bg-adaptability.jpg",
    "ambition": "/bg-qmbiition.jpg",
    "authenticity": "/bg-authenticity.jpg",
    "beginnings": "/bg-beginnings.jpg",
    "belief": "/bg-belief.jpg",
    "change": "/bg-change.jpg",
    "choices": "/bg-choices.jpg",
    "courage": "/bg-courage.jpg",
    "confidence":"/bg-confidence.jpg",
    "creativity": "/bg-creativity.jpg",
    "determination": "/bg-determination.jpg",
    "dreams": "/bg-dreams.jpg",
    "education": "/bg-education.jpg",
    "excellence": "/bg-excellence.jpg",
    "exploration": "/bg-exploration.jpg",
    "failure": "/bg-failure.jpg",
    "growth": "/bg-growth.jpg",
    "happiness": "/bg-happiness.jpg",
    "hardwork": "/bg-hardwork.jpg",
    "hope": "/bg-hope.jpg",
    "impact": "/bg-impact.jpg",
    "imagination": "/bg-imagination.jpg",
    "individuality": "/bg-individuality.jpg",
    "innovation": "/bg-innovation.jpg",
    "initiative":"/bg-initiative.jpg",
    "inspiration": "/bg-inspiration.jpg",
    "integrity": "/bg-integrity.jpg",
    "kindness": "/bg-kindness.jpg",
    "knowledge": "/bg-knowledge.jpg",
    "leadership": "/bg-leadership.jpg",
    "legacy": "/bg-legacy.jpg",
    "life": "/bg-life.jpg",
    "limitations": "/bg-limitations.jpg",
    "love": "/bg-love.jpg",
    "mindset": "/bg-mindset.jpg",
    "motivation": "/motivation-bg.jpg",
    "opportunity": "/bg-opportunity.jpg",
    "optimism": "/bg-optimism.jpg",
    "passion": "/bg-passion.jpg",
    "perseverance": "/bg-perserverence.jpg",
    "persistence": "/bg-persistence.jpg",
    "perspective": "/bg-perspective.jpg",
    "planning": "/bg-planning.jpg",
    "possibility": "/bg-possibility.jpg",
    "potential": "/bg-potential.jpg",
    "preparation": "/bg-preparation.jpg",
    "purpose": "/bg-purpose.jpg",
    "regret": "/bg-regret.jpg",
    "resilience": "/bg-resilience.jpg",
    "risk": "/bg-risk.jpg",
    "self-discovery": "/bg-self-discovery.jpg",
    "strength": "/bg-strength.jpg",
    "success": "/bg-successs.jpg",
    "self-growth":"/bg-selfgrowth.jpg",
    "time": "/bg-time.jpg",
    "transformation": "/bg-transformation.jpg",
    "value": "/bg-value.jpg",
    "wisdom": "/bg-wisdom.jpg",
    "default":"/bg-qmbiition.jpg"
  };
  return map[category?.toLowerCase() || ""] || "/Whatt.jpg";
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
      setQuote(data);
      setResults([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
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

      let data = await res.json();

      const isCategorySearch =
        data.length > 0 &&
        data[0].category.toLowerCase() === search.toLowerCase();

      if (isCategorySearch) {
        data = data.slice(0, 2);
      }

      setResults(data);
      setQuote(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomQuote();
  }, []);

  const currentCategory =
    quote?.category || (results.length > 0 ? results[0].category : null);
  const bgImage = getBackgroundImage(currentCategory);
  const style = getQuoteBoxStyle(currentCategory);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat px-4 py-6 flex flex-col"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Top-Centered Search Bar */}
      <div className="flex justify-center mb-4">
        <div className="w-full max-w-xl flex gap-2">
          <Input
            type="text"
            placeholder="Search by author or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="bg-white"
          />
          <Button onClick={handleSearch} disabled={loading}>
            Search
          </Button>
        </div>
      </div>

      {/* Centered Quote Content */}
      <main className="flex-grow flex flex-col justify-center items-center">
        <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl p-6 shadow-xl max-w-xl w-full space-y-4">
          {loading && <p className="text-center text-gray-600">Loading...</p>}

          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Show random quote */}
          {!loading && quote && (
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: style.bg, color: style.text }}
            >
              <QuoteCard quote={quote} />
            </div>
          )}

          {/* Show search results */}
          {!loading && results.length > 0 && (
            <>
              <h2 className="text-lg font-semibold text-center">
                Search Results ({results.length})
              </h2>
              {results.map((q, index) => {
                const resStyle = getQuoteBoxStyle(q.category);
                return (
                  <div
                    key={`${q.quote}-${index}`}
                    className="rounded-2xl p-6"
                    style={{
                      backgroundColor: resStyle.bg,
                      color: resStyle.text,
                    }}
                  >
                    <QuoteCard quote={q} />
                  </div>
                );
              })}
            </>
          )}

          {!loading &&
            results.length === 0 &&
            search.trim() &&
            !quote && (
              <p className="text-center text-gray-500">
                No quotes found matching your search
              </p>
            )}

          {/* New Quote Button */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={fetchRandomQuote} disabled={loading}>
              New Quote
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
