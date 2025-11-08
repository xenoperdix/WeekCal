import { createServerSupabaseClient } from "../supabase/server";
import { DEFAULT_WEEKLY_SETTINGS } from "../weekly";

export async function fetchWeeklySettings() {
  const supabase = createServerSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) {
    return DEFAULT_WEEKLY_SETTINGS;
  }

  const { data } = await supabase
    .from("weekly_settings")
    .select("weekly_kcal, carryover_enabled, carryover_cap_kcal, protein_floor_g, fibre_floor_g")
    .eq("user_id", session.user.id)
    .maybeSingle();

  return data ?? DEFAULT_WEEKLY_SETTINGS;
}
