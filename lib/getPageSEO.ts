const API_URL = "https://api.jcblautomoto.com/graphql";

const EMPTY_SEO = {
  title: "",
  metaDesc: "",
  canonical: "",
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

  if (!response.ok) {
    console.error(
      `${label} HTTP ${response.status}:`,
      text.slice(0, 500)
    );
    return null;
  }

  if (!text || text.startsWith("<")) {
    console.error(
      `${label} returned HTML/non-JSON:`,
      text.slice(0, 500)
    );
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
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60,
      },
      body: JSON.stringify({
        query: `
          query GetPageSEO($uri: ID!) {
            page(id: $uri, idType: URI) {
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
        `,
        variables: {
          uri,
        },
      }),
    });

    const json = await safeJsonResponse(response, `SEO ${uri}`);
    const seo = json?.data?.page?.seo;

    if (!seo) {
      return EMPTY_SEO;
    }

    return {
      title: seo.title || "",
      metaDesc: seo.metaDesc || "",
      canonical: seo.canonical || "",
      opengraphTitle: seo.opengraphTitle || "",
      opengraphDescription: seo.opengraphDescription || "",
      opengraphImage: seo.opengraphImage?.sourceUrl || "",
    };
  } catch (error) {
    console.error(`getPageSEO failed for ${uri}:`, error);
    return EMPTY_SEO;
  }
}