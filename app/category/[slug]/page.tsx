import CategoryPage from "../../components/CategoryPage";

// This is a Server Component
export default async function CategoryPageWrapper({ params }) {
  // In Next.js 15+, params is a Promise
  const { slug } = await params;
  
  // Pass the slug to the client component
  // If slug is undefined or empty, pass null to show all categories
  return <CategoryPage slug={slug || null} />;
}

// Generate static paths for better performance (optional)
export async function generateStaticParams() {
  // If you want to pre-render specific category pages
  // You can fetch all category slugs from your API
  // For now, we'll return an empty array to handle all at runtime
  return [];
}