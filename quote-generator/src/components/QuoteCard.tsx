interface QuoteProps {
  quote: {
    quote: string;
    author: string;
    category: string;
  };
}

export default function QuoteCard({ quote }: QuoteProps) {
  return (
    <div className="border rounded-2xl p-6 shadow-md bg-white space-y-4 hover:shadow-lg transition-shadow">
      <p className="text-xl font-semibold italic">&quot;{quote.quote}&quot;</p>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">— {quote.author}</p>
        <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
          {quote.category}
        </span>
      </div>
    </div>
  );
}