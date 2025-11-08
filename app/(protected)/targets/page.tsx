import { revalidatePath } from "next/cache";
import { fetchWeeklySettings } from "@/lib/queries/settings";
import { createActionSupabaseClient } from "@/lib/supabase/action";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

async function saveSettings(formData: FormData) {
  "use server";
  const supabase = createActionSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) return;

  const weekly_kcal = Number(formData.get("weekly_kcal")) || 14000;
  const carryover_cap_kcal = Number(formData.get("carryover_cap_kcal")) || 2000;
  const protein_floor_g = Number(formData.get("protein_floor_g")) || 120;
  const fibre_floor_g = Number(formData.get("fibre_floor_g")) || 25;
  const carryover_enabled = formData.get("carryover_enabled") === "on";

  await supabase.from("weekly_settings").upsert({
    user_id: session.user.id,
    weekly_kcal,
    carryover_cap_kcal,
    carryover_enabled,
    protein_floor_g,
    fibre_floor_g
  });
  revalidatePath("/targets");
}

export const dynamic = "force-dynamic";

export default async function TargetsPage() {
  const settings = await fetchWeeklySettings();

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
      <Card>
        <h2 className="text-sm font-semibold text-slate-700">Daily floors</h2>
        <p className="mt-2 text-sm text-slate-600">Protein {settings.protein_floor_g} g · Fibre {settings.fibre_floor_g} g</p>
        <p className="mt-4 text-sm text-slate-500">
          Weekly target {settings.weekly_kcal} kcal with carryover capped at {settings.carryover_cap_kcal} kcal.
        </p>
      </Card>
      <form action={saveSettings} className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-700">Update settings</h2>
        <div className="space-y-2">
          <Label htmlFor="weekly_kcal">Weekly kcal</Label>
          <Input id="weekly_kcal" name="weekly_kcal" type="number" defaultValue={settings.weekly_kcal} min={1000} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="carryover_cap_kcal">Carryover cap (kcal)</Label>
          <Input
            id="carryover_cap_kcal"
            name="carryover_cap_kcal"
            type="number"
            defaultValue={settings.carryover_cap_kcal}
            min={0}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="protein_floor_g">Protein floor (g)</Label>
          <Input id="protein_floor_g" name="protein_floor_g" type="number" defaultValue={settings.protein_floor_g} min={0} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fibre_floor_g">Fibre floor (g)</Label>
          <Input id="fibre_floor_g" name="fibre_floor_g" type="number" defaultValue={settings.fibre_floor_g} min={0} />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" name="carryover_enabled" defaultChecked={settings.carryover_enabled} /> Allow carryover
        </label>
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
}
