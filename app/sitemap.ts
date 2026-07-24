import { MetadataRoute } from "next";

const API_URL = "https://api.jcblautomoto.com/graphql";
const SITE_URL = "https://www.jcblautomoto.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
     query Sitemap {
  pages(first: 1000) {
    nodes {
      uri
      modified
    }
  }

  products(first: 1000) {
    nodes {
      slug
    }
  }

  productCategories(first: 1000) {
    nodes {
      slug
    }
  }
}
      `,
    }),
    next: { revalidate: 3600 },
  });

const json = await res.json();

console.log(JSON.stringify(json, null, 2));

if (json.errors) {
  throw new Error(JSON.stringify(json.errors, null, 2));
}
console.log(JSON.stringify(json, null, 2));

const pageUrls = (json.data.pages?.nodes ?? [])
  .filter((page: any) => page.uri)
  .map((page: any) => ({
    url: `${SITE_URL}${page.uri}`,
    lastModified: page.modified,
    changeFrequency: "weekly" as const,
    priority: page.uri === "/" ? 1 : 0.8,
  }));

const productUrls = (json.data.products?.nodes ?? []).map((product: any) => ({
  url: `${SITE_URL}/product/${product.slug}`,
  lastModified: new Date(),
  changeFrequency: "weekly" as const,
  priority: 0.9,
}));

const categoryUrls = (json.data.productCategories?.nodes ?? []).map(
  (category: any) => ({
    url: `${SITE_URL}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  })
);

return [...pageUrls, ...productUrls, ...categoryUrls];}