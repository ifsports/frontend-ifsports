import { getTeamFromCampusNoAuth } from "@/lib/requests/teams";
import type { Team } from "@/types/team";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useTeams(selectedCampus: string) {
  return useQuery({
          queryKey: ['teams', selectedCampus],
          queryFn: async () => {
              let response;
              
              if (!selectedCampus) {
                  toast.error("Por favor, selecione um campus para ver as equipes.");
                  throw new Error("Campus não selecionado");
              }
              response = await getTeamFromCampusNoAuth({ campus: selectedCampus });
              
  
              if (!response || !Array.isArray(response.data)) {
                  toast.error("Nenhuma equipe encontrada para o campus selecionado.");
                  throw new Error("Dados de equipes não encontrados");
              }
  
              return response.data as Team[];
          },
          enabled: !!selectedCampus,
          staleTime: 5 * 60 * 1000,
      });
}