import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "../types";

export const createActionSupabaseClient = () => {
  return createServerActionClient<Database>({ cookies });
};
