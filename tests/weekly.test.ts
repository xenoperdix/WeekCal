import { describe, expect, it } from "vitest";
import { calculateWeeklyBank, clampBank } from "../lib/weekly";

describe("weekly bank", () => {
  it("clamps carryover within cap", () => {
    expect(clampBank(2500, 2000)).toBe(2000);
    expect(clampBank(-3000, 2000)).toBe(-2000);
  });

  it("computes new bank from prior week and intake", () => {
    const bank = calculateWeeklyBank({ bankLastWeek: 500, weeklyKcal: 14000, kcalThisWeek: 12000, carryoverCap: 2000 });
    expect(bank).toBe(2000);
  });
});
