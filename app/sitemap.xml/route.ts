import { getYoastSitemap } from "@/lib/yoast";

export const revalidate = 3600;

const REMOVED_PRODUCT_SITEMAPS = new Set([
  "product-sitemap2.xml",
  "product-sitemap3.xml",
  "product-sitemap4.xml",
]);

export async function GET() {
  try {
    // Fetch the original Yoast sitemap index.
    const yoastXML = await getYoastSitemap("sitemap_index.xml");

    if (!/<sitemapindex\b/i.test(yoastXML)) {
      throw new Error("Invalid Yoast sitemap index");
    }

    // Remove separate product sitemap entries because
    // all four product sitemaps are combined into one route.
    const xml = yoastXML.replace(
      /<sitemap\b[\s\S]*?<\/sitemap>/gi,
      (entry) => {
        const loc = entry.match(
          /<loc>\s*([^<]+)\s*<\/loc>/i
        )?.[1]?.trim();

        if (!loc) {
          return entry;
        }

        const filename = loc
          .split("/")
          .pop()
          ?.split(/[?#]/)[0];

        return filename && REMOVED_PRODUCT_SITEMAPS.has(filename)
          ? ""
          : entry;
      }
    );

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control":
          "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      },
    });

  } catch (error) {
    console.error("Yoast sitemap index proxy failed:", error);

    return new Response(
      "Unable to fetch Yoast sitemap index",
      {
        status: 502,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
