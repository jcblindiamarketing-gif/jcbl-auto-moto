import About from "@/components/About";
import { generateSEOMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return generateSEOMetadata("about-us");
}

export default function Page() {
  return <About />;
}