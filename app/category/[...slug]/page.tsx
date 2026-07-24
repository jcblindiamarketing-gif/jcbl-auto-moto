import CategoryPage from "../../../components/CategoryPage";
import { generateSEOMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const currentSlug = slug[slug.length - 1];

  console.log("generateMetadata category:", currentSlug);

  return generateSEOMetadata(currentSlug, "category");
}

export default async function CategoryPageWrapper({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const currentSlug = slug[slug.length - 1];

  return <CategoryPage slug={currentSlug} />;
}