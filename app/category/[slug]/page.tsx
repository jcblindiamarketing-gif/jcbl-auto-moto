import CategoryPage from "@/components/CategoryPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <CategoryPage slug={slug} />;
}