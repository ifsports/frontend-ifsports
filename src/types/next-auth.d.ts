import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    provider?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      campus?: string;
      role?: string;
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    accessToken?: string;
    refreshToken?: string;
    provider?: string;
    campus?: string;
    role?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accessToken?: string;
    refreshToken?: string;
    provider?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    campus?: string;
    role?: string;
    accessTokenExpires?: number;
  }
}