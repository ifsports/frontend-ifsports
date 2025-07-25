import { getMatchesFromCompetition } from "@/lib/requests/match-comments";
import type { MatchLive } from "@/types/match-comments";
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