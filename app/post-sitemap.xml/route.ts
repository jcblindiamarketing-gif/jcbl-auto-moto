const API_URL = "https://api.jcblautomoto.com/graphql";
const SITE_URL = "https://www.jcblautomoto.com";

async function getAllPosts() {
  const allPosts: any[] = [];

  let after: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
   const res: Response = await fetch(API_URL, {
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
              }
            }
          }
        `,
        variables: {
          after,
        },
      }),
    });

   const json: any = await res.json();

    if (json.errors) {
      console.error(json.errors);
      break;
    }

  const nodes: any[] = json.data.posts.nodes;
const pageInfo: {
  hasNextPage: boolean;
  endCursor: string | null;
} = json.data.posts.pageInfo;
    allPosts.push(...nodes);

    console.log(
      `Fetched ${nodes.length}, Total: ${allPosts.length}`
    );

    hasNextPage = pageInfo.hasNextPage;
    after = pageInfo.endCursor;

    // Safety check
    if (hasNextPage && !after) {
      console.warn("Pagination stopped because endCursor is null.");
      break;
    }
  }

  return allPosts;
}

export async function GET() {
  const posts = await getAllPosts();

  const urls = posts
    .filter((post) => post.uri)
    .map(
      (post) => `
  <url>
    <loc>${SITE_URL}${post.uri}</loc>
    <lastmod>${post.modified}</lastmod>
  </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}