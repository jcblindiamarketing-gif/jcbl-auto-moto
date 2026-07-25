const API_URL = "https://api.jcblautomoto.com/graphql";
const SITE_URL = "https://www.jcblautomoto.com";

type ProductNode = {
  uri: string;
  modified: string;
};

type ProductsResponse = {
  data: {
    products: {
      nodes: ProductNode[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
    };
  };
  errors?: unknown;
};

async function getAllProducts(): Promise<ProductNode[]> {
  const allProducts: ProductNode[] = [];

  let after: string | null = null;
  let hasNextPage = true;
  let previousCursor: string | null = null;

  while (hasNextPage) {
    const response: Response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 },
      body: JSON.stringify({
        query: `
          query GetProducts($after: String) {
            products(first: 100, after: $after) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                ... on Product {
                  uri
                  modified
                }
                ... on SimpleProduct {
                  uri
                  modified
                }
                ... on VariableProduct {
                  uri
                  modified
                }
                ... on ExternalProduct {
                  uri
                  modified
                }
                ... on GroupProduct {
                  uri
                  modified
                }
              }
            }
          }
        `,
        variables: { after },
      }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.status}`);
    }

    const result = (await response.json()) as ProductsResponse;

    if (result.errors) {
      console.error(result.errors);
      break;
    }

    const nodes = result.data.products.nodes;
    const pageInfo = result.data.products.pageInfo;

    allProducts.push(...nodes);

    if (pageInfo.endCursor === previousCursor) {
      console.warn("Cursor did not advance. Stopping pagination.");
      break;
    }

    previousCursor = pageInfo.endCursor;
    after = pageInfo.endCursor;
    hasNextPage = pageInfo.hasNextPage;
  }

  return allProducts;
}

export async function GET() {
  try {
    const products = await getAllProducts();

    const urls = products
      .map(
        (product) => `
  <url>
    <loc>${SITE_URL}${product.uri}</loc>
   <lastmod>${product.modified.split("T")[0]}</lastmod>
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
  } catch (error) {
    console.error(error);

    return new Response("Failed to generate sitemap", {
      status: 500,
    });
  }
}