
export async function getYoastSitemap(sitemapFile) {
  if (!ALLOWED_SITEMAPS.includes(sitemapFile)) {
    throw new Error(`Invalid sitemap file: ${sitemapFile}`);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(
      `${WP_URL}/${sitemapFile}`,
      {
        signal: controller.signal,
        headers: {
          Accept: "application/xml, text/xml",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`Yoast sitemap HTTP ${response.status}`);
    }

    let xml = await response.text();

    // Validate XML response.
    if (
      /<html[\s>]/i.test(xml) ||
      /<!doctype html/i.test(xml) ||
      !/<(urlset|sitemapindex)\b/i.test(xml)
    ) {
      throw new Error("Invalid Yoast sitemap XML");
    }

    // Rewrite WordPress URLs to frontend domain.
    xml = xml.replace(
      /https?:\/\/api\.jcblautomoto\.com/gi,
      FRONTEND_URL
    );

    // Restore Yoast's original XSL stylesheet
    // using a same-origin frontend URL.
    const stylesheet =
      '<?xml-stylesheet type="text/xsl" href="/wp-content/plugins/wordpress-seo/css/main-sitemap.xsl"?>';

    if (/<\?xml-stylesheet\b[\s\S]*?\?>/i.test(xml)) {
      xml = xml.replace(
        /<\?xml-stylesheet\b[\s\S]*?\?>/i,
        stylesheet
      );
    } else {
      xml = xml.replace(
        /(<\?xml[^?]*\?>)/i,
        `$1\n${stylesheet}`
      );
    }

    // Preserve all original Yoast URL, image and hreflang data.
    return xml;

  } catch (error) {
    console.error(
      `Yoast sitemap failed for ${sitemapFile}:`,
      error
    );

    throw error;

  } finally {
    clearTimeout(timeout);
  }
}
