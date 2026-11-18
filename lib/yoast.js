const WP_URL = "https://api.jcblautomoto.com";

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

    if (!res.ok) {
      console.error(
        `Yoast API returned ${res.status} ${res.statusText}`
      );

      return null;
    }

    return await res.json();

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
 *
 * Yoast Advanced settings control:
 * - index / noindex
 * - follow / nofollow
 *
 * Default behaviour:
 * - index: true
 * - follow: true
 */
export async function getYoastRobots(type, slug) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {

    // Validate content type.
    if (!ALLOWED_ROBOTS_TYPES.includes(type)) {
      throw new Error(`Invalid robots content type: ${type}`);
    }

    // Slug is required for all types except homepage.
    if (type !== "home" && !slug) {
      throw new Error(`Missing slug for robots type: ${type}`);
    }

    // Build API query parameters.
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

    if (!response.ok) {
      throw new Error(
        `Robots API returned HTTP ${response.status}`
      );
    }

    const data = await response.json();

    // Validate API response.
    if (
      data?.type !== type ||
      !["index", "noindex"].includes(data?.robots?.index) ||
      !["follow", "nofollow"].includes(data?.robots?.follow)
    ) {
      throw new Error("Invalid robots API response");
    }

    // Convert Yoast directives into Next.js boolean values.
    return {
      index: data.robots.index === "index",
      follow: data.robots.follow === "follow",
    };

  } catch (error) {
    console.error(
      `Yoast robots fetch failed for ${type}/${slug || ""}:`,
      error
    );

    // Default behaviour if the API is unavailable.
    return {
      ...DEFAULT_ROBOTS,
    };

  } finally {
    clearTimeout(timeout);
  }
}
