import ProductDetail from "@/components/ProductDetail";
import { generateSEOMetadata } from "@/lib/metadata";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
return generateSEOMetadata(slug, "product");

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    return <p>Product not found.</p>;
  }

  return <ProductDetail slug={slug} />;
}
