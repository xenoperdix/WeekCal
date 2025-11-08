import { format } from "date-fns";
import { fetchWeightLogs } from "@/lib/queries/weight";
import { createActionSupabaseClient } from "@/lib/supabase/action";
import { revalidatePath } from "next/cache";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

async function addWeight(formData: FormData) {
  "use server";
  const supabase = createActionSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) return;

  const measured_on = formData.get("measured_on")?.toString() ?? new Date().toISOString().slice(0, 10);
  const weight_kg = Number(formData.get("weight_kg"));
  if (!weight_kg) return;

  await supabase.from("weight_logs").insert({ user_id: session.user.id, measured_on, weight_kg });
  revalidatePath("/weight");
}

function WeightChart({
  data
}: {
  data: { measured_on: string; weight_kg: number }[];
}) {
  if (!data.length) return <p className="text-sm text-slate-500">No weight logs yet.</p>;
  const values = data.map((d) => d.weight_kg);
  const min = Math.min(...values) - 1;
  const max = Math.max(...values) + 1;
  const points = data
    .map((entry, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 100;
      const y = ((max - entry.weight_kg) / (max - min || 1)) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" className="h-48 w-full rounded-lg border border-slate-200 bg-white p-4">
      <polyline fill="none" stroke="#0f172a" strokeWidth="2" points={points} />
    </svg>
  );
}

export const dynamic = "force-dynamic";

export default async function WeightPage() {
  const weights = await fetchWeightLogs();

  return (
    <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
      <Card>
        <h2 className="text-sm font-semibold text-slate-700">Weight trend</h2>
        <div className="mt-4">
          <WeightChart data={weights} />
        </div>
        <ul className="mt-4 space-y-1 text-sm text-slate-600">
          {weights.map((entry) => (
            <li key={entry.id}>
              {format(new Date(entry.measured_on), "d MMM yyyy")} · {entry.weight_kg.toFixed(1)} kg
            </li>
          ))}
        </ul>
      </Card>
      <form action={addWeight} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-700">Log weight</h2>
        <Input type="date" name="measured_on" defaultValue={new Date().toISOString().slice(0, 10)} />
        <Input type="number" step="0.1" name="weight_kg" placeholder="Weight (kg)" required />
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
}
