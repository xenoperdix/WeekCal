import { describe, expect, it } from "vitest";
import { roundGrams, scaleNutrients } from "../lib/nutrition";

describe("nutrition helpers", () => {
  it("rounds grams to nearest integer", () => {
    expect(roundGrams(123.4)).toBe(123);
    expect(roundGrams(123.5)).toBe(124);
  });

  it("scales nutrients per serving", () => {
    const result = scaleNutrients({ kcal: 200, protein_g: 10, fibre_g: 5 }, 150);
    expect(result.kcal).toBe(300);
    expect(result.protein_g).toBeCloseTo(15);
    expect(result.fibre_g).toBeCloseTo(7.5);
  });
});
