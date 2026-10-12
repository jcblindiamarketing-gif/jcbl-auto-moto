
import CategoryPage from "../../../components/CategoryPage";
import { generateSEOMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const currentSlug = slug[slug.length - 1];
  const categoryPath = `/category/${slug.join("/")}`;

  return generateSEOMetadata(
    currentSlug,
    "category",
    categoryPath
  );
}

export default async function CategoryPageWrapper({
  params,
}: Props) {
  const { slug } = await params;
  const currentSlug = slug[slug.length - 1];

  return <CategoryPage slug={currentSlug} />;
}
