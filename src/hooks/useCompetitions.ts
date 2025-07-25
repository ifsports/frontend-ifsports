import { getCompetitionsNoAuth } from "@/lib/requests/competitions";
import type { Competition } from "@/types/competition";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCompetitions(isCampusSelected: boolean, selectedCampus: string) {
  return useQuery({
          queryKey: ['competitions', isCampusSelected],
          queryFn: async () => {
              let response;
  
              if (selectedCampus) {
                  response = await getCompetitionsNoAuth({ campus_code: selectedCampus });
              } else {
                  toast.error("Por favor, selecione um campus para ver as competições.");
                  throw new Error("Campus não selecionado");
              }
  
              const competitions = response?.data;
  
              if (!competitions || !Array.isArray(competitions)) {
                  toast.error("Nenhuma competição encontrada para o campus selecionado.");
                  throw new Error("Competição não encontrada na resposta");
              }
  
              return competitions as Competition[];
          },
          enabled: !!selectedCampus,
      });
}