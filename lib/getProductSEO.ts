const WP_GRAPHQL = "https://api.jcblautomoto.com/graphql";

export async function getProductSEO(slug: string) {
  const query = `
    query GetProductSEO($slug: ID!) {
      product(id: $slug, idType: SLUG) {
        seo {
          title
          metaDesc
          canonical
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
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 },
    body: JSON.stringify({
      query,
      variables: { slug },
    }),
  });

  const json = await res.json();

  return json?.data?.product?.seo ?? null;
}