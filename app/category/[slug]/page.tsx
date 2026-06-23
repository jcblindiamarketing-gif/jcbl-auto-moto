import CategoryPage from "../../../components/CategoryPage.jsx";

export default async function CategoryPageWrapper({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <CategoryPage {...({ slug } as any)} />;
}