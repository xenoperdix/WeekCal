import Link from "next/link";
import { fetchFoods } from "@/lib/queries/foods";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface FoodsPageProps {
  searchParams: { q?: string };
}

export const dynamic = "force-dynamic";

export default async function FoodsPage({ searchParams }: FoodsPageProps) {
  const foods = await fetchFoods(searchParams.q);

  return (
    <div className="space-y-6">
      <form className="flex gap-2">
        <Input
          name="q"
          defaultValue={searchParams.q ?? ""}
          placeholder="Search foods"
          className="w-full max-w-sm"
        />
        <button className="rounded-md border border-slate-300 px-4 text-sm">Search</button>
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        {foods.map((food) => (
          <Card key={food.id}>
            <h2 className="text-base font-semibold text-slate-900">{food.name}</h2>
            {food.brand && <p className="text-sm text-slate-500">{food.brand}</p>}
            {food.default_serving_g && (
              <p className="text-sm text-slate-500">Default serving {food.default_serving_g} g</p>
            )}
            <Link href={`/log?food=${food.id}`} className="mt-4 inline-flex text-sm text-slate-600 hover:text-slate-900">
              Add to diary
            </Link>
          </Card>
        ))}
        {!foods.length && <p className="text-sm text-slate-500">No foods yet.</p>}
      </div>
    </div>
  );
}
