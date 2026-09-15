import { NextRequest, NextResponse } from "next/server";
import { getWordPressRedirects } from "./wordpressRedirects";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Do not run redirect lookup for normal category/page navigation
  if (
    pathname.startsWith("/category/") ||
    pathname.startsWith("/product/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const redirects = await getWordPressRedirects();

  const currentPath = pathname.replace(/\/$/, "");

  const matchedRedirect = redirects.find((redirect) => {
    const source = redirect.source.replace(/\/$/, "");
    return source === currentPath;
  });

  if (matchedRedirect) {
    const target = matchedRedirect.target;

    const destination = target.startsWith("http")
      ? target
      : `${request.nextUrl.origin}${target}`;

    return NextResponse.redirect(
      new URL(destination),
      matchedRedirect.statusCode || 301
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};