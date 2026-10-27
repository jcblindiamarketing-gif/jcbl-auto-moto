
const API_URL = "https://api.jcblautomoto.com/graphql";
const SITE_URL = "https://www.jcblautomoto.com";

type SitemapPost = {
  uri: string | null;
  modified: string | null;
  seo?: {
    metaRobotsNoindex?: string | null;
  } | null;
};

async function getAllPosts(): Promise<SitemapPost[]> {
  const allPosts: SitemapPost[] = [];
  let after: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 },
      body: JSON.stringify({
        query: `
          query GetPosts($after: String) {
            posts(first: 100, after: $after) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                uri
                modified
                seo {
                  metaRobotsNoindex
                }
              }
            }
          }
        `,
        variables: { after },
      }),
    });

    if (!res.ok) {
      throw new Error(`WordPress GraphQL HTTP error: ${res.status}`);
    }

    const json = await res.json();

    if (json.errors?.length) {
      console.error("Post sitemap GraphQL errors:", json.errors);
      throw new Error("Unable to retrieve Yoast robots settings");
    }

    const posts = json?.data?.posts;
    if (!posts?.pageInfo || !Array.isArray(posts.nodes)) {
      throw new Error("Invalid posts response from WordPress GraphQL");
    }

    allPosts.push(...posts.nodes);

    hasNextPage = posts.pageInfo.hasNextPage;
    after = posts.pageInfo.endCursor;

    if (hasNextPage && !after) {
      throw new Error("Missing GraphQL pagination cursor");
    }
  }

  return allPosts;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  try {
    const posts = await getAllPosts();

    const indexablePosts = posts.filter((post) => {
      if (!post.uri) return false;

      // Exclude only posts explicitly marked noindex by Yoast.
      return post.seo?.metaRobotsNoindex !== "noindex";
    });

    const urls = indexablePosts.map((post) => {
      const uri = post.uri!.startsWith("/")
        ? post.uri!
        : `/${post.uri}`;

      const loc = escapeXml(`${SITE_URL}${uri}`);
      const lastmod = post.modified
        ? `<lastmod>${escapeXml(post.modified.split("T")[0])}</lastmod>`
        : "";

      return `
  <url>
    <loc>${loc}</loc>
    ${lastmod}
  </url>`;
    }).join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Post sitemap generation failed:", error);

    return new Response("Unable to generate post sitemap", {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }
}
