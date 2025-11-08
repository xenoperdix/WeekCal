import { startOfLondonWeek, todayInLondon } from "./time";

export interface WeeklySettings {
  weekly_kcal: number;
  carryover_enabled: boolean;
  carryover_cap_kcal: number;
  protein_floor_g: number;
  fibre_floor_g: number;
}

export const DEFAULT_WEEKLY_SETTINGS: WeeklySettings = {
  weekly_kcal: 14000,
  carryover_enabled: true,
  carryover_cap_kcal: 2000,
  protein_floor_g: 120,
  fibre_floor_g: 25
};

export const clampBank = (bank: number, cap: number) => Math.max(Math.min(bank, cap), -cap);

export function calculateWeeklyBank(params: {
  bankLastWeek: number;
  weeklyKcal: number;
  kcalThisWeek: number;
  carryoverCap: number;
}) {
  const { bankLastWeek, weeklyKcal, kcalThisWeek, carryoverCap } = params;
  return clampBank(bankLastWeek + weeklyKcal - kcalThisWeek, carryoverCap);
}

export const getCurrentWeekStart = () => startOfLondonWeek(new Date());

export const getToday = () => todayInLondon();
