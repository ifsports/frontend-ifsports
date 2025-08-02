import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

interface UserToken {
  accessToken?: string;
  id?: string;
  email?: string;
  name?: string;
  campus?: string;
  role?: string;
}

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NEXTAUTH_URL?.startsWith("https://") ?? false,
    }) as UserToken | null;

    const pathname = request.nextUrl.pathname;

    if (!token) {
      const isProtectedRoute = pathname.startsWith("/organizador") ||
                              pathname.startsWith("/gerenciar-equipes") ||
                              pathname.startsWith("/registrar-equipe");
      
      if (isProtectedRoute) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.next();
    }

    if (!token.accessToken) {
      const isProtectedRoute = pathname.startsWith("/organizador") ||
                              pathname.startsWith("/gerenciar-equipes") ||
                              pathname.startsWith("/registrar-equipe");
      
      if (isProtectedRoute) {
        const loginUrl = new URL("/auth/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.next();
    }

    let userRole = token.role;
    if (!userRole && token.accessToken) {
      try {
        const jwt = require('jsonwebtoken');
        const decodedToken = jwt.decode(token.accessToken);
        console.log("Token decodificado:", decodedToken); 
        
        if (decodedToken?.groups && Array.isArray(decodedToken.groups) && decodedToken.groups.length > 0) {
          userRole = decodedToken.groups[0];
          console.log("Role encontrada em groups:", userRole);
        } else {
          userRole = decodedToken?.role || decodedToken?.cargo;
          console.log("Role encontrada em role/cargo:", userRole);
        }
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
      }
    }
    
    console.log("UserRole final:", userRole, "PathName:", pathname); 

    if (pathname === "/" && userRole === "Organizador") {
      return NextResponse.redirect(new URL("/organizador/modalidades", request.url));
    }

    if (pathname.startsWith("/organizador/")) {
      if (userRole !== "Organizador") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    if (pathname.startsWith("/gerenciar-equipes") || pathname.startsWith("/registrar-equipe")) {
      if (userRole !== "Jogador") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    if (userRole === "Jogador" && pathname.startsWith("/organizador")) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (userRole === "Organizador" && (pathname.startsWith("/gerenciar-equipes") || pathname.startsWith("/registrar-equipe"))) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Erro no middleware:", error);
    const pathname = request.nextUrl.pathname;
    const isProtectedRoute = pathname.startsWith("/organizador") ||
                            pathname.startsWith("/gerenciar-equipes") ||
                            pathname.startsWith("/registrar-equipe");
    
    if (isProtectedRoute) {
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