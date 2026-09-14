import { NextRequest, NextResponse } from "next/server";
import { getWordPressRedirects } from "./wordpressRedirects";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  console.log("MIDDLEWARE HIT:", pathname);

  const redirects = await getWordPressRedirects();

  const matchedRedirect = redirects.find((redirect) => {
    const source = redirect.source.replace(/\/$/, "");
    const currentPath = pathname.replace(/\/$/, "");

    return source === currentPath;
  });

  console.log("MATCHED REDIRECT:", matchedRedirect);

  if (matchedRedirect) {
    const target = matchedRedirect.target;

    const destination = target.startsWith("http")
      ? target
      : `${request.nextUrl.origin}${target}`;

    console.log("REDIRECTING TO:", destination);

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