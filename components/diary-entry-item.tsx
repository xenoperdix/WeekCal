import { format } from "date-fns";
import type { Json } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface DiaryEntryItemProps {
  name: string;
  occurred_at: string;
  grams: number;
  nutrients_cache: Json | null;
}

interface NutrientsCache {
  kcal?: number;
  protein_g?: number;
  fibre_g?: number;
}

export function DiaryEntryItem({ name, occurred_at, grams, nutrients_cache }: DiaryEntryItemProps) {
  const nutrients = (nutrients_cache as NutrientsCache | null) ?? {};
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
      <div>
        <p className="text-sm font-medium text-slate-900">{name}</p>
        <p className="text-xs text-slate-500">
          {format(new Date(occurred_at), "HH:mm")} · {formatNumber(grams)} g
        </p>
      </div>
      <div className="flex gap-4 text-xs text-slate-500">
        {nutrients.kcal !== undefined && <span>{formatNumber(nutrients.kcal)} kcal</span>}
        {nutrients.protein_g !== undefined && <span>{formatNumber(nutrients.protein_g)} g protein</span>}
        {nutrients.fibre_g !== undefined && <span>{formatNumber(nutrients.fibre_g)} g fibre</span>}
      </div>
    </div>
  );
}
