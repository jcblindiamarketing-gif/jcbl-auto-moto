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
cache: "no-store",
  });

  if (!res.ok) {
    return new Response("Failed to fetch pages", { status: 502 });
  }

  const { data, errors } = await res.json();

  if (errors || !data?.pages?.nodes) {
    return new Response("Failed to generate page sitemap", {
      status: 500,
    });
  }

  const excludedPaths = new Set([
    "/latin-tyre-auto-parts-expo-2024",
    "/latin-tyre-auto-parts-expo-2024-oold",
    "/home-tieng-viet",
    "/home-slovencina",
    "/home-romana",
    "/home-portugues",
    "/home-nederlands",
    "/home-àª—à«àªœàª°àª¾àª¤à«€",
    "/home-deutsch",
    "/enhome-afrikaans",
    "/home-italiano",
    "/home-espanol",
    "/home-francais",
    "/news-events",
    "/glimpses-of-automechanika-dubai-2023",
    "/thank-you",
    "/automechanika-ho-chi-minh-city-2023",
    "/job-openings",
    "/glimpses-of-automechanica-dubai2018",
    "/glimpses-of-automechanica-dubai-2019",
    "/glimpses-of-feria-internacional-bogota",
    "/glimpses-of-automec-brazil-2023",
    "/glimpses-of-automechanica-dubai-2022",
    "/catalogues",
    "/quality",
    "/shop",
  ]);

  const urls = data.pages.nodes
    .filter((page: any) => {
      if (!page.uri) return false;

      const path = decodeURI(page.uri).replace(/\/+$/, "");

      return !excludedPaths.has(path);
    })
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
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
