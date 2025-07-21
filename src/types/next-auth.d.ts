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
        };
    }

    interface User {
        id: string;
        accessToken?: string;
        refreshToken?: string;
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
    }
}