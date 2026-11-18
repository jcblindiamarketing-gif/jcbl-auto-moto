import BlogList from "@/components/BlogList";
import { getYoastRobots } from "@/lib/yoast";

export async function generateMetadata() {
  const robots = await getYoastRobots("page", "blog");

  return {
    robots,
  };
}

export default function BlogPage() {
  return <BlogList />;
}
