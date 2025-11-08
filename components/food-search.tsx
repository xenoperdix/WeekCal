"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";

interface FoodItem {
  id: number;
  name: string;
  brand: string | null;
  default_serving_g: number | null;
}

export function FoodSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    if (!query) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      const response = await fetch(`/api/foods/search?q=${encodeURIComponent(query)}`, {
        signal: controller.signal
      });
      if (response.ok) {
        const data = await response.json();
        setResults(data.items);
      }
    }, 200);
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query]);

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-slate-700">Food search</h2>
      <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search foods" />
      <div className="space-y-2 text-sm">
        {results.map((item) => (
          <div key={item.id} className="rounded-md border border-slate-200 px-3 py-2">
            <p className="font-medium text-slate-800">{item.name}</p>
            {item.brand && <p className="text-xs text-slate-500">{item.brand}</p>}
            {item.default_serving_g && (
              <p className="text-xs text-slate-500">Default serving {item.default_serving_g} g</p>
            )}
          </div>
        ))}
        {!results.length && <p className="text-xs text-slate-500">Type to find foods.</p>}
      </div>
    </div>
  );
}
