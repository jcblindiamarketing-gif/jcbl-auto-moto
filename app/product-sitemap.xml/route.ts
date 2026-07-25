const API_URL = "https://api.jcblautomoto.com/graphql";

async function getAllProducts() {
  const allProducts: any[] = [];

  let after: string | null = null;
  let hasNextPage = true;
  let previousCursor: string | null = null;

  while (hasNextPage) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 },
      body: JSON.stringify({
        query: `
          query GetProducts($after: String) {
            products(first: 100, after: $after) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                ... on Product {
                  uri
                  modified
                }
                ... on SimpleProduct {
                  uri
                  modified
                }
                ... on VariableProduct {
                  uri
                  modified
                }
                ... on ExternalProduct {
                  uri
                  modified
                }
                ... on GroupProduct {
                  uri
                  modified
                }
              }
            }
          }
        `,
        variables: { after },
      }),
    });

    const json = await res.json();

    if (json.errors) {
      console.error(json.errors);
      break;
    }

    const { nodes, pageInfo } = json.data.products;

    allProducts.push(...nodes);

    console.log("Fetched:", nodes.length);
    console.log("Total:", allProducts.length);
    console.log("hasNextPage:", pageInfo.hasNextPage);
    console.log("endCursor:", pageInfo.endCursor);

    // Stop if the cursor doesn't move forward
    if (pageInfo.endCursor === previousCursor) {
      console.warn("Cursor did not advance. Stopping pagination.");
      break;
    }

    previousCursor = pageInfo.endCursor;
    after = pageInfo.endCursor;
    hasNextPage = pageInfo.hasNextPage;
  }

  console.log("Final Product Count:", allProducts.length);

  return allProducts;
}