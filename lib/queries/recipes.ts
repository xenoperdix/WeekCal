import { createServerSupabaseClient } from "../supabase/server";

export async function fetchRecipes() {
  const supabase = createServerSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) return [];
  const { data } = await supabase
    .from("recipes")
    .select("id, name, method_md")
    .eq("user_id", session.user.id)
    .order("updated_at", { ascending: false });
  return data ?? [];
}
