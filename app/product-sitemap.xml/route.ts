const API_URL = "https://api.jcblautomoto.com/graphql";
const SITE_URL = "https://www.jcblautomoto.com";

export async function GET() {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
      query {
  products(first: 1000) {
    nodes {
      ... on Product {
        uri
        modified
      }
      ... on VariableProduct {
        uri
        modified
      }
      ... on SimpleProduct {
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
    }),
    next: { revalidate: 3600 },
  });

 const result = await res.json();

console.log(JSON.stringify(result, null, 2));

const { data } = result;

  const urls = data.products.nodes
    .filter((product: any) => product.uri)
    .map(
      (product: any) => `
  <url>
    <loc>${SITE_URL}${product.uri}</loc>
    <lastmod>${product.modified}</lastmod>
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