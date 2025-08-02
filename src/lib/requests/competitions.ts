import {axiosAPI} from "@/lib/axios-api";
import {APIGetCompetitions, type APIGetTeamInCompetition, type Competition, type CompetitionTeam, type Match, type PaginatedResponse, type RoundData, type TeamClassification} from "@/types/competition";
import type { Team } from "@/types/team";

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

export const getDetailsCompetition = async (competition_id: string) => {
    try {
        const result = await axiosAPI<Competition>({
            endpoint: `/competitions/${competition_id}/`,
            method: "GET",
            withAuth: false,
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

export async function getCompetitionTeams(competitionId: string) {
  try {
    const result = await axiosAPI<CompetitionTeam[]>({
      endpoint: `/competitions/${competitionId}/teams/`,
      method: "GET",
      withAuth: false
    });
    return { success: true as const, data: result.data };
  } catch (err) {
    const error = err as Error;
    return { success: false as const, error: error.message };
  }
}

export async function getCompetitionRounds(competitionId: string) {
  try {
    const result = await axiosAPI<PaginatedResponse<RoundData> | RoundData[]>({
      endpoint: `/competitions/${competitionId}/round-matches/`,
      method: "GET",
      withAuth: false
    });
    return { success: true as const, data: result.data };
  } catch (err) {
    try {
      const result = await axiosAPI<PaginatedResponse<RoundData> | RoundData[]>({
        endpoint: `/competitions/${competitionId}/rounds/`,
        method: "GET",
        withAuth: false
      });
      return { success: true as const, data: result.data };
    } catch (innerErr) {
      const error = innerErr as Error;
      return { success: false as const, error: error.message };
    }
  }
}

export async function getCompetitionRoundMatches(competitionId: string) {
  try {
    const result = await axiosAPI<PaginatedResponse<RoundData>>({
      endpoint: `/competitions/${competitionId}/round-matches/`,
      method: "GET",
      withAuth: false
    });
    return { success: true, data: result.data };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export async function getCompetitionStandings(competitionId: string) {
  try {
    const result = await axiosAPI<TeamClassification[] | Match[]>({
      endpoint: `/competitions/${competitionId}/standings/`,
      method: "GET",
      withAuth: false
    });
    return { success: true as const, data: result.data };
  } catch (err) {
    const error = err as Error;
    return { success: false as const, error: error.message };
  }
}

export async function getCompetitionMatches(competitionId: string) {
  try {
    const result = await axiosAPI<PaginatedResponse<Match>>({
      endpoint: `/competitions/${competitionId}/matches/`,
      method: "GET",
      withAuth: false
    });
    return { success: true, data: result.data };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export async function getRoundMatches(roundId: string) {
  try {
    const result = await axiosAPI<PaginatedResponse<Match>>({
      endpoint: `/rounds/${roundId}/matches/`,
      method: "GET",
      withAuth: false
    });
    return { success: true, data: result.data };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export async function getMatchDetails(matchId: string) {
  try {
    const result = await axiosAPI<Match>({
      endpoint: `/matches/${matchId}/`,
      method: "GET",
      withAuth: false
    });
    return { success: true, data: result.data };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}