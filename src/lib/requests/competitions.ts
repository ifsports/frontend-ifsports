import {axiosAPI} from "@/lib/axios-api";
import {APIGetCompetitions, type APIGetTeamInCompetition, type Competition, type Match} from "@/types/competition";

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
    try {
        const result = await axiosAPI<Competition[]>({
            endpoint: "/competitions/",
            method: "GET",
            withAuth: true,
        });

        return  { success: true, data: result.data };
    } catch (err) {
        const error = err as Error;
        return { success: false, error: error.message };
    }
    
};

export const getTeamInCompetition = async (team_id: string) => {
    try {
        const result = await axiosAPI<APIGetTeamInCompetition>({
            endpoint: `/competitions/teams/${team_id}/`,
            method: "GET",
            withAuth: true,
        });

        return { success: true, data: result };
    } catch (err) {
        const error = err as Error;
        return { success: false, error: error.message };
    }
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