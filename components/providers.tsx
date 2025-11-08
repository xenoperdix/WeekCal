"use client";

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import type { Session } from "@supabase/auth-helpers-nextjs";
import { createClientSupabaseClient } from "@/lib/supabase/client";

interface ProvidersProps {
  initialSession: Session | null;
  children: React.ReactNode;
}

export function Providers({ initialSession, children }: ProvidersProps) {
  const [supabaseClient] = useState(() => createClientSupabaseClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
      {children}
    </SessionContextProvider>
  );
}
