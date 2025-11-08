import { createServerSupabaseClient } from "../supabase/server";
import { parseLondonDate, startOfLondonWeek, todayInLondon } from "../time";

export async function fetchDiaryEntries(day?: string) {
  const supabase = createServerSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  const today = todayInLondon();

  if (!session) {
    return { day: today, weekStart: startOfLondonWeek(parseLondonDate(today)), entries: [], totals: { kcal: 0, protein: 0, fibre: 0 } };
  }

  const targetDay = day ?? today;
  const start = `${targetDay}T00:00:00+00`;
  const end = `${targetDay}T23:59:59+00`;

  const { data: entries } = await supabase
    .from("diary_entries")
    .select("id, occurred_at, grams, nutrients_cache, food_items(name)")
    .eq("user_id", session.user.id)
    .gte("occurred_at", start)
    .lte("occurred_at", end)
    .order("occurred_at", { ascending: false });

  const totals = (entries ?? []).reduce(
    (acc, entry) => {
      const nutrients = (entry.nutrients_cache as { kcal?: number; protein_g?: number; fibre_g?: number } | null) ?? {};
      return {
        kcal: acc.kcal + Number(nutrients.kcal ?? 0),
        protein: acc.protein + Number(nutrients.protein_g ?? 0),
        fibre: acc.fibre + Number(nutrients.fibre_g ?? 0)
      };
    },
    { kcal: 0, protein: 0, fibre: 0 }
  );

  return {
    day: targetDay,
    weekStart: startOfLondonWeek(parseLondonDate(targetDay)),
    entries: (entries ?? []).map((entry) => ({
      id: entry.id,
      occurred_at: entry.occurred_at,
      grams: Number(entry.grams),
      nutrients_cache: entry.nutrients_cache,
      food_name: (entry as any).food_items?.name ?? "Food"
    })),
    totals
  };
}
