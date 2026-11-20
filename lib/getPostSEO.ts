
const WP_GRAPHQL = "https://api.jcblautomoto.com/graphql";

const query = `
query GetPostSEO($slug: ID!) {
  post(id: $slug, idType: SLUG) {
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
`;

export async function getPostSEO(slug: string) {
  const res = await fetch(WP_GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 },
    body: JSON.stringify({
      query,
      variables: { slug },
    }),
  });

  const json = await res.json();
  return json.data?.post?.seo ?? null;
}
