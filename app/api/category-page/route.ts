import { NextRequest, NextResponse } from "next/server";

const GRAPHQL_API =
  "https://api.jcblautomoto.com/graphql";

const REQUEST_TIMEOUT = 15000;

export async function POST(request: NextRequest) {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT);

  try {
    const body = await request.json();

    const response = await fetch(GRAPHQL_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Cache-Control":
          "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    const isTimeout =
      error instanceof Error &&
      error.name === "AbortError";

    return NextResponse.json(
      {
        error: isTimeout
          ? "Category API request timed out"
          : "Unable to load category data",
      },
      {
        status: isTimeout ? 504 : 500,
      }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}