"use server";

import { APIError } from "@/types/api"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import axios, { AxiosError } from "axios";

interface APIProps {
    endpoint: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    data?: object;
    queryParams?: object;
    withAuth?: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/v1";

export const axiosAPI = async <TypeResponse>({
                                                 endpoint,
                                                 method = "GET",
                                                 data,
                                                 queryParams,
                                                 withAuth = true,
                                             }: APIProps) => {

    const instance = axios.create({
        baseURL: BASE_URL,
    });

    console.log()

    if (withAuth) {
        const session = await getServerSession(authOptions);

        console.log("Session completa:", session);
        console.log("Access token:", session?.accessToken);

        if (session?.accessToken) {
            instance.defaults.headers.common[
                "Authorization"
                ] = `Bearer ${session.accessToken}`;
            console.log("✅ Token enviado para API");
        } else {
            console.log("❌ Access token não encontrado na session");
        }
    }

    try {
        const request = await instance<TypeResponse>(endpoint, {
            method,
            params: queryParams,
            data: method !== "GET" && data,
        });

        return {
            data: request.data,
        };
    } catch (error) {
        const e = error as AxiosError<APIError>;
        return {
            error: {
                message: e.response?.data.detail ?? "Ocorreu um erro inesperado",
            },
        };
    }
};