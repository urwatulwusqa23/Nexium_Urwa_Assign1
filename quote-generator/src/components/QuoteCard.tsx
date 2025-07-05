"use client";

import { Card, CardContent } from "@/components/ui/card";

type QuoteProps = {
  content: string;
  author: string;
};

export default function QuoteCard({ content, author }: QuoteProps) {
  return (
    <Card className="my-4 shadow-lg">
      <CardContent className="p-6">
        <p className="text-xl italic">&quot;{content}&quot;</p>
        <p className="text-right mt-4 font-semibold">- {author}</p>
      </CardContent>
    </Card>
  );
}
