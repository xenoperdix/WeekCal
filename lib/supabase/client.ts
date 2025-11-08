import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types";

export const createClientSupabaseClient = (): SupabaseClient<Database> =>
  createBrowserSupabaseClient<Database>(
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    }
  ) as unknown as SupabaseClient<Database>;
