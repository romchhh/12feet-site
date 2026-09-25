import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api") || pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  const segment = pathname.split("/").filter(Boolean)[0];
  if (segment && !isLocale(segment)) {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  const response = NextResponse.next();
  if (segment && isLocale(segment)) {
    response.headers.set("x-locale", segment);
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
