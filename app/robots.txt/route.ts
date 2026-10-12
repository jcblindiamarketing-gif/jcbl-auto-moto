
const WORDPRESS_ROBOTS_URL =
  "https://api.jcblautomoto.com/robots.txt";

const FRONTEND_URL = "https://www.jcblautomoto.com";
const FRONTEND_SITEMAP = `${FRONTEND_URL}/sitemap.xml`;

export const revalidate = 60;

export async function GET() {
  try {
    const response = await fetch(WORDPRESS_ROBOTS_URL, {
      headers: {
        Accept: "text/plain",
      },
      next: {
        revalidate: 60,
      },
    });

    if (!response.ok) {
      throw new Error(
        `WordPress robots.txt returned ${response.status}`
      );
    }

    let robotsText = await response.text();

    // Prevent returning an error page as robots.txt.
    if (
      /<html[\s>]/i.test(robotsText) ||
      /<!doctype html/i.test(robotsText)
    ) {
      throw new Error(
        "WordPress returned HTML instead of robots.txt"
      );
    }

    // Keep Yoast's rules, but publish the frontend sitemap.
    robotsText = robotsText
      .split(/\r?\n/)
      .filter(
        (line) =>
          !/^\s*Sitemap\s*:/i.test(line) &&
          !/^\s*Host\s*:/i.test(line)
      )
      .join("\n")
      .trim();

    const output = [
      robotsText,
      "",
      `Sitemap: ${FRONTEND_SITEMAP}`,
      "",
    ]
      .filter((part, index) => index !== 0 || part !== "")
      .join("\n");

    return new Response(output, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control":
          "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Failed to fetch WordPress robots.txt:", error);

    // Safe fallback if WordPress is temporarily unavailable.
    return new Response(
      [
        "User-Agent: *",
        "Allow: /",
        "Disallow: /api/",
        "",
        `Sitemap: ${FRONTEND_SITEMAP}`,
        "",
      ].join("\n"),
      {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
