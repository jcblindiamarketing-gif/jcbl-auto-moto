import Home from "@/components/Home";
import { getCategories } from "@/lib/getCategories";
import { getYoastSEO } from "@/lib/yoast";

export async function generateMetadata() {
  // 👇 Replace with your actual frontend URL
  const seo = await getYoastSEO("https://jcblautomoto.com");

  if (!seo) {
    return {
      title: "JCBL Auto Moto",
      description: "",
    };
  }

  return {
    title: seo.json.title,
    description: seo.json.description,

    alternates: {
      canonical: seo.json.canonical,
    },

    robots: seo.json.robots,

    openGraph: {
      title: seo.json.og_title,
      description: seo.json.og_description,
      siteName: seo.json.og_site_name,
    },

    twitter: {
      card: seo.json.twitter_card,
    },
  };
}

export default async function Page() {
  const categories = await getCategories();

  return <Home categories={categories} />;
}