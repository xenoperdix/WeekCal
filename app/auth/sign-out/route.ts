import { NextResponse } from "next/server";
import { createRouteSupabaseClient } from "@/lib/supabase/route";

export async function POST(request: Request) {
  const supabase = createRouteSupabaseClient();
  await supabase.auth.signOut();
  const url = new URL("/sign-in", request.url);
  return NextResponse.redirect(url);
}
