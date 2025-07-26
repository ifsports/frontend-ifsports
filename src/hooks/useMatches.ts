import { getMatchesToday } from "@/lib/requests/competitions";
import { getChatMessagesFromMatch, getMatchDetail, getMatchesFromCompetition } from "@/lib/requests/match-comments";
import type { Match } from "@/types/competition";
import type { MatchLive, Message } from "@/types/match-comments";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useMatches(selectedCompetition: string, page: number, isCompetitionSelected: boolean, MATCHES_PER_PAGE: number) {
  return useQuery({
          queryKey: ['matches', selectedCompetition, page],
          queryFn: async () => {
              if (!selectedCompetition) {
                  toast.error("Por favor, selecione uma competição para ver os jogos.");
                  throw new Error("Competição não selecionada");
              }
  
              const offset = (page - 1) * MATCHES_PER_PAGE;
  
              const response = await getMatchesFromCompetition({
                  competition_id: selectedCompetition,
                  limit: MATCHES_PER_PAGE + 1,
                  offset,
              });
  
              if (!response || !Array.isArray(response.data)) {
                  return {
                      matches: [],
                      hasNextPage: false,
                      hasPreviousPage: page > 1,
                  };
              }
  
              const receivedMatches = response.data as MatchLive[];
  
              const hasMore = receivedMatches.length > MATCHES_PER_PAGE;
  
              const finalResult = {
                  matches: hasMore ? receivedMatches.slice(0, MATCHES_PER_PAGE) : receivedMatches,
                  hasNextPage: hasMore,
                  hasPreviousPage: page > 1,
              };
  
              return finalResult;
          },
          enabled: !!selectedCompetition && isCompetitionSelected,
      });
}

export function useMatchDetails(matchId: string) {
  return useQuery({
          queryKey: ['matchDetails', matchId],
          queryFn: async () => {
              if (!matchId) {
                  toast.error("Por favor, selecione um jogo para ver os detalhes.");
                  throw new Error("Jogo não selecionado");
              }
  
              const response = await getMatchDetail({ match_id: matchId });
  
              if (!response || !response.data) {
                  toast.error("Detalhes do jogo não encontrados.");
                  throw new Error("Dados do jogo não encontrados");
              }
  
              return response?.data as MatchLive;
          },
          enabled: !!matchId,
      });
}

export function getChatMessages(chatId: string | null){
    return useQuery({
          queryKey: ['chatMessages', chatId],
          queryFn: async () => {
              if (!chatId) {
                  toast.error("Por favor, informe o ID do chat para ver as mensagens.");
                  throw new Error("Jogo não selecionado");
              }
  
              const response = await getChatMessagesFromMatch({ chat_id: chatId });
  
              if (!response || !response.data) {
                  toast.error("Detalhes do jogo não encontrados.");
                  throw new Error("Dados do jogo não encontrados");
              }
  
              return response?.data as Message[];
          },
          enabled: !!chatId,
      });
}

export function useMatchesToday(campus_code: string) {
  return useQuery({
          queryKey: ['matchDetails', campus_code],
          queryFn: async () => {
              if (!campus_code) {
                  toast.error("Por favor, selecione um campus para ver as partidas de hoje.");
                  throw new Error("Jogo não selecionado");
              }
  
              const response = await getMatchesToday({ campus_code: campus_code });
  
              if (!response || !response.data) {
                  toast.error("Detalhes do jogo não encontrados.");
                  throw new Error("Dados do jogo não encontrados");
              }
  
              return response?.data as Match[];
          },
          enabled: !!campus_code,
      });
}