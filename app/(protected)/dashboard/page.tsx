import { fetchWeeklySummary } from "@/lib/queries/weekly";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const summary = await fetchWeeklySummary();

  if (!summary) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <h2 className="text-sm font-semibold text-slate-700">Week total</h2>
          <p className="mt-2 text-3xl font-bold text-slate-900">{formatNumber(summary.kcal_total)} kcal</p>
          <p className="text-sm text-slate-500">Week of {summary.week_start}</p>
          <div className="mt-4 space-y-2">
            <Progress value={summary.kcal_total} max={summary.weekly_kcal} />
            <p className="text-xs text-slate-500">
              {formatNumber(summary.kcal_total)} / {formatNumber(summary.weekly_kcal)} kcal
            </p>
          </div>
        </Card>
        <Card>
          <h2 className="text-sm font-semibold text-slate-700">Bank</h2>
          <p className="mt-2 text-3xl font-bold text-slate-900">{formatNumber(summary.bank_current)} kcal</p>
          <p className="text-sm text-slate-500">Prior bank {formatNumber(summary.bank_prior)} kcal</p>
          <p className="mt-4 text-sm text-slate-500">Remaining {formatNumber(summary.remaining)} kcal</p>
        </Card>
        <Card>
          <h2 className="text-sm font-semibold text-slate-700">Rolling 7-day</h2>
          <p className="mt-2 text-3xl font-bold text-slate-900">{formatNumber(summary.rolling7)} kcal</p>
          <p className="text-sm text-slate-500">Protein {formatNumber(summary.protein_today)} g · Fibre {formatNumber(summary.fibre_today)} g</p>
          <div className="mt-4 text-sm">
            <p className={summary.protein_floor_met_today ? "text-emerald-600" : "text-amber-600"}>
              Protein floor {summary.protein_floor_met_today ? "met" : "not met"}
            </p>
            <p className={summary.fibre_floor_met_today ? "text-emerald-600" : "text-amber-600"}>
              Fibre floor {summary.fibre_floor_met_today ? "met" : "not met"}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
