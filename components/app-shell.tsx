"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/log", label: "Diary" },
  { href: "/foods", label: "Foods" },
  { href: "/recipes", label: "Recipes" },
  { href: "/targets", label: "Targets" },
  { href: "/weight", label: "Weight" }
];

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <Link href="/dashboard" className="text-lg font-semibold text-slate-900">
              WeekCal
            </Link>
            <p className="text-sm text-slate-500">Weekly-first food diary</p>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 transition-colors",
                    active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <form action="/auth/sign-out" method="post">
            <button className="text-sm text-slate-600 hover:text-slate-900">Sign out</button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
