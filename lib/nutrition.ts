export interface NutrientSet {
  kcal?: number;
  protein_g?: number;
  fibre_g?: number;
  [key: string]: number | undefined;
}

export function scaleNutrients(per100g: NutrientSet, grams: number) {
  const factor = grams / 100;
  return {
    kcal: Math.round((per100g.kcal ?? 0) * factor),
    protein_g: Number(((per100g.protein_g ?? 0) * factor).toFixed(1)),
    fibre_g: Number(((per100g.fibre_g ?? 0) * factor).toFixed(1))
  };
}

export function roundGrams(value: number) {
  return Math.round(value);
}
