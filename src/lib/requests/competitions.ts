import {axiosAPI} from "@/lib/axios-api";
import {APIGetCompetitions, type Match} from "@/types/competition";

export const getCompetitionsNoAuth = async (campus_code: { campus_code: string }) => {
    const result = await axiosAPI<APIGetCompetitions>({
        endpoint: "/competitions/",
        method: "GET",
        withAuth: false,
        queryParams: campus_code,
    });

    return result;
};

export const getCompetitionsAuth = async () => {
    const result = await axiosAPI<APIGetCompetitions>({
        endpoint: "/competitions/",
        method: "GET",
        withAuth: true,
    });

    return result;
};

export const getMatchesToday = async (campus_code: { campus_code: string }) => {
    const result = await axiosAPI<Match[]>({
        endpoint: "/competitions/matches/today/",
        method: "GET",
        withAuth: false,
        queryParams: campus_code,
    });

    return result;
};