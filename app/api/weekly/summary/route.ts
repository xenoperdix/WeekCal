import { NextResponse } from "next/server";
import { fetchWeeklySummary } from "@/lib/queries/weekly";
import { createRouteSupabaseClient } from "@/lib/supabase/route";

export async function GET() {
  const supabase = createRouteSupabaseClient();
  const summary = await fetchWeeklySummary(supabase);
  if (!summary) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  return NextResponse.json(summary);
}
