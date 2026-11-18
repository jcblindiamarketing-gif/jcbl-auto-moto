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
 * Fetch Yoast SEO metadata.
 */
export async function getYoastSEO(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const endpoint =
      `${WP_URL}/wp-json/yoast/v1/get_head?url=${encodeURIComponent(url)}`;

    const response = await fetch(endpoint, {
      signal: controller.signal,
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error(`Yoast API returned HTTP ${response.status}`);
      return null;
    }

    return await response.json();

  } catch (error) {
    console.error("Yoast SEO fetch failed:", error);
    return null;

  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Fetch individual page robots directives.
 */
export async function getYoastRobots(type, slug) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    if (!ALLOWED_ROBOTS_TYPES.includes(type)) {
      throw new Error(`Invalid robots type: ${type}`);
    }

    if (type !== "home" && !slug) {
      throw new Error(`Missing slug for ${type}`);
    }

    const params = new URLSearchParams({ type });

    if (slug) {
      params.set("slug", slug);
    }

    const endpoint =
      `${WP_URL}/wp-json/jcbl/v1/robots?${params.toString()}`;

    const response = await fetch(endpoint, {
      signal: controller.signal,
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Robots API HTTP ${response.status}`);
    }

    const data = await response.json();

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

    return { ...DEFAULT_ROBOTS };

  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Fetch Yoast XML sitemap and rewrite
 * WordPress URLs to frontend URLs.
 */
export async function getYoastSitemap(sitemapFile) {
  if (!ALLOWED_SITEMAPS.includes(sitemapFile)) {
    throw new Error(`Invalid sitemap file: ${sitemapFile}`);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(
      `${WP_URL}/${sitemapFile}`,
      {
        signal: controller.signal,
        headers: {
          Accept: "application/xml, text/xml",
        },
        next: { revalidate: 3600 },
      }
    );

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

// Rewrite WordPress URLs to the frontend domain.
xml = xml.replace(
  /https?:\/\/api\.jcblautomoto\.com/gi,
  FRONTEND_URL
);

// Remove Yoast's external XSL stylesheet reference.
// The XML sitemap does not require this stylesheet for search engines.
xml = xml.replace(
  /<\?xml-stylesheet\b[\s\S]*?\?>\s*/i,
  ""
);

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
