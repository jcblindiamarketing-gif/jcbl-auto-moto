import Home from "@/components/Home";
import { getCategories } from "@/lib/getCategories";

export default async function Page() {
  const categories = await getCategories();

  return <Home categories={categories} />;
}