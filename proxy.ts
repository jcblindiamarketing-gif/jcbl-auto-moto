
import { NextRequest, NextResponse } from "next/server";
import { getWordPressRedirects } from "./wordpressRedirects";

function normalizePath(pathname: string): string {
  let cleanPath = pathname.split("?")[0].split("#")[0].trim();

  try {
    cleanPath = decodeURIComponent(cleanPath);
  } catch {
    // Keep the original path if decoding fails.
  }

  if (cleanPath === "/") {
    return "/";
  }

  return `/${cleanPath.replace(/^\/+|\/+$/g, "").toLowerCase()}`;
}

// These legacy URLs should be removed from search indexing.
const noindexPaths = new Set(
  [
    "/latin-tyre-auto-parts-expo-2024",
    "/latin-tyre-auto-parts-expo-2024-oold",
    "/home-tieng-viet",
    "/home-slovencina",
    "/home-romana",
    "/home-portugues",
    "/home-nederlands",
    "/home-ગુજરાતી",
    "/home-deutsch",
    "/enhome-afrikaans",
    "/home-italiano",
    "/home-espanol",
    "/home-francais",
    "/glimpses-of-automechanika-dubai-2023",
    "/thank-you",
    "/automechanika-ho-chi-minh-city-2023",
    "/job-openings",
    "/glimpses-of-automechanica-dubai2018",
    "/glimpses-of-automechanica-dubai-2019",
    "/glimpses-of-feria-internacional-bogota",
    "/glimpses-of-automec-brazil-2023",
    "/glimpses-of-automechanica-dubai-2022",
    "/catalogues",
    "/quality",
    "/product/flat-tubular-battery",
    "/product/tall-tubular-battery",
    "/product/gel-battery",
    "/product/maintenance-free-type-battery",
    "/product/dry-charge-battery",
    "/product/tricycle-battery",
    "/product/jcbl-india-inverter-battery",
    "/product/solar-tubular-battery",
    "/product/jcbl-india-automotive-battery",
    "/product/jcbl-india-motorcycle-battery",
    "/shop",
      "/category/batteries/tall-tubular-battery",
    "/product/jis-type-2",
    "/category/motorcycle-helmets",
  ].map(normalizePath)
);

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
  const pathname = normalizePath(request.nextUrl.pathname);

  console.log("========== PROXY ==========");
  console.log("REQUEST PATH:", pathname);

  if (
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Permanently removed legacy URLs: do not redirect these elsewhere.
  if (noindexPaths.has(pathname)) {
    console.log(`[LEGACY NOINDEX / 410] ${pathname}`);

    return new NextResponse("Gone", {
      status: 410,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, follow",
      },
    });
  }

  const redirects = await getWordPressRedirects();

  console.log("REDIRECT COUNT:", redirects.length);

  const matchedRedirect = redirects.find((redirect) => {
    return normalizePath(redirect.source) === pathname;
  });

  console.log("MATCHED REDIRECT:", matchedRedirect);


  // Handle existing WordPress redirects first.
  if (matchedRedirect) {
    if (matchedRedirect.statusCode === 410) {
      console.log(`[410 GONE] ${pathname}`);

      return new NextResponse("Gone", {
        status: 410,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Robots-Tag": "noindex, follow",
        },
      });
    }

    const target = matchedRedirect.target?.trim();

    if (target) {
      try {
        const destination = new URL(
          target,
          request.nextUrl.origin
        );

        const statusCode = isValidRedirectStatus(
          matchedRedirect.statusCode
        )
          ? matchedRedirect.statusCode
          : 301;

        console.log(
          `[Redirect ${statusCode}] ${pathname} -> ${destination.href}`
        );

        return NextResponse.redirect(destination, statusCode);
      } catch {
        console.error(
          `[Redirect] Invalid target for ${pathname}:`,
          target
        );
      }
    }
  }

  // Enforce trailing slash for website page URLs.
  const originalPathname = request.nextUrl.pathname;

  const canonicalPath = originalPathname.replace(/\/+$/, "");

  const lastSegment =
    canonicalPath.split("/").pop() || "";

  // Do not modify file URLs such as XML, TXT, PDF or images.
  const isFileUrl = /\.[a-z0-9]{1,10}$/i.test(lastSegment);

  if (
    canonicalPath &&
    !isFileUrl &&
    originalPathname !== `${canonicalPath}/`
  ) {
    const destination = request.nextUrl.clone();

    destination.pathname = `${canonicalPath}/`;

    console.log(
      `[Trailing Slash 308] ${originalPathname} -> ${destination.pathname}`
    );

    return NextResponse.redirect(destination, 308);
  }

  console.log("NO REDIRECT REQUIRED");

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map)$).*)",
  ],
};
