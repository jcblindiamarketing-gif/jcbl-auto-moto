
const WP_GRAPHQL = "https://api.jcblautomoto.com/graphql";

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

  if (!res.ok) {
    throw new Error(`Post SEO request failed: ${res.status}`);
  }

  const json = await res.json();

  if (json.errors?.length) {
    console.error("Post SEO GraphQL errors:", json.errors);
    throw new Error("Unable to fetch Yoast post SEO data");
  }

  return json.data?.post?.seo ?? null;
}
