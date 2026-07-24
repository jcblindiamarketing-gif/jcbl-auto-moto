const WP_URL = "https://api.jcblautomoto.com";

export async function getYoastSEO(url) {
  const res = await fetch(
    `${WP_URL}/wp-json/yoast/v1/get_head?url=${encodeURIComponent(url)}`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) return null;

  return await res.json();
}