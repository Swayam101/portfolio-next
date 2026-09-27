import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const acceptHeader = request.headers.get("accept") || "";
  const wantsMarkdown = acceptHeader.toLowerCase().includes("text/markdown");
  const pathname = request.nextUrl.pathname;

  // Handle root content negotiation: serve llms.txt when Accept: text/markdown is present
  if (wantsMarkdown && (pathname === "/" || pathname === "")) {
    const rewriteUrl = new URL("/llms.txt", request.url);
    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set("Vary", "Accept");
    response.headers.set("Content-Type", "text/markdown; charset=utf-8");
    response.headers.set(
      "Link",
      '</llms.txt>; rel="alternate"; type="text/markdown"'
    );
    return response;
  }

  // SEO Safeguard: Ensure raw bot-context files are not indexed in search engine SERPs
  // as duplicate content, while pointing their canonical link back to the homepage.
  if (pathname === "/llms.txt" || pathname === "/llms-full.txt") {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, follow");
    response.headers.set("Link", '<https://www.swayam.cyou/>; rel="canonical"');
    return response;
  }

  // Handle direct .md requests
  if (pathname === "/index.md") {
    const rewriteUrl = new URL("/index.md", request.url);
    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set("Content-Type", "text/markdown; charset=utf-8");
    response.headers.set("Vary", "Accept");
    response.headers.set("X-Robots-Tag", "noindex, follow");
    response.headers.set("Link", '<https://www.swayam.cyou/>; rel="canonical"');
    return response;
  }

  // Normal request pass-through with Vary: Accept and Link header for agent discovery
  const response = NextResponse.next();
  response.headers.set("Vary", "Accept");
  response.headers.set(
    "Link",
    '</llms.txt>; rel="alternate"; type="text/markdown"'
  );
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all page paths except API routes, static assets, and media files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf)).*)",
  ],
};
