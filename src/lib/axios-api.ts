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
    withAttachment?: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/v1";

export const axiosAPI = async <TypeResponse>({
                                                 endpoint,
                                                 method = "GET",
                                                 data,
                                                 queryParams,
                                                 withAuth = true,
                                                 withAttachment = false,
                                             }: APIProps) => {

    const instance = axios.create({
        baseURL: BASE_URL,
    });

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

    if (withAttachment) {
        instance.defaults.headers.common["Content-Type"] = "multipart/form-data";
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
        const e = error as AxiosError<any>;
        const errorData = e.response?.data;

        let message = "Ocorreu um erro inesperado";

        if (errorData) {
            if (typeof errorData === "string") {
                message = errorData;
            } else if (typeof errorData.detail === "string") {
                message = errorData.detail;
            } else if (typeof errorData.message === "string") {
                message = errorData.message;
            } else if (typeof errorData.error === "string") {
                message = errorData.error;
            } else if (Array.isArray(errorData.errors)) {
                message = errorData.errors.join(", ");
            } else {
                // Se ainda for objeto, transforma em string legível
                message = JSON.stringify(errorData);
            }
        }

        throw new Error(message);
    }
};