
const API_URL = "https://api.jcblautomoto.com/graphql";
const SITE_URL = "https://www.jcblautomoto.com";

async function getAllPosts() {
  const allPosts: any[] = [];

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
      throw new Error(
        `WordPress GraphQL request failed: ${res.status}`
      );
    }

    const json = await res.json();

    if (json.errors?.length) {
      console.error("Sitemap GraphQL errors:", json.errors);
      throw new Error("Could not fetch Yoast SEO data for sitemap");
    }

    const nodes = json?.data?.posts?.nodes ?? [];
    const pageInfo = json?.data?.posts?.pageInfo;

    if (!pageInfo) {
      throw new Error("Sitemap pagination data is missing");
    }

    allPosts.push(...nodes);

    hasNextPage = pageInfo.hasNextPage;
    after = pageInfo.endCursor;

    if (hasNextPage && !after) {
      throw new Error("Sitemap pagination cursor is missing");
    }
  }

  return allPosts;
}

function escapeXml(value: string) {
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

      const robots = post.seo?.metaRobotsNoindex;

      // Exclude posts explicitly marked noindex in Yoast.
      return robots !== "noindex";
    });

    const urls = indexablePosts
      .map((post) => {
        const loc = escapeXml(`${SITE_URL}${post.uri}`);
        const lastmod = post.modified
          ? `<lastmod>${escapeXml(post.modified.split("T")[0])}</lastmod>`
          : "";

        return `
  <url>
    <loc>${loc}</loc>
    ${lastmod}
  </url>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Post sitemap generation failed:", error);

    return new Response("Unable to generate sitemap", {
      status: 500,
    });
  }
}
