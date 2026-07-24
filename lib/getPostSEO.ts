const WP_GRAPHQL = "https://api.jcblautomoto.com/graphql";

const query = `
query GetPostSEO($uri: ID!) {
  post(id: $uri, idType: URI) {
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

export async function getPostSEO(uri: string) {
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
  return json.data?.post?.seo ?? null;
}