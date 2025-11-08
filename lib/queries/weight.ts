import { createServerSupabaseClient } from "../supabase/server";

export async function fetchWeightLogs() {
  const supabase = createServerSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) return [];
  const { data } = await supabase
    .from("weight_logs")
    .select("id, measured_on, weight_kg")
    .eq("user_id", session.user.id)
    .order("measured_on", { ascending: true });
  return (data ?? []).map((entry) => ({
    ...entry,
    weight_kg: typeof entry.weight_kg === "number" ? entry.weight_kg : Number(entry.weight_kg)
  }));
}
