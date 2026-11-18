const API_URL = "https://api.jcblautomoto.com/graphql";

export async function getCategorySEO(slug: string) {
  console.log("getCategorySEO called with:", slug);

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
      next: { revalidate: 3600 },
    });

    const contentType =
      res.headers.get("content-type") || "";

    const text = await res.text();

    if (!res.ok) {
      console.error(
        `Category SEO HTTP ${res.status}:`,
        text.slice(0, 500)
      );
      return null;
    }

    if (!contentType.toLowerCase().includes("application/json")) {
      console.error(
        "Category SEO returned non-JSON content:",
        contentType,
        text.slice(0, 500)
      );
      return null;
    }

    let json;

    try {
      json = JSON.parse(text);
    } catch (error) {
      console.error(
        "Category SEO JSON parse failed:",
        error
      );
      return null;
    }

    console.log(
      "Category SEO Response:",
      JSON.stringify(json, null, 2)
    );

    return (
      json?.data?.productCategories?.nodes?.[0]?.seo ??
      null
    );
  } catch (error) {
    console.error(
      `getCategorySEO failed for ${slug}:`,
      error
    );

    return null;
  }
}