
const WP_GRAPHQL = "https://api.jcblautomoto.com/graphql";

export async function getProductSEO(slug: string) {
  const query = `
    query GetProductSEO($slug: ID!) {
      product(id: $slug, idType: SLUG) {
        seo {
          title
          metaDesc
          canonical
          metaRobotsNoindex
          metaRobotsNofollow
          opengraphTitle
          opengraphDescription
          opengraphImage {
            sourceUrl
          }
        }
      }
    }
  `;

  const res = await fetch(WP_GRAPHQL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 60 },
    body: JSON.stringify({
      query,
      variables: { slug },
    }),
  });

  if (!res.ok) {
    throw new Error(`Product SEO request failed: ${res.status}`);
  }

  const json = await res.json();

  if (json.errors?.length) {
    console.error("Product SEO GraphQL errors:", json.errors);
    throw new Error("Unable to fetch product Yoast SEO");
  }

  return json.data?.product?.seo ?? null;
}
