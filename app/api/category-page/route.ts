    import { NextRequest, NextResponse } from "next/server";

    const GRAPHQL_API = "https://api.jcblautomoto.com/graphql";
    const REQUEST_TIMEOUT = 15000;

    export async function POST(request: NextRequest): Promise<Response> {
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
        cache: "no-store",
        });

        const text = await response.text();

        if (!response.ok) {
        console.error(
            "GraphQL request failed:",
            response.status,
            text.slice(0, 300)
        );

        return NextResponse.json(
            {
            error: "GraphQL request failed",
            status: response.status,
            },
            {
            status: response.status,
            }
        );
        }

        let data: unknown;

        try {
        data = JSON.parse(text);
        } catch {
        console.error(
            "GraphQL returned non-JSON:",
            text.slice(0, 300)
        );

        return NextResponse.json(
            {
            error: "GraphQL returned an invalid response",
            },
            {
            status: 502,
            }
        );
        }

        return NextResponse.json(data, {
        status: 200,
        headers: {
            "Cache-Control":
            "public, s-maxage=300, stale-while-revalidate=600",
        },
        });
    } catch (error) {
        const isTimeout =
        error instanceof Error && error.name === "AbortError";

        console.error("Category API error:", error);

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