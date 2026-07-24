import Contact from "@/components/Contact";
import { generateSEOMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return generateSEOMetadata("contact-us");
}

export default function Page() {
  return <Contact />;
}