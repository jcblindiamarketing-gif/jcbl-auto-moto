import CategoryPage from "../../../components/CategoryPage.jsx";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPageWrapper({ params }: PageProps) {
  const { slug } = await params;
  return <CategoryPage slug={slug || null} />;
}

export async function generateStaticParams() {
  return [];
}