import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
}

export function Progress({ value, max = 100, className, ...props }: ProgressProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const percentage = (clamped / max) * 100;

  return (
    <div className={cn("h-3 w-full overflow-hidden rounded-full bg-slate-200", className)} {...props}>
      <div className="h-full rounded-full bg-slate-900 transition-all" style={{ width: `${percentage}%` }} />
    </div>
  );
}
