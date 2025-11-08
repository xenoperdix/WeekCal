"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function QuickAddForm() {
  const [label, setLabel] = useState("");
  const [grams, setGrams] = useState(100);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    const response = await fetch("/api/diary/quick-add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: [
          {
            label,
            grams: Number(grams)
          }
        ]
      })
    });

    if (!response.ok) {
      setMessage("Could not add item.");
    } else {
      setMessage("Logged.");
      setLabel("");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-slate-700">Quick add</h2>
      <Input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Food name" required />
      <Input
        type="number"
        value={grams}
        min={1}
        onChange={(event) => setGrams(Number(event.target.value))}
        placeholder="Grams"
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Adding…" : "Add"}
      </Button>
      {message && <p className="text-xs text-slate-500">{message}</p>}
    </form>
  );
}
