'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Quote = {
  q: string; // quote text
  a: string; // author
};

export default function Home() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://zenquotes.io/api/quotes/'); // with trailing slash
      const data = await res.json();
      setQuotes(data);
      setFiltered(data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      setQuotes([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleSearch = () => {
    const results = quotes.filter((quote) =>
      quote.q.toLowerCase().includes(search.toLowerCase()) ||
      quote.a.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(results);
  };

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Random Quote Generator</h1>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Search quotes or authors"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {loading && <p>Loading quotes...</p>}
      {!loading && filtered.length === 0 && <p>No matching quotes found.</p>}

      <div className="grid gap-4">
        {filtered.map((quote, idx) => (
          <Card key={idx}>
            <CardContent className="p-4">
              <p className="text-lg">“{quote.q}”</p>
              <p className="text-sm text-right mt-2">- {quote.a}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
