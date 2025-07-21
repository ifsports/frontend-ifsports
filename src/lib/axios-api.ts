"use server";

import { APIError } from "@/types/api"
import { cookies } from "next/headers";
import axios, { AxiosError } from "axios";

interface APIProps {
    endpoint: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    data?: object;
    withAuth?: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/v1";

export const axiosAPI = async <TypeResponse>({
                                                 endpoint,
                                                 method = "GET",
                                                 data,
                                                 withAuth = true,
                                             }: APIProps) => {

    const instance = axios.create({
        baseURL: BASE_URL,
    });

    if (withAuth) {
        const sessionAuth = (await cookies()).get(
            process.env.NEXT_PUBLIC_AUTH_KEY as string
        );

        if (sessionAuth?.value) {
            instance.defaults.headers.common[
                "Authorization"
                ] = `Bearer ${sessionAuth.value}`;
        }
    }

    try {
        const request = await instance<TypeResponse>(endpoint, {
            method,
            params: method === "GET" && data,
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