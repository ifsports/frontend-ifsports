import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRequests, updateRequest, type UpdateRequestPayload } from '@/lib/requests/requests';
import { getTeamsWithoutStatus } from '@/lib/requests/teams';
import { getDetailsUserByIds } from '@/lib/requests/auth';
import { getTeamInCompetition } from '@/lib/requests/competitions';
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
    queryKey: ['competitions', teamIds],
    queryFn: async () => {
      if (teamIds.length === 0) return [];
      
      const competitionsPromises = teamIds.map(async (teamId) => {
        try {
          const result = await getTeamInCompetition(teamId);
          if (!result.success) {
            throw new Error(result.error);
          }
          
          const competition = (result.data as any)?.data?.competition || 
                            (result.data as any)?.competition || 
                            (result.data as any)?.data;
          
          
          return { team_id: teamId, competition };
        } catch (error) {
          toast.error(`Erro ao buscar competição da equipe ${teamId}`);
          return { team_id: teamId, competition: null };
        }
      });

      const competitions = await Promise.all(competitionsPromises);
      return competitions.filter(c => c !== null);
    },
    enabled: teamIds.length > 0,
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

  const enrichedRequests: Request[] = React.useMemo(() => {
    return requestsData?.map(request => {
      const team = teamsData?.find(t => t.id === request.team_id);
      const competition = competitionsData?.find(c => c.team_id === request.team_id);
      
      const user = request.user_id && Array.isArray(usersData) 
        ? usersData.find((u: User) => u.matricula === request.user_id) 
        : undefined;
      
      const enrichedTeam: TeamWithCompetition | undefined = team ? {
        ...team,
        competition: competition?.competition || null,
        members: team.members?.map(member => {
          const userInfo = Array.isArray(usersData) ? usersData.find((u: User) => {
            return u.matricula === member.user_id;
          }) : undefined;
          
          const enrichedMember = {
            ...member,
            name: userInfo?.nome || 'Usuário não encontrado',
            registration: userInfo?.matricula || 'N/A',
            course: userInfo?.curso || 'N/A'
          };
          
          return enrichedMember;
        }) || []
      } : undefined;
      
      return {
        ...request,
        team: enrichedTeam || {
          id: request.team_id,
          name: `Equipe ${request.team_id}`,
          abbreviation: 'N/A',
          created_at: '',
          status: 'pendent',
          campus_code: '',
          members: [],
          competition: null
        },
        user: user ? {
          user_id: user.id.toString(),
          name: user.nome,
          registration: user.matricula,
          course: user.curso
        } : undefined
      };
    }) || [];
  }, [requestsData, teamsData, competitionsData, usersData]);

  return {
    requests: enrichedRequests,
    isLoading: isLoadingRequests || isLoadingUsers,
    error: requestsError || usersError,
    refetch: refetchRequests,
    updateRequest: updateRequestMutation.mutate,
    isUpdating: updateRequestMutation.isPending,
    updateError: updateRequestMutation.error
  };
} 