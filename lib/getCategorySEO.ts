const API_URL = "https://api.jcblautomoto.com/graphql";

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

export async function getCategorySEO(slug: string) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query GetCategorySEO($slug: String!) {
            productCategories(where: { slug: [$slug] }) {
              nodes {
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
          }
        `,
        variables: { slug },
      }),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(
        `Category SEO request failed: HTTP ${res.status}`
      );
      return EMPTY_SEO;
    }

    const json = await res.json();

    if (json?.errors?.length) {
      console.error("Category SEO GraphQL errors:", json.errors);
      return EMPTY_SEO;
    }

    const seo = json?.data?.productCategories?.nodes?.[0]?.seo;

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
    console.error(`getCategorySEO failed for ${slug}:`, error);
    return EMPTY_SEO;
  }
}