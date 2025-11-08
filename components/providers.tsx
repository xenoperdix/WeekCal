"use client";

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import type { Session } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/types";

interface ProvidersProps {
  initialSession: Session | null;
  children: React.ReactNode;
}

export function Providers({ initialSession, children }: ProvidersProps) {
  const [supabaseClient] = useState<SupabaseClient<Database>>(
    () => createClientSupabaseClient()
  );

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={initialSession}
    >
      {children}
    </SessionContextProvider>
  );
}
