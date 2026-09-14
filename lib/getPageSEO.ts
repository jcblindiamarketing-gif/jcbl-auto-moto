const WP_GRAPHQL = "https://api.jcblautomoto.com/graphql";

type PageSEO = {
  title?: string | null;
  metaDesc?: string | null;
  canonical?: string | null;
  opengraphTitle?: string | null;
  opengraphDescription?: string | null;
  opengraphImage?: {
    sourceUrl?: string | null;
  } | null;
};

type GraphQLResponse = {
  data?: {
    page?: {
      seo?: PageSEO | null;
    } | null;
  };
  errors?: unknown;
};

export async function getPageSEO(
  uri: string
): Promise<PageSEO | null> {
  console.log("SEO URI:", uri);

  const query = `
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
  `;

  try {
    const response = await fetch(WP_GRAPHQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      next: {
        revalidate: 60,
      },
      body: JSON.stringify({
        query,
        variables: {
          uri,
        },
      }),
    });

    const responseText = await response.text();

    // Handles 409, 403, 500, and other failed responses safely.
    if (!response.ok) {
      console.error(
        `GraphQL request failed: ${response.status}`,
        responseText.slice(0, 300)
      );

      return null;
    }

    // Prevents "Unexpected token '<'" when the server returns HTML.
    const contentType = response.headers.get("content-type") ?? "";

    if (
      !contentType.toLowerCase().includes("application/json") ||
      responseText.trim().startsWith("<")
    ) {
      console.error(
        "GraphQL returned a non-JSON response:",
        responseText.slice(0, 300)
      );

      return null;
    }

    let result: GraphQLResponse;

    try {
      result = JSON.parse(responseText) as GraphQLResponse;
    } catch (error) {
      console.error("GraphQL JSON parsing failed:", error);
      return null;
    }

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return null;
    }

    return result.data?.page?.seo ?? null;
  } catch (error) {
    console.error("getPageSEO failed:", error);
    return null;
  }
}