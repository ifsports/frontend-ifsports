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