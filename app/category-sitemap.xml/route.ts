import { getYoastSitemap } from "@/lib/yoast";

export const revalidate = 3600;

export async function GET() {
  try {
    const xml = await getYoastSitemap("category-sitemap.xml");

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control":
          "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Blog category sitemap proxy failed:", error);

    return new Response(
      "Unable to fetch Yoast blog category sitemap",
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
