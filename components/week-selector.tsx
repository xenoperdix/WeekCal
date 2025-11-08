"use client";

import { addWeeks, format, parseISO } from "date-fns";
import { Button } from "./ui/button";

interface WeekSelectorProps {
  weekStart: string;
  onChange: (weekStart: string) => void;
}

export function WeekSelector({ weekStart, onChange }: WeekSelectorProps) {
  const current = parseISO(weekStart);

  const handleShift = (delta: number) => {
    const next = addWeeks(current, delta);
    onChange(format(next, "yyyy-MM-dd"));
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={() => handleShift(-1)} type="button">
        Previous
      </Button>
      <div className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700">
        Week of {format(current, "d MMM yyyy")}
      </div>
      <Button variant="outline" onClick={() => handleShift(1)} type="button">
        Next
      </Button>
    </div>
  );
}
