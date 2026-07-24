const WP_GRAPHQL = "https://api.jcblautomoto.com/graphql";

export async function getPageSEO(uri: string) {
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

  const json = await res.json();

  return json?.data?.page?.seo ?? null;
}