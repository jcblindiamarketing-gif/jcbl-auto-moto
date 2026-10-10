import type { Metadata } from "next";
import CategoryPage from "../../../components/CategoryPage";
import { getCategorySEO } from "../../../lib/getCategorySEO";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const currentSlug = slug?.[slug.length - 1];

  try {
    const seo = currentSlug ? await getCategorySEO(currentSlug) : null;

    return {
      title: seo?.title?.trim() || "JCBL Auto Moto",
      description: seo?.metaDesc?.trim() || "JCBL India Auto Moto",
    };
  } catch (error) {
    console.error("Category SEO metadata error:", error);

    return {
      title: "JCBL Auto Moto",
      description: "JCBL India Auto Moto",
    };
  }
}

export default async function CategoryPageWrapper({
  params,
}: PageProps) {
  const { slug } = await params;
  const currentSlug = slug[slug.length - 1];

  return <CategoryPage slug={currentSlug} />;
}
