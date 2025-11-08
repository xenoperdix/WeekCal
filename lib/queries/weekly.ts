import type { SupabaseClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "../supabase/server";
import type { Database } from "../types";
import { DEFAULT_WEEKLY_SETTINGS, calculateWeeklyBank, getCurrentWeekStart, getToday } from "../weekly";
import { startOfLondonWeek } from "../time";

type Client = SupabaseClient<Database>;

export async function fetchWeeklySummary(client?: Client) {
  const supabase = client ?? createServerSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  const userId = session.user.id;
  const today = getToday();
  const currentWeekStart = getCurrentWeekStart();
  const previousWeekStart = startOfLondonWeek(new Date(new Date().setDate(new Date().getDate() - 7)));

  const { data: settingsData } = await supabase
    .from("weekly_settings")
    .select()
    .eq("user_id", userId)
    .maybeSingle();

  const settings = settingsData
    ? {
        weekly_kcal: settingsData.weekly_kcal,
        carryover_enabled: settingsData.carryover_enabled,
        carryover_cap_kcal: settingsData.carryover_cap_kcal,
        protein_floor_g: settingsData.protein_floor_g,
        fibre_floor_g: settingsData.fibre_floor_g
      }
    : DEFAULT_WEEKLY_SETTINGS;

  const { data: currentIntake } = await supabase
    .from("v_weekly_intake")
    .select("kcal_total, protein_g_total, fibre_g_total")
    .eq("user_id", userId)
    .eq("week_start", currentWeekStart)
    .maybeSingle();

  const { data: previousIntake } = await supabase
    .from("v_weekly_intake")
    .select("kcal_total")
    .eq("user_id", userId)
    .eq("week_start", previousWeekStart)
    .maybeSingle();

  const { data: rolling7Data } = await supabase
    .from("v_rolling7_intake")
    .select("kcal_rolling7")
    .eq("user_id", userId)
    .eq("anchor_day", today)
    .maybeSingle();

  const { data: floorData } = await supabase
    .from("v_daily_floors")
    .select("protein_g, fibre_g")
    .eq("user_id", userId)
    .eq("day", today)
    .maybeSingle();

  const kcalThisWeek = currentIntake?.kcal_total ?? 0;
  const bankLastWeek = previousIntake ? settings.weekly_kcal - previousIntake.kcal_total : 0;
  const bankCurrent = settings.carryover_enabled
    ? calculateWeeklyBank({
        bankLastWeek,
        weeklyKcal: settings.weekly_kcal,
        kcalThisWeek,
        carryoverCap: settings.carryover_cap_kcal
      })
    : 0;
  const remaining = settings.weekly_kcal + bankCurrent - kcalThisWeek;

  return {
    week_start: currentWeekStart,
    kcal_total: kcalThisWeek,
    weekly_kcal: settings.weekly_kcal,
    bank_prior: bankLastWeek,
    bank_current: bankCurrent,
    remaining,
    rolling7: rolling7Data?.kcal_rolling7 ?? kcalThisWeek,
    protein_floor_met_today: (floorData?.protein_g ?? 0) >= settings.protein_floor_g,
    fibre_floor_met_today: (floorData?.fibre_g ?? 0) >= settings.fibre_floor_g,
    protein_today: floorData?.protein_g ?? 0,
    fibre_today: floorData?.fibre_g ?? 0,
    protein_floor: settings.protein_floor_g,
    fibre_floor: settings.fibre_floor_g
  };
}
