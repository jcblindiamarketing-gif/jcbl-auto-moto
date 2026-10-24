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

export async function getPostSEO(uri: string) {
  try {
    const query = `
      query GetPostSEO($uri: ID!) {
        post(id: $uri, idType: URI) {
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
        variables: { uri },
      }),
    });

    if (!res.ok) {
      console.error(`Post SEO request failed: HTTP ${res.status}`);
      return EMPTY_SEO;
    }

    const json = await res.json();

    if (json?.errors?.length) {
      console.error("Post SEO GraphQL errors:", json.errors);
      return EMPTY_SEO;
    }

    const seo = json?.data?.post?.seo;

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
    console.error(`getPostSEO failed for ${uri}:`, error);
    return EMPTY_SEO;
  }
}