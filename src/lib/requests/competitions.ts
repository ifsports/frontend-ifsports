import {axiosAPI} from "@/lib/axios-api";
import {APIGetCompetitions, type APIGetMatchesFromCampus} from "@/types/competition";

export const getCompetitionsNoAuth = async (campus_code: { campus_code: string }) => {
    const result = await axiosAPI<APIGetCompetitions>({
        endpoint: "/competitions/",
        method: "GET",
        withAuth: false,
        queryParams: campus_code,
    });

    if (result.error) {
        console.log("Erro:", result.error);
        return null;
    }

    return result;
};

export const getCompetitionsAuth = async () => {
    const result = await axiosAPI<APIGetCompetitions>({
        endpoint: "/competitions/",
        method: "GET",
        withAuth: true,
    });

    if (result.error) {
        console.log("Erro:", result.error);
        return null;
    }

    return result;
};

export const getMatchesFromAllCompetitions = async ( competition_id : string ) => {
    const result = await axiosAPI<APIGetMatchesFromCampus>({
        endpoint: `/competitions/${competition_id}/matches/`,
        withAuth: false,
    })

    if (result.error) {
        console.log("Erro:", result.error);
        return null;
    }

    return result;
}
