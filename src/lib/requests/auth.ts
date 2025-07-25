import {axiosAPI} from "@/lib/axios-api";
import {APISignIn} from "@/types/auth";
import {SignInData} from "@/lib/schemas/auth-schema";

export const signIn = async (data: SignInData) => {
    const axiosResponse = await axiosAPI<APISignIn>({
        endpoint: "/auth/token/",
        method: "POST",
        withAuth: false,
        data,
    });

    return {
        data: {
            access_token: axiosResponse.data?.access,
            refresh_token: axiosResponse.data?.refresh,
        }
    };
};

export const getDetailsUser = async (user_id: string) => {
    const response = await axiosAPI({
        endpoint: `/auth/users/${user_id}/`,
        method: "GET",
        withAuth: false,
    });

    return response;
}