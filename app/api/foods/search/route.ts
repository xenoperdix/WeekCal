import { NextResponse } from "next/server";
import { createRouteSupabaseClient } from "@/lib/supabase/route";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const supabase = createRouteSupabaseClient();

  let dbQuery = supabase.from("food_items").select("id, name, brand, default_serving_g").limit(20);
  if (query) {
    dbQuery = dbQuery.ilike("name", `%${query}%`);
  }

  const { data } = await dbQuery.order("name");

  return NextResponse.json({
    items: data ?? []
  });
}
