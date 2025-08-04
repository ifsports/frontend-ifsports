import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRequests, updateRequest, type UpdateRequestPayload } from '@/lib/requests/requests';
import { getTeamsWithoutStatus } from '@/lib/requests/teams';
import { getDetailsUserByIds } from '@/lib/requests/auth';
import { getTeamInCompetition } from '@/lib/requests/competitions';
import { getDetailsCompetition } from '@/lib/requests/competitions';
import type { Request } from '@/types/requests';
import type { TeamWithCompetition } from '@/types/team';
import type { User } from '@/types/user';
import React from 'react';
import { toast } from 'sonner';

export function useRequests() {
  const queryClient = useQueryClient();

  const {
    data: requestsData,
    isLoading: isLoadingRequests,
    error: requestsError,
    refetch: refetchRequests
  } = useQuery({
    queryKey: ['requests'],
    queryFn: async () => {
      const result = await getRequests();

      console.log('Requests fetched:', result);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    }
  });

  const updateRequestMutation = useMutation({
    mutationFn: ({ requestId, payload }: { requestId: string; payload: UpdateRequestPayload }) =>
      updateRequest(requestId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });

  const teamIds = React.useMemo(() => {
    if (!requestsData) return [];
    const uniqueTeamIds = new Set<string>();
    requestsData.forEach(request => {
      if (request.team_id) {
        uniqueTeamIds.add(request.team_id);
      }
    });
    return Array.from(uniqueTeamIds);
  }, [requestsData]);

  const {
    data: allTeamsData,
    isLoading: isLoadingTeams,
    error: teamsError
  } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      try {
        const result = await getTeamsWithoutStatus();
        if (!result.success) {
          throw new Error(result.error);
        }
        return result.data;
      } catch (error) {
        toast.error('Erro ao buscar equipes');
        return [];
      }
    },
    enabled: !!requestsData && requestsData.length > 0,
    retry: 1
  });

  const teamsData = React.useMemo(() => {
    if (!allTeamsData) return [];
    const teams = Array.isArray(allTeamsData) ? allTeamsData : allTeamsData.teams || [];
    const filteredTeams = teams.filter(team => teamIds.includes(team.id));
    return filteredTeams;
  }, [allTeamsData, teamIds]);

  const {
    data: competitionsData,
    isLoading: isLoadingCompetitions,
    error: competitionsError
  } = useQuery({
    queryKey: ['competitions-details', requestsData?.map(r => r.competition_id).filter(Boolean) || []],
    queryFn: async () => {
      if (!requestsData || requestsData.length === 0) return [];
      
      const competitionIds = [...new Set(
        requestsData
          .map(r => r.competition_id)
          .filter((id): id is string => Boolean(id))
      )];
      
      if (competitionIds.length === 0) return [];
      
      const competitionsPromises = competitionIds.map(async (competitionId) => {
        try {
          console.log(`Buscando detalhes da competição ${competitionId}`);
          const result = await getDetailsCompetition(competitionId);

          if (!result.success) {
            console.error(`Erro ao buscar competição ${competitionId}:`, result.error);
            return null;
          }
          
          console.log(`Competição ${competitionId} encontrada:`, result.data);
          return result.data;
        } catch (error) {
          console.error(`Erro ao buscar competição ${competitionId}:`, error);
          return null;
        }
      });

      const competitions = await Promise.all(competitionsPromises);
      return competitions.filter(Boolean);
    },
    enabled: !!requestsData && requestsData.length > 0,
    retry: 1
  });

  const allUserIds = React.useMemo(() => {
    const userIds = new Set<string>();
    
    requestsData?.forEach(request => {
      if (request.user_id) {
        userIds.add(request.user_id);
      }
    });
    
    teamsData?.forEach(team => {
      team.members?.forEach(member => {
        userIds.add(member.user_id);
      });
    });
    
    return Array.from(userIds);
  }, [requestsData, teamsData]);

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError
  } = useQuery({
    queryKey: ['users', allUserIds],
    queryFn: async () => {
      if (allUserIds.length === 0) return [];
      const result = await getDetailsUserByIds({ ids: allUserIds });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: allUserIds.length > 0
  });

  const processedRequests = React.useMemo(() => {
    if (!requestsData || !teamsData) return [];

    return requestsData.map((request: any) => {
      const teamData = teamsData.find((team: any) => team.id === request.team_id);
      
      const competitionData = competitionsData?.find(
        (comp: any) => comp?.id === request.competition_id
      );

      let userData = undefined; 
      if (usersData && Array.isArray(usersData) && request.user_id) {
        userData = usersData.find((user: any) => user.id === request.user_id);
      }

      return {
        ...request,
        team: teamData ? {
          ...teamData,
          competition: competitionData || null
        } : undefined,
        user: userData
      };
    });
  }, [requestsData, teamsData, competitionsData, usersData]); // ✅ Adicionar usersData como dependência

  return {
    requests: processedRequests,
    isLoading: isLoadingRequests || isLoadingTeams || isLoadingCompetitions,
    error: requestsError || teamsError || competitionsError,
    updateRequest: updateRequestMutation.mutate,
    isUpdating: updateRequestMutation.isPending,
    updateError: updateRequestMutation.error
  };
}