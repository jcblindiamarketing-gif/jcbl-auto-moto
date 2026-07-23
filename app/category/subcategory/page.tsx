import CategoryPage from "@/components/CategoryPage";

interface PageProps {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

export default async function SubCategoryPage({ params }: PageProps) {
  const { subcategory } = await params;

  return <CategoryPage slug={subcategory} />;
}