import { NextRequest, NextResponse } from "next/server";
import { getWordPressRedirects } from "./wordpressRedirects";

function normalizePath(pathname: string): string {
  const cleanPath = pathname
    .split("?")[0]
    .split("#")[0]
    .trim();

  if (cleanPath === "/") {
    return "/";
  }

  return `/${cleanPath
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase()}`;
}

function isValidRedirectStatus(
  statusCode: unknown
): statusCode is 301 | 302 | 307 | 308 {
  return (
    statusCode === 301 ||
    statusCode === 302 ||
    statusCode === 307 ||
    statusCode === 308
  );
}

export async function proxy(request: NextRequest) {
  const pathname = normalizePath(
    request.nextUrl.pathname
  );

  console.log("========== PROXY ==========");
  console.log("REQUEST PATH:", pathname);

  if (
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const redirects = await getWordPressRedirects();

  console.log("REDIRECT COUNT:", redirects.length);

  const matchedRedirect = redirects.find((redirect) => {
    return (
      normalizePath(redirect.source) === pathname
    );
  });

  console.log(
    "MATCHED REDIRECT:",
    matchedRedirect
  );

  if (!matchedRedirect) {
    console.log("NO MATCH FOUND");

    return NextResponse.next();
  }

  /*
   * IMPORTANT:
   * Handle 410 before checking target.
   * A 410 rule does not need a target URL.
   */
  if (matchedRedirect.statusCode === 410) {
    console.log(
      `[410 GONE] ${pathname}`
    );

    return new NextResponse("Gone", {
      status: 410,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-store",
      },
    });
  }

  const target = matchedRedirect.target?.trim();

  if (!target) {
    console.log(
      `[Redirect] Empty target for ${pathname}`
    );

    return NextResponse.next();
  }

  let destination: URL;

  try {
    destination = new URL(
      target,
      request.nextUrl.origin
    );
  } catch {
    console.error(
      `[Redirect] Invalid target for ${pathname}:`,
      target
    );

    return NextResponse.next();
  }

  const statusCode = isValidRedirectStatus(
    matchedRedirect.statusCode
  )
    ? matchedRedirect.statusCode
    : 301;

  console.log(
    `[Redirect ${statusCode}] ${pathname} -> ${destination.href}`
  );

  return NextResponse.redirect(
    destination,
    statusCode
  );
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map)$).*)",
  ],
};