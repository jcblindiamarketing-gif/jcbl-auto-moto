import CategoryPage from "...";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  const currentSlug = slug.at(-1);

  if (!currentSlug) {
    return null;
  }

  return <CategoryPage slug={currentSlug} />;
}