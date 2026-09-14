type WordPressRedirect = {
  url: string;
  actionCode: number;
  matchType: string;
  regex: boolean;
  target: string;
};

const WORDPRESS_REDIRECT_API =
  "https://jcblautomoto.com/wp-json/custom/v1/redirects";

export async function getWordPressRedirects(): Promise<
  WordPressRedirect[]
> {
  try {
    const response = await fetch(WORDPRESS_REDIRECT_API, {
      next: {
        revalidate: 60,
      },
    });

    if (!response.ok) {
      console.error(
        "Failed to load WordPress redirects:",
        response.status
      );

      return [];
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return [];
    }

    return data;
  } catch (error) {
    console.error("WordPress redirect fetch error:", error);

    return [];
  }
}