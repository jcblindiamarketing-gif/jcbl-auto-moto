
const API_URL = "https://api.jcblautomoto.com/graphql";

const EMPTY_SEO = {
  title: "",
  metaDesc: "",
  canonical: "",
  metaRobotsNoindex: "index",
  metaRobotsNofollow: "follow",
  opengraphTitle: "",
  opengraphDescription: "",
  opengraphImage: "",
};

type SEOData = typeof EMPTY_SEO;

async function safeJsonResponse(
  response: Response,
  label = "GraphQL SEO request"
): Promise<any | null> {
  const rawText = await response.text();
  const text = rawText.trim();

  if (!response.ok || !text || text.startsWith("<")) {
    console.error(`${label} failed:`, response.status, text.slice(0, 500));
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error(`${label} JSON parse failed:`, error);
    return null;
  }
}

export async function getPageSEO(uri: string): Promise<SEOData> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
      body: JSON.stringify({
        query: `
          query GetPageSEO($uri: ID!) {
            page(id: $uri, idType: URI) {
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
        `,
        variables: { uri },
      }),
    });

    const json = await safeJsonResponse(response, `Page SEO ${uri}`);

    if (json?.errors?.length) {
      console.error("Page SEO GraphQL errors:", json.errors);
      return EMPTY_SEO;
    }

    const seo = json?.data?.page?.seo;

    if (!seo) return EMPTY_SEO;

    return {
      title: seo.title || "",
      metaDesc: seo.metaDesc || "",
      canonical: seo.canonical || "",
      metaRobotsNoindex: seo.metaRobotsNoindex ?? "index",
      metaRobotsNofollow: seo.metaRobotsNofollow ?? "follow",
      opengraphTitle: seo.opengraphTitle || "",
      opengraphDescription: seo.opengraphDescription || "",
      opengraphImage: seo.opengraphImage?.sourceUrl || "",
    };
  } catch (error) {
    console.error(`getPageSEO failed for ${uri}:`, error);
    return EMPTY_SEO;
  }
}
