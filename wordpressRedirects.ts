type WordPressRedirect = {
  source: string;
  target: string;
  statusCode: number;
  matchType: string;
  regex: boolean;
};

const WORDPRESS_REDIRECT_API =
  "https://api.jcblautomoto.com/wp-json/headless/v1/redirects";

export async function getWordPressRedirects(): Promise<
  WordPressRedirect[]
> {
  try {
    console.log("CALLING WORDPRESS API:", WORDPRESS_REDIRECT_API);

    const response = await fetch(WORDPRESS_REDIRECT_API, {
      cache: "no-store",
    });

    const text = await response.text();

    console.log("WORDPRESS API STATUS:", response.status);
    console.log("WORDPRESS API RESPONSE:", text.slice(0, 500));

    if (!response.ok) {
      console.error("WordPress redirect API failed:", response.status);
      return [];
    }

    const data = JSON.parse(text);

    if (!Array.isArray(data.redirects)) {
      console.error("Invalid redirect API format:", data);
      return [];
    }

    console.log("REDIRECT COUNT:", data.redirects.length);
    console.log("REDIRECT DATA:", data.redirects);

    return data.redirects;
  } catch (error) {
    console.error("WordPress redirect fetch error:", error);
    return [];
  }
}