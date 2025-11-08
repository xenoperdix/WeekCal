"use client";

import { addDays, format, parseISO } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";

import { WeekSelector } from "./week-selector";
import { Button } from "./ui/button";

interface DiaryWeekSelectorProps {
  weekStart: string;
  day: string;
}

export function DiaryWeekSelector({ weekStart, day }: DiaryWeekSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateDayParam = (nextDay: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("day", nextDay);
    router.push(`/log?${params.toString()}`);
  };

  const handleWeekChange = (nextWeek: string) => {
    updateDayParam(nextWeek);
  };

  const handleDaySelect = (nextDay: string) => {
    updateDayParam(nextDay);
  };

  const parsedWeekStart = parseISO(weekStart);
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(parsedWeekStart, index);
    return {
      iso: format(date, "yyyy-MM-dd"),
      label: format(date, "EEE d MMM")
    };
  });

  return (
    <div className="space-y-2">
      <WeekSelector weekStart={weekStart} onChange={handleWeekChange} />
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        {days.map((option) => (
          <Button
            key={option.iso}
            type="button"
            variant={option.iso === day ? "default" : "outline"}
            onClick={() => handleDaySelect(option.iso)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
