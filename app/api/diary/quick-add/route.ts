import { NextResponse } from "next/server";
import { z } from "zod";
import { createRouteSupabaseClient } from "@/lib/supabase/route";
import { scaleNutrients } from "@/lib/nutrition";

const quickAddSchema = z.object({
  items: z
    .array(
      z.object({
        label: z.string().min(1),
        grams: z.number().int().positive()
      })
    )
    .min(1)
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = quickAddSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supabase = createRouteSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const userId = session.user.id;
  const responses = [] as { label: string; success: boolean }[];

  for (const item of parsed.data.items) {
    const { data: food } = await supabase
      .from("food_items")
      .select("id, nutrients_per_100g")
      .ilike("name", `%${item.label}%`)
      .order("name")
      .limit(1)
      .maybeSingle();

    if (!food) {
      responses.push({ label: item.label, success: false });
      continue;
    }

    const nutrients = scaleNutrients((food.nutrients_per_100g as Record<string, number>) || {}, item.grams);

    await supabase.from("diary_entries").insert({
      user_id: userId,
      food_item_id: food.id,
      occurred_at: new Date().toISOString(),
      grams: item.grams,
      nutrients_cache: nutrients
    });
    responses.push({ label: item.label, success: true });
  }

  return NextResponse.json({ status: "ok", items: responses });
}
