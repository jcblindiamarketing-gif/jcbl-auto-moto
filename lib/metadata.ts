
import type { Metadata } from "next";
import { getPageSEO } from "@/lib/getPageSEO";
import { getProductSEO } from "@/lib/getProductSEO";
import { getCategorySEO } from "@/lib/getCategorySEO";
import { getPostSEO } from "@/lib/getPostSEO";

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
    console.error(`SEO fetch failed for ${type}: ${uri}`, error);
  }

  const path =
    fallbackPath ??
    (uri.startsWith("/") ? uri : `/${uri}`);

  const canonical = getFrontendCanonical(
    seo?.canonical,
    path
  );

  const noindex = seo?.metaRobotsNoindex === "noindex";
  const nofollow = seo?.metaRobotsNofollow === "nofollow";

  return {
    title: seo?.title || "JCBL Auto Moto",
    description: seo?.metaDesc || "",

    robots: {
      index: !noindex,
      follow: !nofollow,
    },

    alternates: {
      canonical,
    },

    openGraph: {
      title: seo?.opengraphTitle || seo?.title || "JCBL Auto Moto",
      description:
        seo?.opengraphDescription || seo?.metaDesc || "",
      url: canonical,
      siteName: "JCBL Auto Moto",
      type: type === "post" ? "article" : "website",
      images: seo?.opengraphImage?.sourceUrl
        ? [seo.opengraphImage.sourceUrl]
        : [],
    },
  };
}
