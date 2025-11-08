import { createServerSupabaseClient } from "../supabase/server";

export async function fetchFoods(query?: string) {
  const supabase = createServerSupabaseClient();
  let request = supabase.from("food_items").select("id, name, brand, default_serving_g").limit(25);
  if (query) {
    request = request.ilike("name", `%${query}%`);
  }
  const { data } = await request.order("name");
  return (data ?? []).map((item) => ({
    ...item,
    default_serving_g:
      item.default_serving_g === null
        ? null
        : typeof item.default_serving_g === "number"
        ? item.default_serving_g
        : Number(item.default_serving_g)
  }));
}
