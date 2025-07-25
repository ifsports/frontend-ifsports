import type { APIGetTeamsFromCampus } from "@/types/team";
import { axiosAPI } from "../axios-api";

export const getTeamFromCampusAuth = async () => {
    const result = await axiosAPI<APIGetTeamsFromCampus>({
        endpoint: `/teams/`,
    })

    return result;
}

export const getTeamFromCampusNoAuth = async (campus: { campus: string }) => {
    const result = await axiosAPI<APIGetTeamsFromCampus>({
        endpoint: `/teams/`,
        withAuth: false,
        queryParams: campus,
    })

    return result;
}