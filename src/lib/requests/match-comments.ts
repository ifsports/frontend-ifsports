import type { APIGetMatchesLiveFromCampus, Chat, Comments, MatchLive, Message } from "@/types/match-comments";
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
    });

    return result;
}

export const getMatchDetail = async ({ match_id }: { match_id: string;}) => {
    const result = await axiosAPI<MatchLive>({
      endpoint: `/matches/${match_id}`,
      withAuth: false
    });

    return result;
}

export const getCommentsFromMatch = async ({ match_id }: { match_id: string; }) => {
    const result = await axiosAPI<Comments[]>({
      endpoint: `/matches/${match_id}/comments/`,
      withAuth: false
    });

    return result;
}

export const getChatFromMatch = async ({ match_id }: { match_id: string; }) => {
    const result = await axiosAPI<Chat>({
      endpoint: `/matches/${match_id}/chat/`,
      withAuth: false
    });

    return result;
}

export const getChatMessagesFromMatch = async ({ chat_id }: { chat_id: string; }) => {
    const result = await axiosAPI<Message[]>({
      endpoint: `/chat/${chat_id}/messages/`,
      withAuth: false
    });

    return result;
}

export const createMessageInChat = async ({ chat_id, body }: { chat_id: string; body: string }) => {
    const result = await axiosAPI<Message>({
      endpoint: `/chat/${chat_id}/messages/`,
      method: "POST",
      data: { body },
    });

    return result;
}

export const getUserFromMessage = async ({ user_id }: { user_id: string; }) => {
    const result = await axiosAPI<{ id: string }>({
      endpoint: `/users/${user_id}`,
      withAuth: false
    });

    return result;
}

export const patchStartMatch = async (match_id: string) => {
  try {
    const result = await axiosAPI<MatchLive>({
      endpoint: `/matches/${match_id}/start-match`,
      method: "PATCH",
    });

    return { success: true, data: result };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export const deleteFinishMatch = async (match_id: string) => {
  try {
    const result = await axiosAPI<MatchLive>({
      endpoint: `/matches/${match_id}/end-match`,
      method: "DELETE",
    });

    return { success: true, data: result };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export const updateMatchScore = async (match_id: string, data: { score_home: number, score_away: number }) => {
  try {
    const result = await axiosAPI<MatchLive>({
      endpoint: `/matches/${match_id}/update-score`,
      method: "PATCH",
      data
    });

    return { success: true, data: result };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export const createComment = async (match_id: string, data: { body: string }) => {
  try {
    const result = await axiosAPI<Comments>({
      endpoint: `/matches/${match_id}/comments/`,
      method: "POST",
      data
    });

    return { success: true, data: result };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

