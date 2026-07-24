import BlogPost from "@/components/BlogPost";
import { notFound } from "next/navigation";
import { generateSEOMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  console.log("Metadata slug:", slug);

  return generateSEOMetadata(`/blog/${slug}/`, "post");
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  return <BlogPost slug={slug} />;
}