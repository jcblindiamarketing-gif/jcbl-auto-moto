
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const metadata = await generateSEOMetadata(
    `/blog/${slug}/`,
    "post"
  );

  if (slug === "ertiga-fuel-filter") {
    return {
      ...metadata,
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  return metadata;
}
