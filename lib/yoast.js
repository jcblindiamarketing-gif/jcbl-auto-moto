const WP_URL = "https://api.jcblautomoto.com";
const FRONTEND_URL = "https://www.jcblautomoto.com";

const DEFAULT_ROBOTS = {
  index: true,
  follow: true,
};

const ALLOWED_ROBOTS_TYPES = [
  "home",
  "page",
  "post",
  "product",
  "product_cat",
];
const ALLOWED_SITEMAPS = [
  "sitemap_index.xml",
  "post-sitemap.xml",
  "page-sitemap.xml",
  "product-sitemap.xml",
  "product-sitemap2.xml",
  "product-sitemap3.xml",
  "product-sitemap4.xml",
  "category-sitemap.xml",
  "product_cat-sitemap.xml",
];
/**
 * Fetch complete SEO metadata from Yoast SEO API.
 */
export async function getYoastSEO(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const endpoint =
      `${WP_URL}/wp-json/yoast/v1/get_head?url=${encodeURIComponent(url)}`;

    const res = await fetch(endpoint, {
      signal: controller.signal,
      next: {
        revalidate: 60,
      },
    });

    const contentType = res.headers.get("content-type") || "";
    const text = await res.text();

    if (!res.ok) {
      console.error(
        `Yoast API returned HTTP ${res.status}:`,
        text.slice(0, 500)
      );

      return null;
    }

    if (!contentType.toLowerCase().includes("application/json")) {
      console.error(
        "Yoast API returned non-JSON content:",
        contentType,
        text.slice(0, 500)
      );

      return null;
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      console.error("Yoast API JSON parse failed:", error);
      return null;
    }
  } catch (error) {
    console.error("Yoast SEO fetch failed:", error);

    return null;
  } finally {
    clearTimeout(timeout);
  }
}


/**
 * Fetch individual page robots directives
 * from the custom WordPress REST API.
 */
export async function getYoastRobots(type, slug) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    if (!ALLOWED_ROBOTS_TYPES.includes(type)) {
      throw new Error(`Invalid robots content type: ${type}`);
    }

    if (type !== "home" && !slug) {
      throw new Error(`Missing slug for robots type: ${type}`);
    }

    const params = new URLSearchParams({
      type,
    });

    if (slug) {
      params.set("slug", slug);
    }

    const endpoint =
      `${WP_URL}/wp-json/jcbl/v1/robots?${params.toString()}`;

    const response = await fetch(endpoint, {
      signal: controller.signal,
      next: {
        revalidate: 60,
      },
    });

    const contentType =
      response.headers.get("content-type") || "";

    const text = await response.text();

    if (!response.ok) {
      throw new Error(
        `Robots API returned HTTP ${response.status}: ${text.slice(0, 300)}`
      );
    }

    if (!contentType.toLowerCase().includes("application/json")) {
      throw new Error(
        `Robots API returned non-JSON content: ${contentType}`
      );
    }

    let data;

    try {
      data = JSON.parse(text);
    } catch (error) {
      throw new Error(
        `Robots API returned invalid JSON: ${error.message}`
      );
    }

    if (
      data?.type !== type ||
      !["index", "noindex"].includes(data?.robots?.index) ||
      !["follow", "nofollow"].includes(data?.robots?.follow)
    ) {
      throw new Error("Invalid robots API response");
    }

    return {
      index: data.robots.index === "index",
      follow: data.robots.follow === "follow",
    };
  } catch (error) {
    console.error(
      `Yoast robots fetch failed for ${type}/${slug || ""}:`,
      error
    );

    return {
      ...DEFAULT_ROBOTS,
    };
  } finally {
    clearTimeout(timeout);
  }
}
export async function getYoastSitemap(sitemapFile) {
  if (!ALLOWED_SITEMAPS.includes(sitemapFile)) {
    throw new Error(`Invalid sitemap file: ${sitemapFile}`);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(`${WP_URL}/${sitemapFile}`, {
      signal: controller.signal,
      headers: {
        Accept: "application/xml, text/xml",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Yoast sitemap HTTP ${response.status}`);
    }

    let xml = await response.text();

    if (
      /<html[\s>]/i.test(xml) ||
      /<!doctype html/i.test(xml) ||
      !/<(urlset|sitemapindex)\b/i.test(xml)
    ) {
      throw new Error("Invalid Yoast sitemap XML");
    }

    xml = xml.replace(
      /https?:\/\/api\.jcblautomoto\.com/gi,
      FRONTEND_URL
    );

    xml = xml.replace(
      /<\?xml-stylesheet\b[\s\S]*?\?>\s*/i,
      ""
    );

    xml = xml.replace(
      /<url\b[\s\S]*?<\/url>/gi,
      (urlEntry) => {
        const loc = urlEntry.match(
          /<loc>\s*([^<]+)\s*<\/loc>/i
        )?.[1]?.trim();

        if (!loc) {
          return urlEntry;
        }

        return urlEntry.replace(
          /<xhtml:link\b[^>]*\/\s*>/gi,
          (link) => {
            const href = link.match(
              /\bhref=(["'])(.*?)\1/i
            )?.[2]?.trim();

            const hreflang = link.match(
              /\bhreflang=(["'])(.*?)\1/i
            )?.[2]?.trim()
              .toLowerCase();

            return href === loc && hreflang === "en-us"
              ? ""
              : link;
          }
        );
      }
    );

    if (!/<xhtml:link\b/i.test(xml)) {
      xml = xml.replace(
        /\s+xmlns:xhtml=(["'])http:\/\/www\.w3\.org\/1999\/xhtml\1/i,
        ""
      );

      xml = xml.replace(
        /\s*http:\/\/www\.w3\.org\/1999\/xhtml\s+http:\/\/www\.w3\.org\/2002\/08\/xhtml\/xhtml1-strict\.xsd/i,
        ""
      );
    }

    return xml;
  } catch (error) {
    console.error(
      `Yoast sitemap failed for ${sitemapFile}:`,
      error
    );

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}