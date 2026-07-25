const API_URL = "https://api.jcblautomoto.com/graphql";
const SITE_URL = "https://www.jcblautomoto.com";

type ProductCategory = {
  uri: string;
  name: string;
};

type GraphQLResponse = {
  data: {
    productCategories: {
      nodes: ProductCategory[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
    };
  };
  errors?: unknown;
};

async function getAllCategories() {
  const categories: ProductCategory[] = [];

  let hasNextPage = true;
  let after: string | null = null;

  while (hasNextPage) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query GetCategories($after: String) {
            productCategories(first: 100, after: $after) {
              nodes {
                name
                uri
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        `,
        variables: { after },
      }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`GraphQL request failed: ${res.status}`);
    }

    const json = (await res.json()) as GraphQLResponse;

    if (json.errors) {
      throw new Error(JSON.stringify(json.errors));
    }

    categories.push(...json.data.productCategories.nodes);

    hasNextPage = json.data.productCategories.pageInfo.hasNextPage;
    after = json.data.productCategories.pageInfo.endCursor;
  }

  return categories;
}

export async function GET() {
  const categories = await getAllCategories();

  // Remove duplicates if any
  const uniqueCategories = Array.from(
    new Map(categories.map((c) => [c.uri, c])).values()
  );

  const urls = uniqueCategories
    .filter((cat) => cat.uri)
    .map(
      (cat) => `
  <url>
    <loc>${SITE_URL}${cat.uri}</loc>
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