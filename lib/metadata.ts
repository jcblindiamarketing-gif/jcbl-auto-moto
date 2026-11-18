import type { Metadata } from "next";
import { getPageSEO } from "@/lib/getPageSEO";
import { getProductSEO } from "@/lib/getProductSEO";
import { getCategorySEO } from "@/lib/getCategorySEO";
import { getPostSEO } from "@/lib/getPostSEO";
import { getYoastRobots } from "@/lib/yoast";

const WORDPRESS_URL = "https://api.jcblautomoto.com";
const FRONTEND_URL = "https://www.jcblautomoto.com";

type SEOType = "page" | "product" | "category" | "post";

function getFrontendCanonical(
  canonical: string | undefined,
  fallbackPath: string
): string {
  try {
    const url = canonical
      ? new URL(canonical, FRONTEND_URL)
      : new URL(fallbackPath, FRONTEND_URL);

    // Keep canonical URLs on the public frontend domain.
    if (url.origin === WORDPRESS_URL) {
      url.hostname = new URL(FRONTEND_URL).hostname;
    }

    url.protocol = "https:";
    url.hostname = new URL(FRONTEND_URL).hostname;
    url.port = "";
    url.search = "";
    url.hash = "";

    return url.toString();
  } catch {
    return new URL(fallbackPath, FRONTEND_URL).toString();
  }
}

export async function generateSEOMetadata(
  uri: string,
  type: SEOType = "page",
  fallbackPath?: string
): Promise<Metadata> {
  let seo = null;

  // Fetch existing SEO metadata.
  try {
    switch (type) {
      case "product":
        seo = await getProductSEO(uri);
        break;

      case "category":
        seo = await getCategorySEO(uri);
        break;

      case "post":
        seo = await getPostSEO(uri);
        break;

      default:
        seo = await getPageSEO(uri);
    }
  } catch (error) {
    console.error(
      `SEO fetch failed for ${type}: ${uri}`,
      error
    );
  }

  // Generate frontend canonical path.
  const path =
    fallbackPath ??
    (uri.startsWith("/") ? uri : `/${uri}`);

  const canonical = getFrontendCanonical(
    seo?.canonical,
    path
  );

  // Map Next.js category type to WordPress taxonomy type.
  const robotsType =
    type === "category" ? "product_cat" : type;

  // Extract the WordPress content slug.
  const robotsSlug = uri
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean)
    .pop();

  // Fetch robots directives from the custom WordPress API.
  const robots = await getYoastRobots(
    robotsType,
    robotsSlug
  );

  return {
    title: seo?.title || "JCBL Auto Moto",

    description: seo?.metaDesc || "",

    alternates: {
      canonical,
    },

    // Dynamic robots directives from Yoast Advanced settings.
    robots,

    openGraph: {
      title:
        seo?.opengraphTitle ||
        seo?.title ||
        "JCBL Auto Moto",

      description:
        seo?.opengraphDescription ||
        seo?.metaDesc ||
        "",

      url: canonical,

      siteName: "JCBL Auto Moto",

      type: type === "post" ? "article" : "website",

      images: seo?.opengraphImage?.sourceUrl
        ? [seo.opengraphImage.sourceUrl]
        : [],
    },
  };
}
