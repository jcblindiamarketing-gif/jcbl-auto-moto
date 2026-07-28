import { getPageSEO } from "@/lib/getPageSEO";
import { getProductSEO } from "@/lib/getProductSEO";
import { getCategorySEO } from "@/lib/getCategorySEO";
import { getPostSEO } from "@/lib/getPostSEO";

const WORDPRESS_URL = "https://api.jcblautomoto.com";
const FRONTEND_URL = "https://www.jcblautomoto.com";

export async function generateSEOMetadata(
  uri: string,
  type: "page" | "product" | "category" | "post" = "page"
) {
  let seo;

  switch (type) {
    case "product":
      seo = await getProductSEO(uri);
      break;

    case "category":
      seo = await getCategorySEO(uri);
      break;

    case "post":
      console.log("Fetching post SEO:", uri);
      seo = await getPostSEO(uri);
      console.log("SEO result:", seo);
      break;

    default:
      seo = await getPageSEO(uri);
      break;
  }

  console.log("Canonical from WP:", seo?.canonical);

  if (!seo) {
    return {
      title: "JCBL Auto Moto",
      description: "",
    };
  }

  const canonical = seo.canonical
    ? seo.canonical.replace(WORDPRESS_URL, FRONTEND_URL)
    : undefined;

  return {
    title: seo.title,
    description: seo.metaDesc,

    alternates: {
      canonical,
    },

    openGraph: {
      title: seo.opengraphTitle,
      description: seo.opengraphDescription,
      images: seo.opengraphImage?.sourceUrl
        ? [seo.opengraphImage.sourceUrl]
        : [],
    },
  };
}