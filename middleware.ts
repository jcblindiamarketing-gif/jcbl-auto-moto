import { NextRequest, NextResponse } from "next/server";
import { getWordPressRedirects } from "./wordpressRedirects";

function normalizePath(path: string): string {
  if (!path || path === "/") {
    return "/";
  }

  return path.replace(/\/+$/, "");
}

export async function middleware(request: NextRequest) {
  const currentPath = normalizePath(
    request.nextUrl.pathname
  );

  const redirects = await getWordPressRedirects();

  const matchedRedirect = redirects.find((redirect) => {
    if (!redirect.url || !redirect.target) {
      return false;
    }

    const sourcePath = normalizePath(redirect.url);

    return sourcePath === currentPath;
  });

  if (!matchedRedirect) {
    return NextResponse.next();
  }

  const allowedStatusCodes = [301, 302, 307, 308];

  const statusCode = allowedStatusCodes.includes(
    matchedRedirect.actionCode
  )
    ? matchedRedirect.actionCode
    : 301;

  const destination = new URL(
    matchedRedirect.target,
    request.url
  );

  return NextResponse.redirect(
    destination,
    statusCode
  );
}

export const config = {
  matcher: [
    /*
     * Run middleware for website pages.
     * Skip API routes, Next.js files, and static files.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};