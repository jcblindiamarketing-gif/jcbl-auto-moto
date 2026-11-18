
import type { Metadata } from "next";
import Home from "@/components/Home";
import { getCategories } from "@/lib/getCategories";
import { cleanWpmString } from "@/lib/metadata";
import {
  getYoastSEO,
  getYoastRobots,
} from "@/lib/yoast";

const FRONTEND_URL = "https://www.jcblautomoto.com";

export async function generateMetadata(): Promise<Metadata> {
  const fallbackCanonical = `${FRONTEND_URL}/`;

  // Get homepage robots directives from custom WordPress API.
  const robots = await getYoastRobots("home");

  try {
    const seo = await getYoastSEO(
      "https://api.jcblautomoto.com/"
    );

    if (!seo?.json) {
      return {
        title: "JCBL Auto Moto",
        description: "",
        alternates: {
          canonical: fallbackCanonical,
        },
        robots,
      };
    }

    // Clean WP Multilang markers from homepage SEO metadata.
    const title =
      cleanWpmString(seo.json.title) || "JCBL Auto Moto";

    const description =
      cleanWpmString(seo.json.description);

    const ogTitle =
      cleanWpmString(seo.json.og_title) || title;

    const ogDescription =
      cleanWpmString(seo.json.og_description) || description;

    return {
      title,
      description,

      alternates: {
        canonical: fallbackCanonical,
      },

      // Robots directives controlled by Yoast Advanced.
      robots,

      openGraph: {
        title: ogTitle,
        description: ogDescription,

        url: fallbackCanonical,

        siteName:
          cleanWpmString(seo.json.og_site_name) ||
          "JCBL Auto Moto",

        type: "website",
      },

      twitter: {
        card:
          seo.json.twitter_card ||
          "summary_large_image",
      },
    };

  } catch (error) {
    console.error(
      "Homepage SEO fetch failed:",
      error
    );

    return {
      title: "JCBL Auto Moto",
      description: "",
      alternates: {
        canonical: fallbackCanonical,
      },
      robots,
    };
  }
}

export default async function Page() {
  const categories = await getCategories();

  return <Home categories={categories} />;
}
