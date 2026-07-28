import Home from "@/components/Home";
import { getCategories } from "@/lib/getCategories";
import { getYoastSEO } from "@/lib/yoast";

export async function generateMetadata() {
  // Fetch homepage SEO from the WordPress site URL
  const seo = await getYoastSEO("https://api.jcblautomoto.com/");

  if (!seo || !seo.json) {
    return {
      title: "JCBL Auto Moto",
      description: "",
    };
  }

  return {
    title: seo.json.title,
    description: seo.json.description,

    alternates: {
      canonical: "https://www.jcblautomoto.com/",
    },

    robots: seo.json.robots,

    openGraph: {
      title: seo.json.og_title,
      description: seo.json.og_description,
      url: "https://www.jcblautomoto.com/",
      siteName: seo.json.og_site_name,
      type: "website",
    },

    twitter: {
      card: seo.json.twitter_card || "summary_large_image",
    },
  };
}

export default async function Page() {
  const categories = await getCategories();

  return <Home categories={categories} />;
}