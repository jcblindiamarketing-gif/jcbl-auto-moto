import BlogPost from "@/components/BlogPost";
import { generateSEOMetadata } from "@/lib/metadata";

const WP_API = "https://api.jcblautomoto.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return generateSEOMetadata(slug, "post", `/blog/${slug}`);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const postRes = await fetch(
    `${WP_API}/wp-json/wp/v2/posts?slug=${encodeURIComponent(
      slug
    )}&_embed&status=publish`,
    {
      cache: "no-store",
    }
  );

  if (!postRes.ok) {
    return <p>Unable to load blog article.</p>;
  }

  const posts = await postRes.json();

  if (!Array.isArray(posts) || posts.length === 0) {
    return <p>Blog article not found.</p>;
  }

  const post = posts[0];

  const cleanedContent = (post.content?.rendered || "")
    .replace(/overflow\s*:\s*hidden/gi, "overflow:visible")
    .replace(/height\s*:\s*100vh/gi, "height:auto");

  const formattedPost = {
    ...post,
    cleanedContent,
  };

let latestPosts: any[] = [];
  try {
    const latestRes = await fetch(
      `${WP_API}/wp-json/wp/v2/posts?per_page=3&_embed&status=publish`,
      {
        cache: "no-store",
      }
    );

    if (latestRes.ok) {
      const data = await latestRes.json();

      if (Array.isArray(data)) {
        latestPosts = data;
      }
    }
  } catch (error) {
    console.error("Latest blogs fetch failed:", error);
  }

  return (
    <BlogPost
      post={formattedPost}
      latestPosts={latestPosts}
    />
  );
}
