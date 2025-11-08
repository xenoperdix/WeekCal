import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const dynamic = "force-dynamic";

async function signIn(formData: FormData) {
  "use server";
  const email = formData.get("email")?.toString();
  if (!email) {
    return;
  }
  const supabase = createServerActionClient({ cookies });
  await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
}

export default function SignInPage() {
  async function handleSignIn(formData: FormData) {
    "use server";
    await signIn(formData);
    redirect("/auth/check-email");
  }

  return (
    <div className="w-full max-w-sm space-y-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Sign in</h1>
        <p className="text-sm text-slate-500">We send a magic link to your email.</p>
      </div>
      <form action={handleSignIn} className="space-y-4">
        <div className="space-y-2 text-left">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="you@example.com" />
        </div>
        <Button type="submit" className="w-full">
          Email me a link
        </Button>
      </form>
    </div>
  );
}
