import {axiosAPI} from "@/lib/axios-api";
import {APISignIn} from "@/types/auth";
import {SignInData} from "@/lib/schemas/auth-schema";
import type { APIGetUsersByIds, User } from "@/types/user";

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

export const logoutUser = async () => {
    const response = await axiosAPI({
        endpoint: "/auth/logout/",
        method: "POST",
    });

    return response;
};

export const getDetailsUser = async (user_id: string) => {
    const response = await axiosAPI({
        endpoint: `/auth/users/${user_id}/`,
        method: "GET",
        withAuth: false,
    });

    return response;
}

export const getDetailsUserByIds = async (data: APIGetUsersByIds) => {
    try {
        const response = await axiosAPI({
            endpoint: `/auth/users/by-ids/`,
            method: "POST",
            withAuth: false,
            data,
        });   
        
        return { success: true, data: response.data };
    } catch (err) {
        const error = err as Error;
        return { success: false, error: error.message };
    }    
}