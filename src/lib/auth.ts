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
    id: string; // Garantir que id está aqui
    accessToken?: string;
    refreshToken?: string;
    provider?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
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
                        // Retorne um objeto que corresponde à sua interface CustomUser
                        return {
                            id: credentials.matricula,
                            accessToken: response.data.access_token,
                            refreshToken: response.data.refresh_token,
                            // Certifique-se de que outras propriedades como name, email, image também são retornadas se você precisar delas no 'user'
                            // Por exemplo: name: response.data.name, email: response.data.email, etc.
                        } as CustomUser; // Asserção de tipo para o retorno
                    }
                } catch (error) {
                    console.error("Auth error:", error);
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
                    // Retorne um objeto que corresponde à sua interface CustomUser
                    return {
                        id: credentials.userId,
                        accessToken: credentials.token,
                        refreshToken: credentials.refreshToken,
                        name: credentials.userName,
                        email: credentials.userEmail,
                        image: credentials.userImage,
                    } as CustomUser; // Asserção de tipo para o retorno
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            // Asserção de tipo para o token, informando que ele é do tipo CustomJWT
            const customToken = token as CustomJWT;
            // Asserção de tipo para o user, informando que ele é do tipo CustomUser
            const customUser = user as CustomUser;

            if (customUser) {
                customToken.id = customUser.id;
                if (customUser.accessToken) {
                    customToken.accessToken = customUser.accessToken;
                }
                if (customUser.refreshToken) {
                    customToken.refreshToken = customUser.refreshToken;
                }
                if (customUser.email) {
                    customToken.email = customUser.email;
                }
                if (customUser.name) {
                    customToken.name = customUser.name;
                }
                if (customUser.image) {
                    customToken.image = customUser.image;
                }
                if (account?.provider === 'suap-sso') {
                    customToken.provider = 'suap-sso';
                }
            }
            return customToken;
        },
        async session({ session, token }) {
            // Asserção de tipo para a sessão, informando que ela é do tipo CustomSession
            const customSession = session as CustomSession;
            // Asserção de tipo para o token, informando que ele é do tipo CustomJWT
            const customToken = token as CustomJWT;

            if (customToken.accessToken) {
                customSession.accessToken = customToken.accessToken;
            }
            if (customToken.refreshToken) {
                customSession.refreshToken = customToken.refreshToken;
            }
            // Certifique-se que session.user.id existe antes de atribuir
            if (customToken.id && customSession.user) {
                customSession.user.id = customToken.id;
            }
            if (customToken.email && customSession.user) {
                customSession.user.email = customToken.email;
            }
            if (customToken.name && customSession.user) {
                customSession.user.name = customToken.name;
            }
            if (customToken.image && customSession.user) {
                customSession.user.image = customToken.image;
            }
            if (customToken.provider) {
                customSession.provider = customToken.provider;
            }
            return customSession;
        },
    },
    pages: {
        signIn: '/auth/login'
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export { authOptions };
export default NextAuth(authOptions);