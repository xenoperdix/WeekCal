import { revalidatePath } from "next/cache";
import { fetchRecipes } from "@/lib/queries/recipes";
import { createActionSupabaseClient } from "@/lib/supabase/action";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

async function createRecipe(formData: FormData) {
  "use server";
  const name = formData.get("name")?.toString();
  const method = formData.get("method")?.toString() ?? "";
  if (!name) return;
  const supabase = createActionSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) return;
  await supabase.from("recipes").insert({ user_id: session.user.id, name, method_md: method });
  revalidatePath("/recipes");
}

async function addRecipeToDiary(formData: FormData) {
  "use server";
  const recipeId = Number(formData.get("recipe_id"));
  const grams = Number(formData.get("grams")) || 100;
  const supabase = createActionSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session || !recipeId) return;
  await supabase
    .from("diary_entries")
    .insert({ user_id: session.user.id, recipe_id: recipeId, occurred_at: new Date().toISOString(), grams });
  revalidatePath("/log");
}

export const dynamic = "force-dynamic";

export default async function RecipesPage() {
  const recipes = await fetchRecipes();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-700">Your recipes</h2>
        {recipes.length ? (
          recipes.map((recipe) => (
            <Card key={recipe.id}>
              <h3 className="text-base font-semibold text-slate-900">{recipe.name}</h3>
              {recipe.method_md && <p className="mt-2 whitespace-pre-line text-sm text-slate-600">{recipe.method_md}</p>}
              <form action={addRecipeToDiary} className="mt-4 flex items-center gap-2 text-sm">
                <input type="hidden" name="recipe_id" value={recipe.id} />
                <Input type="number" name="grams" defaultValue={100} min={1} className="w-24" />
                <Button type="submit" variant="outline">
                  Add to diary
                </Button>
              </form>
            </Card>
          ))
        ) : (
          <p className="text-sm text-slate-500">No recipes yet.</p>
        )}
      </div>
      <div>
        <form action={createRecipe} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-700">Add recipe</h2>
          <Input name="name" placeholder="Name" required />
          <Textarea name="method" placeholder="Method" rows={6} />
          <Button type="submit">Save</Button>
        </form>
      </div>
    </div>
  );
}
