
const API_URL = "https://api.jcblautomoto.com/graphql";

export async function getCategorySEO(slug: string) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 60 },
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
  });

  if (!res.ok) {
    throw new Error(`Category SEO request failed: ${res.status}`);
  }

  const json = await res.json();

  if (json.errors?.length) {
    console.error("Category SEO GraphQL errors:", json.errors);
    throw new Error("Unable to fetch category Yoast SEO");
  }

  return json.data?.productCategories?.nodes?.[0]?.seo ?? null;
}
