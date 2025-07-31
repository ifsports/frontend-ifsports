import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { signIn } from "@/lib/requests/auth";

import { Session, User as NextAuthUser, JWT as NextAuthJWT } from "next-auth";

interface CustomUser extends NextAuthUser {
    accessToken?: string;
    refreshToken?: string;
    provider?: string;
}

interface CustomJWT extends NextAuthJWT {
    id: string;
    accessToken?: string;
    refreshToken?: string;
    provider?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accessTokenExpires?: number;
}

interface CustomSession extends Session {
    accessToken?: string;
    refreshToken?: string;
    provider?: string;
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

const authOptions = {
    session: {
        strategy: "jwt" as const,
    },
    
    providers: [
        CredentialsProvider({
            id: 'credentials-db',
            name: 'Credentials',
            credentials: {
                matricula: { label: "matricula", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials) {
                    return null;
                }
                try {
                    const response = await signIn(credentials);

                    if (response.data && response.data.access_token) {
                        return {
                            id: credentials.matricula,
                            accessToken: response.data.access_token,
                            refreshToken: response.data.refresh_token,
                        } as CustomUser;
                    }
                } catch (error) {
                }
                return null;
            }
        }),

        CredentialsProvider({
            id: "suap-sso",
            name: "SUAP SSO",
            credentials: {
                token: { label: "Access Token", type: "text" },
                refreshToken: { label: "Refresh Token", type: "text" },
                userId: { label: "User ID", type: "text" },
                userName: { label: "User Name", type: "text" },
                userEmail: { label: "User Email", type: "text" },
                userImage: { label: "User Image", type: "text" },
            },
            async authorize(credentials) {
                if (credentials?.token && credentials?.userId) {
                    return {
                        id: credentials.userId,
                        accessToken: credentials.token,
                        refreshToken: credentials.refreshToken,
                        name: credentials.userName,
                        email: credentials.userEmail,
                        image: credentials.userImage,
                    } as CustomUser;
                }
                return null;
            },
        }),
    ],
    
    callbacks: {
        async jwt({ token, user, account }) {
            const customToken = token as CustomJWT;
            const customUser = user as CustomUser;

            if (customUser) {
                console.log("📝 Criando novo token JWT para:", customUser.id);
                return {
                    ...token,
                    id: customUser.id,
                    accessToken: customUser.accessToken,
                    refreshToken: customUser.refreshToken,
                    accessTokenExpires: Date.now() + 3600 * 1000,
                    name: customUser.name,
                    email: customUser.email,
                    image: customUser.image,
                };
            }

            if (customToken.accessTokenExpires && Date.now() > customToken.accessTokenExpires) {
                return { ...token };
            }

            return token;
        },
        async session({ session, token }) {
            const customSession = session as CustomSession;
            const customToken = token as CustomJWT;

            customSession.accessToken = customToken.accessToken ?? undefined;
            customSession.refreshToken = customToken.refreshToken ?? undefined;
            customSession.provider = customToken.provider ?? undefined;
            customSession.user.id = customToken.id ?? '';
            customSession.user.name = customToken.name ?? null;
            customSession.user.email = customToken.email ?? null;
            customSession.user.image = customToken.image ?? null;

            return customSession;
        }
    },
    pages: {
        signIn: '/auth/login'
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
};

export { authOptions };
export default NextAuth(authOptions);