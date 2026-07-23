import CategoryPage from "../../../components/CategoryPage";

export default async function CategoryPageWrapper({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  // last URL segment
  const currentSlug = slug[slug.length - 1];

  return <CategoryPage slug={currentSlug} />;
}