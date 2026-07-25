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
          pages(first: 1000) {
            nodes {
              uri
              modified
            }
          }
        }
      `,
    }),
    next: { revalidate: 3600 },
  });

  const { data } = await res.json();

  const urls = data.pages.nodes
    .filter((page: any) => page.uri)
    .map(
      (page: any) => `
  <url>
    <loc>${SITE_URL}${page.uri}</loc>
   <lastmod>${page.modified.split("T")[0]}</lastmod>
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