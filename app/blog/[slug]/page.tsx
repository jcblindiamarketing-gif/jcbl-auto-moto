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

 const [postRes, latestRes] = await Promise.all([
  fetch(
    `https://api.jcblautomoto.com/wp-json/wp/v2/posts?slug=${slug}&_embed&status=publish`,
    {
      next: { revalidate: 3600 },
    }
  ),
  fetch(
    `https://api.jcblautomoto.com/wp-json/wp/v2/posts?per_page=3&_embed&status=publish`,
    {
      next: { revalidate: 3600 },
    }
  ),
]);

const posts = await postRes.json();

if (!posts.length) {
  notFound();
}

const latestPosts = await latestRes.json();

const post = posts[0];

post.cleanedContent = post.content.rendered
  .replace(/overflow\s*:\s*hidden/gi, "overflow:visible")
  .replace(/height\s*:\s*100vh/gi, "height:auto")
  .replace(/max-height\s*:\s*\d+px/gi, "max-height:none");

return (
  <BlogPost
    post={post}
    latestPosts={latestPosts}
  />
);
}