
import { getYoastSEO } from "@/lib/yoast";

const WP_GRAPHQL = "https://api.jcblautomoto.com/graphql";
const WP_SITE_URL = "https://api.jcblautomoto.com";

type ProductSEOData = {
  title?: string | null;
  metaDesc?: string | null;
  canonical?: string | null;
  opengraphTitle?: string | null;
  opengraphDescription?: string | null;
  opengraphImage?: {
    sourceUrl?: string | null;
  } | null;
};

type ProductRecord = {
  description?: string | null;
  seo?: ProductSEOData | null;
};

type GraphQLResponse = {
  data?: {
    product?: ProductRecord | null;
  };
  errors?: Array<{ message?: string }>;
};

function getText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

// Convert product HTML description into plain text.
function cleanProductDescription(value: string | null | undefined): string {
  if (!value) return "";

  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Keep fallback meta descriptions within approximately 160 characters.
function createMetaDescription(value: string): string {
  if (!value) return "";

  if (value.length <= 160) {
    return value;
  }

  const preview = value.slice(0, 157);
  const lastSpace = preview.lastIndexOf(" ");

  const description =
    lastSpace > 120
      ? preview.slice(0, lastSpace)
      : preview;

  return `${description.trim()}...`;
}

export async function getProductSEO(slug: string) {
  if (!slug) return null;

  let product: ProductRecord | null = null;
  let graphqlSEO: ProductSEOData = {};

  // STEP 1: Fetch product SEO through WordPress GraphQL.
  try {
    const res = await fetch(WP_GRAPHQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60,
      },
      body: JSON.stringify({
        query: `
          query GetProductSEO($slug: ID!) {
            product(id: $slug, idType: SLUG) {
              description
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
        `,
        variables: {
          slug,
        },
      }),
    });

    const rawText = await res.text();

    if (!res.ok) {
      console.error(
        `Product SEO HTTP ${res.status}:`,
        rawText.slice(0, 500)
      );
    } else {
      try {
        const json = JSON.parse(rawText) as GraphQLResponse;

        if (json.errors?.length) {
          console.error("Product SEO GraphQL errors:", json.errors);
        }

        product = json.data?.product ?? null;
        graphqlSEO = product?.seo ?? {};
      } catch (error) {
        console.error("Product SEO JSON parsing failed:", error);
      }
    }
  } catch (error) {
    console.error(`Product SEO fetch failed for ${slug}:`, error);
  }

  // STEP 2: Use Yoast REST API if GraphQL meta description is empty.
  const graphqlDescription = getText(graphqlSEO.metaDesc);

  let yoastJson: {
    description?: unknown;
    og_description?: unknown;
  } | null = null;

  if (!graphqlDescription) {
    try {
      const productUrl =
        `${WP_SITE_URL}/product/${encodeURIComponent(slug)}/`;

      const restResponse = await getYoastSEO(productUrl);

      yoastJson = restResponse?.json ?? null;
    } catch (error) {
      console.error(
        `Product Yoast REST fallback failed for ${slug}:`,
        error
      );
    }
  }

  // STEP 3: Build fallback from the actual product description.
  const yoastDescription = getText(yoastJson?.description);

  const productDescription = createMetaDescription(
    cleanProductDescription(product?.description)
  );

  // Priority:
  // 1. GraphQL Yoast meta description
  // 2. Yoast REST API meta description
  // 3. Product description

  const metaDesc =
    graphqlDescription ||
    yoastDescription ||
    productDescription;

  if (!product && !metaDesc) {
    console.error(`No product SEO data found for: ${slug}`);
    return null;
  }

  return {
    ...graphqlSEO,

    metaDesc,

    opengraphDescription:
      getText(graphqlSEO.opengraphDescription) ||
      getText(yoastJson?.og_description) ||
      metaDesc,
  };
}
