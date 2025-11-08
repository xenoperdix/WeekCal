import { format, parseISO } from "date-fns";

import { DiaryEntryItem } from "@/components/diary-entry-item";
import { DiaryWeekSelector } from "@/components/diary-week-selector";
import { FoodSearch } from "@/components/food-search";
import { QuickAddForm } from "@/components/quick-add-form";
import { Card } from "@/components/ui/card";
import { fetchDiaryEntries } from "@/lib/queries/diary";
import { formatNumber } from "@/lib/utils";

interface LogPageProps {
  searchParams: { day?: string };
}

export const dynamic = "force-dynamic";

export default async function LogPage({ searchParams }: LogPageProps) {
  const diary = await fetchDiaryEntries(searchParams.day);
  const dayLabel = format(parseISO(diary.day), "EEEE d MMMM yyyy");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <Card className="flex-1">
          <h2 className="text-sm font-semibold text-slate-700">{dayLabel}</h2>
          <p className="mt-2 text-2xl font-bold text-slate-900">{formatNumber(diary.totals.kcal)} kcal</p>
          <p className="text-sm text-slate-500">
            Protein {formatNumber(diary.totals.protein)} g · Fibre {formatNumber(diary.totals.fibre)} g
          </p>
        </Card>
        <div className="md:max-w-sm">
          <DiaryWeekSelector weekStart={diary.weekStart} day={diary.day} />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-700">Entries</h3>
            {diary.entries.length ? (
              diary.entries.map((entry) => (
                <DiaryEntryItem
                  key={entry.id}
                  name={entry.food_name}
                  occurred_at={entry.occurred_at}
                  grams={entry.grams}
                  nutrients_cache={entry.nutrients_cache}
                />
              ))
            ) : (
              <p className="text-sm text-slate-500">No entries yet.</p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <QuickAddForm />
          <FoodSearch />
        </div>
      </div>
    </div>
  );
}
