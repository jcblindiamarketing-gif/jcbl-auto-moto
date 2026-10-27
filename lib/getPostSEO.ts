
const WP_GRAPHQL = "https://api.jcblautomoto.com/graphql";

const query = `
  query GetPostSEO($slug: ID!) {
    post(id: $slug, idType: SLUG) {
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
  const slug = uri.split("/").filter(Boolean).pop();

  if (!slug) {
    throw new Error(`Invalid post URI: ${uri}`);
  }

  const res = await fetch(WP_GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      query,
      variables: { slug },
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

  const post = json.data?.post;

  if (!post) {
    throw new Error(`WordPress post not found for slug: ${slug}`);
  }

  if (!post.seo) {
    throw new Error(`Yoast SEO data missing for post: ${slug}`);
  }

  return post.seo;
}
