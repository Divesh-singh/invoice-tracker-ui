import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token");

  // Allow access to login page without token
  if (req.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // If no token → force redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Run middleware on ALL routes EXCEPT static files
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)"
  ],
};
