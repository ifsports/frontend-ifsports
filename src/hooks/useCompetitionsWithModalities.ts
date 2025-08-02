import { getCompetitionsAuth, getCompetitionTeams, getModalityDetails } from "@/lib/requests/competitions";
import { toast } from "sonner";
import type { Competition, Modality } from "@/types/competition";
import { useEffect, useState } from "react";

export default function useCompetitionsWithModalities() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [modalities, setModalities] = useState<Record<string, Modality>>({});
  const [teamsCountMap, setTeamsCountMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await getCompetitionsAuth();

      if (!response.success) {
        toast.error(response.error);
        setLoading(false);
        return;
      }

      const competitionsData = response.data as Competition[];
      setCompetitions(competitionsData);

      // Busca das modalidades
      const modalityIds = Array.from(new Set(competitionsData.map(c => c.modality)));
      const modalityResults = await Promise.all(modalityIds.map(id => getModalityDetails(id)));

      const modalityMap: Record<string, Modality> = {};
      modalityResults.forEach((res, idx) => {
        if (res.success && res.data) {
          modalityMap[modalityIds[idx]] = res.data;
        }
      });
      setModalities(modalityMap);

      // Busca das equipes por competição
      const teamsResults = await Promise.all(
        competitionsData.map(c => getCompetitionTeams(c.id))
      );

      const newTeamsCountMap: Record<string, number> = {};
      teamsResults.forEach((res, idx) => {
        if (res.success && res.data) {
          newTeamsCountMap[competitionsData[idx].id] = res.data.length;
        } else {
          newTeamsCountMap[competitionsData[idx].id] = 0; // fallback 0 se falhar
        }
      });
      setTeamsCountMap(newTeamsCountMap);

      setLoading(false);
    }

    fetchData();
  }, []);

  return { competitions, modalities, teamsCountMap, loading };
}