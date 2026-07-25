import { NextRequest, NextResponse } from "next/server";
// Import the correct name that matches auth-edge.ts
import { verifySession } from "@/lib/auth-edge"; 
import { SESSION_COOKIE } from "@/lib/auth-constants"; 

const PROTECTED = ["/onboarding", "/dashboard"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  
  // Call verifySession to match the imported function
  const session = token ? await verifySession(token) : null; 

  if (!session) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/onboarding/:path*", "/dashboard/:path*"],
};