import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export default function middleware(req: any) {
  const token = req.cookies.get("token")?.value;

  const publicPaths = ["/login", "/register", "/forgotPassword", "/resetPassword", "/verifySecurity"];

  // allow public pages
  if (publicPaths.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // DEBUG
  console.log("TOKEN:", token);

  // if no token, redirect
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    console.log("DECODED:", decoded);

    // role-based protection
    if (req.nextUrl.pathname.startsWith("/dashboard/admin")) {
      if (decoded.role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    return NextResponse.next();
  } catch (err) {
    console.log("JWT ERROR:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
  runtime: "nodejs", // Node runtime allows jwt.verify
};