import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NEXTAUTH_URL?.startsWith("https://") ?? false,
    });

    const protectedPaths = ["/gerenciar-equipes", "/admin", "/profile"];
    const isProtected = protectedPaths.some(path => 
      request.nextUrl.pathname.startsWith(path)
    );

    if (isProtected && !token) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isProtected && token && !token.accessToken) {
      const loginUrl = new URL("/auth/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();

  } catch (error) {
    const protectedPaths = ["/gerenciar-equipes", "/admin", "/profile"];
    const isProtected = protectedPaths.some(path => 
      request.nextUrl.pathname.startsWith(path)
    );
    
    if (isProtected) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};