const WP_GRAPHQL = "https://api.jcblautomoto.com/graphql";

const EMPTY_SEO = {
  title: "",
  metaDesc: "",
  canonical: "",
  metaRobotsNoindex: "index",
  metaRobotsNofollow: "follow",
  opengraphTitle: "",
  opengraphDescription: "",
  opengraphImage: null as { sourceUrl?: string } | null,
};

export async function getProductSEO(slug: string) {
  try {
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
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
      body: JSON.stringify({
        query,
        variables: { slug },
      }),
    });

    if (!res.ok) {
      console.error(`Product SEO request failed: HTTP ${res.status}`);
      return EMPTY_SEO;
    }

    const json = await res.json();

    if (json?.errors?.length) {
      console.error("Product SEO GraphQL errors:", json.errors);
      return EMPTY_SEO;
    }

    const seo = json?.data?.product?.seo;

    if (!seo) {
      return EMPTY_SEO;
    }

    return {
      ...EMPTY_SEO,
      ...seo,
      metaRobotsNoindex: seo.metaRobotsNoindex || "index",
      metaRobotsNofollow: seo.metaRobotsNofollow || "follow",
      opengraphImage: seo.opengraphImage ?? null,
    };
  } catch (error) {
    console.error(`getProductSEO failed for ${slug}:`, error);
    return EMPTY_SEO;
  }
}