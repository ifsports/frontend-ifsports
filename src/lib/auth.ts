import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { signIn } from "@/lib/requests/auth";

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
                        return {
                            id: credentials.matricula,
                            accessToken: response.data.access_token,
                            refreshToken: response.data.refresh_token,
                        };
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
                    return {
                        id: credentials.userId,
                        accessToken: credentials.token,
                        refreshToken: credentials.refreshToken,
                        name: credentials.userName,
                        email: credentials.userEmail,
                        image: credentials.userImage,
                    };
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                if (user.accessToken) {
                    token.accessToken = user.accessToken;
                }
                if (user.refreshToken) {
                    token.refreshToken = user.refreshToken;
                }
                if (user.email) {
                    token.email = user.email;
                }
                if (user.name) {
                    token.name = user.name;
                }
                if (user.image) {
                    token.image = user.image;
                }
                if (account?.provider === 'suap-sso') {
                    token.provider = 'suap-sso';
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token.accessToken) {
                session.accessToken = token.accessToken;
            }
            if (token.refreshToken) {
                session.refreshToken = token.refreshToken;
            }
            if (token.id) {
                session.user.id = token.id as string;
            }
            if(token.email) {
                session.user.email = token.email as string;
            }
            if(token.name) {
                session.user.name = token.name as string;
            }
            if(token.image) {
                session.user.image = token.image as string;
            }
            if (token.provider) {
                session.provider = token.provider;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/login'
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export { authOptions };
export default NextAuth(authOptions);