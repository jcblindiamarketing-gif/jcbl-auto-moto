const API_URL = "https://api.jcblautomoto.com/graphql";

export async function getCategories() {
  let allCategories = [];
  let hasNextPage = true;
  let after = null;

  while (hasNextPage) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query ($after: String) {
            productCategories(
              first: 100
              after: $after
              where: { hideEmpty: false }
            ) {
              nodes {
                id
                name
                slug
                description
                image {
                  sourceUrl
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        `,
        variables: {
          after,
        },
      }),
      next: {
        revalidate: 3600,
      },
    });

    const json = await res.json();

    const data = json?.data?.productCategories;

    allCategories = [
      ...allCategories,
      ...(data?.nodes || []),
    ];

    hasNextPage = data?.pageInfo?.hasNextPage;
    after = data?.pageInfo?.endCursor;
  }

  console.log(
    "TOTAL CATEGORIES:",
    allCategories.length
  );

  return allCategories;
}