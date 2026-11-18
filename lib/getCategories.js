const API_URL = "https://api.jcblautomoto.com/graphql";

export async function getCategories() {
  let allCategories = [];
  let hasNextPage = true;
  let after = null;

  while (hasNextPage) {
    try {
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

      const contentType =
        res.headers.get("content-type") || "";

      const text = await res.text();

      if (!res.ok) {
        console.error(
          `Categories API HTTP ${res.status}:`,
          text.slice(0, 500)
        );
        break;
      }

      if (
        !contentType
          .toLowerCase()
          .includes("application/json")
      ) {
        console.error(
          "Categories API returned non-JSON content:",
          contentType,
          text.slice(0, 500)
        );
        break;
      }

      let json;

      try {
        json = JSON.parse(text);
      } catch (error) {
        console.error(
          "Categories API JSON parse failed:",
          error
        );
        break;
      }

      const data = json?.data?.productCategories;

      allCategories = [
        ...allCategories,
        ...(data?.nodes || []),
      ];

      hasNextPage = data?.pageInfo?.hasNextPage ?? false;
      after = data?.pageInfo?.endCursor ?? null;
    } catch (error) {
      console.error(
        "getCategories failed:",
        error
      );

      break;
    }
  }

  console.log(
    "TOTAL CATEGORIES:",
    allCategories.length
  );

  return allCategories;
}