
import type { Metadata } from "next";
import Home from "@/components/Home";
import { getCategories } from "@/lib/getCategories";
import { getYoastSEO } from "@/lib/yoast";

const FRONTEND_URL = "https://www.jcblautomoto.com";

export async function generateMetadata(): Promise<Metadata> {
  const fallbackCanonical = `${FRONTEND_URL}/`;

  try {
    const seo = await getYoastSEO("https://api.jcblautomoto.com/");

    if (!seo?.json) {
      return {
        title: "JCBL Auto Moto",
        description: "",
        alternates: {
          canonical: fallbackCanonical,
        },
      };
    }

    return {
      title: seo.json.title || "JCBL Auto Moto",
      description: seo.json.description || "",
      alternates: {
        canonical: fallbackCanonical,
      },
      robots: seo.json.robots,
      openGraph: {
        title: seo.json.og_title || seo.json.title,
        description:
          seo.json.og_description || seo.json.description,
        url: fallbackCanonical,
        siteName: seo.json.og_site_name || "JCBL Auto Moto",
        type: "website",
      },
      twitter: {
        card: seo.json.twitter_card || "summary_large_image",
      },
    };
  } catch (error) {
    console.error("Homepage SEO fetch failed:", error);

    return {
      title: "JCBL Auto Moto",
      description: "",
      alternates: {
        canonical: fallbackCanonical,
      },
    };
  }
}

export default async function Page() {
  const categories = await getCategories();

  return <Home categories={categories} />;
}
