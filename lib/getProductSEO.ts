
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
  shortDescription?: string | null;
  seo?: ProductSEOData | null;
  metaData?: Array<{
    key?: string | null;
    value?: string | null;
  }> | null;
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

// Extract English content from WPML/Polylang language strings.
function getLocalizedText(value: unknown): string {
  const raw = getText(value);

  if (!raw) return "";

  const englishMatch = raw.match(
    /\[:en\]([\s\S]*?)(?=\[:[a-z]{2}(?:_[A-Z]{2})?\]|\[:\]|$)/i
  );

  if (englishMatch && englishMatch[1].trim()) {
    return englishMatch[1].trim();
  }

  return raw
    .replace(/\[:[a-z]{2}(?:_[A-Z]{2})?\]|\[:\]/gi, "")
    .trim();
}

// Remove HTML and convert product content into plain text.
function cleanProductDescription(value: string | null | undefined): string {
  const text = getLocalizedText(value);

  if (!text) return "";

  return text
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

// Limit generated fallback descriptions to approximately 160 characters.
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

  // STEP 1: Fetch product data and Yoast SEO fields.
  try {
    const response = await fetch(WP_GRAPHQL, {
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

              ... on SimpleProduct {
                shortDescription

                metaData {
                  key
                  value
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

    const rawText = await response.text();

    if (!response.ok) {
      console.error(
        `Product SEO HTTP ${response.status}:`,
        rawText.slice(0, 500)
      );
    } else {
      try {
        const json = JSON.parse(rawText) as GraphQLResponse;

        if (json.errors?.length) {
          console.error(
            "Product SEO GraphQL errors:",
            json.errors
          );
        }

        product = json.data?.product ?? null;
        graphqlSEO = product?.seo ?? {};
      } catch (error) {
        console.error("Product SEO JSON parsing failed:", error);
      }
    }
  } catch (error) {
    console.error(
      `Product SEO fetch failed for ${slug}:`,
      error
    );
  }

  // STEP 2: Get the manually saved Yoast meta description.
  const graphqlDescription = getLocalizedText(
    graphqlSEO.metaDesc
  );

  // STEP 3: Fetch Yoast REST API description if necessary.
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

  const yoastDescription = getLocalizedText(
    yoastJson?.description
  );

  // STEP 4: Extract actual product content.
  // This is the same custom field used by ProductDetail.jsx.
  const customDescription = product?.metaData?.find(
    (item) => item.key === "_wpt_field_description"
  )?.value;

  const productCustomDescription = createMetaDescription(
    cleanProductDescription(customDescription)
  );

  const productShortDescription = createMetaDescription(
    cleanProductDescription(product?.shortDescription)
  );

  const productDescription = createMetaDescription(
    cleanProductDescription(product?.description)
  );

  // STEP 5: Final meta description priority.
  const metaDesc =
    graphqlDescription ||
    yoastDescription ||
    productCustomDescription ||
    productShortDescription ||
    productDescription;

  if (!product && !metaDesc) {
    console.error(
      `No product SEO data found for: ${slug}`
    );

    return null;
  }

  return {
    ...graphqlSEO,

    metaDesc,

    opengraphDescription:
      getLocalizedText(graphqlSEO.opengraphDescription) ||
      getLocalizedText(yoastJson?.og_description) ||
      metaDesc,
  };
}
