import CategoryPage from "@/components/CategoryPage";

interface PageProps {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

export default async function SubCategoryPage({ params }: PageProps) {
  const { category, subcategory } = await params;

  return (
    <CategoryPage
      slug={subcategory}
      parentSlug={category}
    />
  );
}