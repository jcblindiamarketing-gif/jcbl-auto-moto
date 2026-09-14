type WordPressRedirect = {
  source: string;
  target: string;
  statusCode: number;
  matchType: string;
  regex: boolean;
};

type WordPressRedirectResponse = {
  success: boolean;
  count: number;
  redirects: WordPressRedirect[];
};

const WORDPRESS_REDIRECT_API =
  "https://api.jcblautomoto.com/wp-json/headless/v1/redirects";

export async function getWordPressRedirects(): Promise<
  WordPressRedirect[]
> {
  console.log("CALLING WORDPRESS API:", WORDPRESS_REDIRECT_API);

  try {
    const response = await fetch(WORDPRESS_REDIRECT_API, {
      cache: "no-store",
    });

    console.log("WORDPRESS API STATUS:", response.status);

    if (!response.ok) {
      const errorText = await response.text();

      console.error("WORDPRESS API ERROR:", errorText);

      return [];
    }

    const data =
      (await response.json()) as WordPressRedirectResponse;

    console.log("WORDPRESS API DATA:", data);

    if (!data.success || !Array.isArray(data.redirects)) {
      return [];
    }

    return data.redirects;
  } catch (error) {
    console.error("WORDPRESS REDIRECT FETCH ERROR:", error);

    return [];
  }
}