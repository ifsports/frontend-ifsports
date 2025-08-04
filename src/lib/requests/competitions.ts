import type { RawStanding } from "@/components/pages/competitions-page";
import {axiosAPI} from "@/lib/axios-api";
import {APIGetCompetitions, type APIGetTeamInCompetition, type Competition, type CompetitionTeam, type Match, type Modality, type PaginatedResponse, type RoundData, type TeamClassification} from "@/types/competition";

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
    const result = await axiosAPI<RawStanding[]>({
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

export async function getModalityDetails(modalityId: string) {
  try {
    const result = await axiosAPI<Modality>({
      endpoint: `/modalities/${modalityId}/`,
      method: "GET"
    });

    return { success: true, data: result.data };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export async function getModalities() {
  try {
    const result = await axiosAPI<Modality[]>({
      endpoint: `/modalities/`,
      method: "GET"
    });

    return { success: true, data: result.data };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}


export async function putEditGame({ matchId, data } : { matchId: string, data: object }) {
  try {
    const result = await axiosAPI<Match>({
      endpoint: `/competitions/matches/${matchId}/`,
      method: "PUT",
      data
    });
    return { success: true, data: result.data };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export async function patchStartCompetition(competitionId: string) {
  try {
    const result = await axiosAPI<Competition>({
      endpoint: `/competitions/${competitionId}/start/`,
      method: "PATCH"
    });
    return { success: true, data: result.data };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export async function patchFinishCompetition(competitionId: string) {
  try {
    const result = await axiosAPI<Competition>({
      endpoint: `/competitions/${competitionId}/finish/`,
      method: "PATCH"
    });
    return { success: true, data: result.data };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export async function createModality({ data } : { data: { name: string } }) {
  try {
    const result = await axiosAPI<Modality>({
      endpoint: `/modalities/`,
      method: "POST",
      data
    });

    return { success: true, data: result.data };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export async function putModality({ data, modality_id } : { data: { name: string }, modality_id: string }) {
  try {
    const result = await axiosAPI<Modality>({
      endpoint: `/modalities/${modality_id}/`,
      method: "PUT",
      data
    });

    return { success: true, data: result.data };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export async function deleteModality(modality_id: string) {
  try {
    const result = await axiosAPI<Modality>({
      endpoint: `/modalities/${modality_id}/`,
      method: "DELETE"
    });

    return { success: true, data: result.data };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export async function deleteCompetition(competition_id: string) {
  try {
    const result = await axiosAPI<Competition>({
      endpoint: `/competitions/${competition_id}/`,
      method: "DELETE"
    });

    return { success: true, data: result.data };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export async function createCompetition({ data }: { data: FormData }) {
  try {
    const result = await axiosAPI<Competition>({
      endpoint: `/competitions/`,
      method: "POST",
      data,
      withAttachment: true
    });

    return { success: true, data: result.data };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export async function generateMatchesCompetition(competitionId: string) {
  try {
    const result = await axiosAPI<Match[]>({
      endpoint: `/competitions/${competitionId}/generate/`,
      method: "POST"
    });

    return { success: true, data: result.data };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}