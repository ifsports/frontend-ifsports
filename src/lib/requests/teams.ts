import type { APIGetTeamsFromCampus, CreateTeamPayload, Team } from "@/types/team";
import { axiosAPI } from "../axios-api";

export const getTeamFromCampusAuth = async (status: { status: string }) => {
    const result = await axiosAPI<APIGetTeamsFromCampus>({
        endpoint: `/teams/`,
        queryParams: status
    })

    return result;
}

export const getAllTeams = async () => {
    try {
        const result = await axiosAPI<Team[]>({
            endpoint: `/teams/`,
            method: "GET"
        })

        return { success: true, data: result.data };
    } catch (err) {
        const error = err as Error;
        return { success: false, error: error.message };
    }
}

export const getTeamsWithoutStatus = async () => {
    try {
        const result = await axiosAPI<APIGetTeamsFromCampus>({
            endpoint: `/teams/`,
            method: "GET"
        })

        return { success: true, data: result.data };
    } catch (err) {
        const error = err as Error;
        return { success: false, error: error.message };
    }
}

export const getTeamFromCampusNoAuth = async (campus: { campus: string }) => {
    const result = await axiosAPI<APIGetTeamsFromCampus>({
        endpoint: `/teams/`,
        withAuth: false,
        queryParams: campus,
    })

    return result;
}

export const getTeamById = async (teamId: string) => {
    try {
        const result = await axiosAPI({
            endpoint: `/teams/${teamId}`,
            method: "GET"
        })

        return { success: true, data: result.data };
    } catch (err) {
        const error = err as Error;
        return { success: false, error: error.message };
    }
}

export const getTeamsByIds = async (teamIds: string[]) => {
    try {
        const result = await axiosAPI<APIGetTeamsFromCampus>({
            endpoint: `/teams/by-ids/`,
            method: "POST",
            data: { team_ids: teamIds }
        })

        return { success: true, data: result.data };
    } catch (err) {
        const error = err as Error;
        return { success: false, error: error.message };
    }
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

export const createTeam = async (data: CreateTeamPayload) => {
    try {
        const result = await axiosAPI({
            endpoint: `/teams/`,
            method: "POST",
            data,
        })

        return { success: true, data: result };
    } catch (err) {
        const error = err as Error;
        return { success: false, error: error.message };
    }
}