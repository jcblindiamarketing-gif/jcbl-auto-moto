import { getYoastSitemap } from "@/lib/yoast";

export const revalidate = 3600;

const PRODUCT_SITEMAPS = [
  "product-sitemap.xml",
  "product-sitemap2.xml",
  "product-sitemap3.xml",
  "product-sitemap4.xml",
];

function getNamespaces(xml: string): string[] {
  const root = xml.match(/<urlset\b([^>]*)>/i);

  if (!root) {
    throw new Error("Invalid product sitemap: urlset not found");
  }

  return (
    root[1].match(
      /\s+xmlns(?::[A-Za-z_][\w.-]*)?\s*=\s*("[^"]*"|'[^']*')/gi
    ) ?? []
  );
}

function getUrlEntries(xml: string): string[] {
  if (!/<\/urlset\s*>/i.test(xml)) {
    throw new Error("Invalid product sitemap closing tag");
  }

  return xml.match(/<url\b[\s\S]*?<\/url>/gi) ?? [];
}

export async function GET() {
  try {
    // Fetch all four Yoast product sitemaps.
    const sitemapXMLs = await Promise.all(
      PRODUCT_SITEMAPS.map((file) => getYoastSitemap(file))
    );

    // Collect all namespace declarations.
    const namespaces = [
      ...new Set(sitemapXMLs.flatMap(getNamespaces)),
    ];

    // Combine all product URL entries.
    const urlEntries = sitemapXMLs.flatMap(getUrlEntries);

    if (urlEntries.length === 0) {
      throw new Error("No product URLs found in Yoast sitemaps");
    }

    // A single sitemap must not exceed 50,000 URLs.
    if (urlEntries.length > 50000) {
      throw new Error("Combined product sitemap exceeds 50,000 URLs");
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset ${namespaces.join(" ")}>
${urlEntries.join("\n")}
</urlset>`;

    // A single sitemap must not exceed 50 MB uncompressed.
    const sizeInBytes = new TextEncoder().encode(xml).byteLength;

    if (sizeInBytes > 50 * 1024 * 1024) {
      throw new Error("Combined product sitemap exceeds 50 MB");
    }

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control":
          "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      },
    });

  } catch (error) {
    console.error("Combined product sitemap failed:", error);

    return new Response(
      "Unable to generate combined Yoast product sitemap",
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
