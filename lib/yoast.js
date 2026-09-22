
const WP_URL = "https://api.jcblautomoto.com";

export async function getYoastSEO(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const endpoint = `${WP_URL}/wp-json/yoast/v1/get_head?url=${encodeURIComponent(url)}`;

    const res = await fetch(endpoint, {
      signal: controller.signal,
      next: { revalidate: 60 },
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

