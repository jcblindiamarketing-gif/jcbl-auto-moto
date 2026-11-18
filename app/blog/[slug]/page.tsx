
import ProductDetail from "@/components/ProductDetail";
import { generateSEOMetadata } from "@/lib/metadata";
import { getProductBySlug } from "@/lib/getProductBySlug";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return generateSEOMetadata(slug, "product");
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return <p>Product not found.</p>;
  }

return <ProductDetail initialProduct={product} />;}
