import { NextResponse } from "next/server";

const WORDPRESS_GRAPHQL_URL =
  "https://api.jcblautomoto.com/graphql";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const wordpressResponse = await fetch(WORDPRESS_GRAPHQL_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const responseText = await wordpressResponse.text();

    return new NextResponse(responseText, {
      status: wordpressResponse.status,
      headers: {
        "Content-Type":
          wordpressResponse.headers.get("content-type") ||
          "application/json",
      },
    });
  } catch (error) {
    console.error("WordPress GraphQL proxy error:", error);

    return NextResponse.json(
      {
        errors: [
          {
            message: "WordPress GraphQL API connection failed",
          },
        ],
      },
      {
        status: 502,
      }
    );
  }
}