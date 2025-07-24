import type { APIGetMatchesLiveFromCampus } from "@/types/match-comments";
import { axiosAPI } from "../axios-api";

export const getMatchesFromCompetition = async ({ competition_id, limit, offset }: { competition_id: string; limit: number; offset: number }) => {
    const result = await axiosAPI<APIGetMatchesLiveFromCampus>({
        endpoint: `/matches/`,
        withAuth: false,
        queryParams: {
            competition_id,
            limit,
            offset,
        }
    })

    if (result.error) {
        console.log("Erro:", result.error);
        return null;
    }

    return result;
}