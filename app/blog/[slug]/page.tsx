import BlogPost from "@/components/BlogPost";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Await the params (Next.js 15+)
  const { slug } = await params;

  console.log("Slug from params:", slug);

  if (!slug) {
    console.error("No slug found in params");
    notFound();
  }

  return <BlogPost slug={slug} />;
}