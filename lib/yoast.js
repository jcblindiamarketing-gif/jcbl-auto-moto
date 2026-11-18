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