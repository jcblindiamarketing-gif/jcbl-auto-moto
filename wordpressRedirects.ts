export type WordPressRedirect = {
  source: string;
  target: string;
  statusCode?: number;
  matchType?: string;
  regex?: boolean;
};

type WordPressRedirectResponse = {
  redirects: WordPressRedirect[];
};

const WORDPRESS_REDIRECT_API =
  "https://api.jcblautomoto.com/wp-json/headless/v1/redirects";

export async function getWordPressRedirects(): Promise<
  WordPressRedirect[]
> {
  try {
    console.log(
      "CALLING WORDPRESS API:",
      WORDPRESS_REDIRECT_API
    );

    const response = await fetch(WORDPRESS_REDIRECT_API, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const contentType =
      response.headers.get("content-type") || "";

    const text = await response.text();

    console.log(
      "WORDPRESS API STATUS:",
      response.status
    );

    console.log(
      "WORDPRESS API CONTENT-TYPE:",
      contentType
    );

    console.log(
      "WORDPRESS API RESPONSE:",
      text.slice(0, 500)
    );

    if (!response.ok) {
      console.error(
        "WordPress redirect API failed:",
        response.status
      );

      return [];
    }

    if (
      !contentType
        .toLowerCase()
        .includes("application/json")
    ) {
      console.error(
        "WordPress redirect API returned non-JSON content:",
        contentType
      );

      return [];
    }

    let data: unknown;

    try {
      data = JSON.parse(text);
    } catch (error) {
      console.error(
        "WordPress redirect API returned invalid JSON:",
        error
      );

      return [];
    }

    if (
      !data ||
      typeof data !== "object" ||
      !("redirects" in data) ||
      !Array.isArray(data.redirects)
    ) {
      console.error(
        "Invalid redirect API format:",
        data
      );

      return [];
    }

    const apiData =
      data as WordPressRedirectResponse;

    const validRedirects = apiData.redirects.filter(
      (redirect) => {
        return (
          redirect &&
          typeof redirect.source === "string" &&
          typeof redirect.target === "string" &&
          redirect.source.trim() !== "" &&
          redirect.target.trim() !== ""
        );
      }
    );

    console.log(
      "REDIRECT COUNT:",
      validRedirects.length
    );

    console.log(
      "REDIRECT DATA:",
      validRedirects
    );

    return validRedirects;
  } catch (error) {
    console.error(
      "WordPress redirect fetch error:",
      error
    );

    return [];
  }
}