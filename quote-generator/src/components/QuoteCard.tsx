// components/QuoteCard.tsx
import React from "react";
import { getQuoteBoxStyle } from "@/lib/getQuoteBoxStyle"; // ✅ must be this

// use it like:
// eslint-disable-next-line @typescript-eslint/no-unused-vars

interface Quote {
  quote: string;
  author: string;
  category: string;
}

const QuoteCard: React.FC<{ quote: Quote }> = ({ quote }) => {
  const style = getQuoteBoxStyle(quote.category);

  return (
    <div>
      <p className="text-lg font-semibold mb-2" style={{ color: style.text }}>
        “{quote.quote}”
      </p>
      <div className="flex justify-between items-center">
        <p className="text-sm italic" style={{ color: style.text }}>
          — {quote.author}
        </p>
        <span
          className="text-xs px-3 py-1 rounded-full font-medium"
          style={{
            backgroundColor: style.bg,
            color: style.text,
            border: `1px solid ${style.text}`,
          }}
        >
          {quote.category}
        </span>
      </div>
    </div>
  );
};

export default QuoteCard;
