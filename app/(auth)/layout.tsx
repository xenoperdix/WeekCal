import "../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WeekCal · Sign in"
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center bg-slate-100">{children}</div>;
}
