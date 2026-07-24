const API_URL = "https://api.jcblautomoto.com/graphql";

export async function getCategorySEO(slug: string) {
  console.log("getCategorySEO called with:", slug);

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

  const json = await res.json();

  console.log(
    "Category SEO Response:",
    JSON.stringify(json, null, 2)
  );

  return json?.data?.productCategories?.nodes?.[0]?.seo ?? null;
}