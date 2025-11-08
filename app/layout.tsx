import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Providers } from "@/components/providers";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WeekCal",
  description: "Weekly-first calorie tracker"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  return (
    <html lang="en" className={inter.className}>
      <body>
        <Providers initialSession={session}>{children}</Providers>
      </body>
    </html>
  );
}
