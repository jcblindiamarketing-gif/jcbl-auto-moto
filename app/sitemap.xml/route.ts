const SITE_URL = "https://www.jcblautomoto.com";

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <sitemap>
    <loc>${SITE_URL}/page-sitemap.xml</loc>
  </sitemap>

  <sitemap>
    <loc>${SITE_URL}/post-sitemap.xml</loc>
  </sitemap>

  <sitemap>
    <loc>${SITE_URL}/category-sitemap.xml</loc>
  </sitemap>

  <sitemap>
    <loc>${SITE_URL}/product-sitemap.xml</loc>
  </sitemap>

  <sitemap>
    <loc>${SITE_URL}/product_cat-sitemap.xml</loc>
  </sitemap>

</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}