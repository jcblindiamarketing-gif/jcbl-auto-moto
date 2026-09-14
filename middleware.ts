import { NextRequest, NextResponse } from "next/server";
import { getWordPressRedirects } from "./wordpressRedirects";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  console.log("MIDDLEWARE HIT:", pathname);

  const redirects = await getWordPressRedirects();

  console.log("REDIRECT COUNT:", redirects.length);

  const redirect = redirects.find((item) => {
    return item.source === pathname;
  });

  console.log("MATCHED REDIRECT:", redirect);

  if (!redirect) {
    return NextResponse.next();
  }

  console.log("REDIRECTING TO:", redirect.target);

  const destination = new URL(
    redirect.target,
    request.url
  );

  return NextResponse.redirect(
    destination,
    redirect.statusCode === 302 ? 302 : 301
  );
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};