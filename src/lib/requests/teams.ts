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

export const deleteTeamMemberFromTeam = async ({ team_id, team_member_id, data }: { team_id: string, team_member_id: string, data: object }) => {
    try {
        const result = await axiosAPI({
            endpoint: `/teams/${team_id}/members/${team_member_id}`,
            method: "DELETE",
            data,
        })

        return { success: true, data: result };
    } catch (err) {
        const error = err as Error;
        return { success: false, error: error.message };
    }
    
}

export const addTeamMemberFromTeam = async ({ team_id, data }: { team_id: string, data: object }) => {
    try {
        const result = await axiosAPI({
            endpoint: `/teams/${team_id}/members/`,
            method: "POST",
            data,
        })

        return { success: true, data: result };
    } catch (err) {
        const error = err as Error;
        return { success: false, error: error.message };
    }
}

export const deleteTeam = async ({ team_id, data }: { team_id: string, data: object }) => {
    try {
        const result = await axiosAPI({
            endpoint: `/teams/${team_id}`,
            method: "DELETE",
            data,
        })

        return { success: true, data: result };
    } catch (err) {
        const error = err as Error;
        return { success: false, error: error.message };
    }
}