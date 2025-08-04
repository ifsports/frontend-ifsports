'use client'

import React from 'react';
import { Users, Trophy, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getTeamFromCampusAuth } from '@/lib/requests/teams';
import { getDetailsUserByIds } from '@/lib/requests/auth';
import { getTeamInCompetition } from '@/lib/requests/competitions';
import type { User } from '@/types/user';
import type { TeamWithCompetition } from '@/types/team';

interface TeamMember {
  user_id: string;
  name?: string;
  email?: string;
  course?: string;
  registration: string;
}

interface TeamData {
  id: string;
  name: string;
  abbreviation: string;
  created_at: string;
  status: string;
  campus_code: string;
  members: TeamMember[];
}

interface OrganizerTeamDetailsPageProps {
  teamId: string;
}

export default function OrganizerTeamDetailsPage({ teamId }: OrganizerTeamDetailsPageProps) {
  const { data: teamData, isLoading: isLoadingTeam, error: teamError } = useQuery({
    queryKey: ['team-details', teamId],
    queryFn: async () => {
      const result = await getTeamFromCampusAuth({ status: "active" });
      
      const specificTeam = (result.data as unknown as any[])?.find((team: any) => team.id === teamId);
      
      if (!specificTeam) throw new Error('Equipe não encontrada');

      return specificTeam as TeamData;
    },
  });

  const { data: teamCompetitionData, isLoading: isLoadingCompetition, error: competitionError } = useQuery({
    queryKey: ['team-competition', teamId],
    queryFn: async () => {
      const result = await getTeamInCompetition(teamId);

      if (!result.success) throw new Error(result.error);

      return result.data?.data;
    },
  });

  const memberUserIds = teamData?.members?.map(member => member.user_id).filter(Boolean) || [];
  
  const { data: membersDetails, isLoading: isLoadingMembers, error: membersError } = useQuery({
    queryKey: ['members-details', memberUserIds],
    queryFn: async () => {
      if (memberUserIds.length === 0) return [];
      
      const result = await getDetailsUserByIds({ ids: memberUserIds });

      if (!result.success) throw new Error(result.error);

      return result.data;
    },
    enabled: !!teamData && memberUserIds.length > 0,
  });

  const teamWithMemberDetails = React.useMemo(() => {
    if (!teamData) return null;

    const membersWithDetails = teamData.members?.map((member: TeamMember) => {
      const userDetails = (membersDetails as User[])?.find((user: User) => 
        user.matricula === member.user_id || user.id === member.user_id
      );
      
      return {
        ...member,
        name: userDetails?.nome || member.name || 'Nome não informado',
        email: userDetails?.email || 'Email não informado',
        course: userDetails?.curso || member.course || 'Curso não informado',
        registration: userDetails?.matricula || member.user_id || 'Matrícula não informada'
      };
    }) || [];

    const teamWithCompetition: TeamWithCompetition = {
      id: teamData.id,
      name: teamData.name,
      abbreviation: teamData.abbreviation,
      created_at: teamData.created_at,
      status: teamData.status as 'active' | 'pendent' | 'closed',
      campus_code: teamData.campus_code,
      members: membersWithDetails,
      competition: teamCompetitionData?.competition || null
    };

    return teamWithCompetition;
  }, [teamData, membersDetails, teamCompetitionData]);

  const isLoading = isLoadingTeam || isLoadingMembers || isLoadingCompetition;
  const error = teamError || membersError || competitionError;

  if (isLoading) {
    return (
      <div className="flex w-full justify-center items-center py-8">
        <p className="text-gray-600">Carregando dados da equipe...</p>
      </div>
    );
  }

  if (error || !teamWithMemberDetails) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/organizador/equipes" className="h-4 flex items-center text-black">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl text-[#062601] font-title font-bold">
            Equipe não encontrada
          </h1>
        </div>
        <div className="bg-white rounded-2xl p-6">
          <p className="text-gray-600">A equipe solicitada não foi encontrada.</p>
          {error && (
            <pre className="text-xs mt-2 text-red-500">
              {JSON.stringify(error, null, 2)}
            </pre>
          )}
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusText = (status: string) => {
    return status === 'active' ? 'Ativa' : status === 'finished' ? 'Finalizada' : 'Inativa';
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-[#4CAF50]';
      case 'finished': return 'text-blue-600';
      default: return 'text-red-600';
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/organizador/equipes" className="h-4 flex items-center text-black">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold font-['Baloo_2'] text-[#062601]">
          {teamWithMemberDetails.name}
        </h1>
      </div>

      {teamWithMemberDetails.competition && (
        <div className="bg-white rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-6 w-6 border border-gray-300 rounded-lg flex justify-center items-center">
              <Trophy size={14} className='text-[#4CAF50]' />
            </div>
            <span className="text-sm font-medium">Competição</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">Nome da Competição</span>
              <span className="font-medium text-sm">{teamWithMemberDetails.competition.name}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">Status da Competição</span>
              <span className={`font-medium text-sm w-fit ${getStatusColor(teamWithMemberDetails.competition.status)}`}>
                {getStatusText(teamWithMemberDetails.competition.status)}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-6 border border-gray-300 rounded-lg flex justify-center items-center">
            <Trophy size={14} className='text-[#4CAF50]' />
          </div>
          <span className="text-sm font-medium">Informações da Equipe</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Abreviação</span>
            <span className="font-medium text-sm">{teamWithMemberDetails.abbreviation}</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Status</span>
            <span className={`font-medium text-sm w-fit ${getStatusColor(teamWithMemberDetails.status)}`}>
              {getStatusText(teamWithMemberDetails.status)}
            </span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Data de Criação</span>
            <span className="font-medium text-sm">{formatDate(teamWithMemberDetails.created_at)}</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Campus</span>
            <span className="font-medium text-sm">{teamWithMemberDetails.campus_code}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-6 border border-gray-300 rounded-lg flex justify-center items-center">
            <Users size={14} className='text-[#4CAF50]' />
          </div>
          <span className="text-sm font-medium">
            Membros ({teamWithMemberDetails.members.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="grid grid-cols-3 gap-4 items-center px-4 py-2 bg-gray-50 text-gray-400 border border-gray-300 rounded-lg">
                <th className="text-left">Nome</th>
                <th className="text-left">Curso</th>
                <th className="text-left">Matrícula</th>
              </tr>
            </thead>
            <tbody className="mt-4">
              {teamWithMemberDetails.members.map((member, index: number) => (
                <tr 
                  key={member.user_id || index}
                  className={`grid grid-cols-3 gap-4 px-4 py-3 text-gray-800 ${
                    index !== teamWithMemberDetails.members.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <td className="font-medium">
                    {member.name}
                  </td>
                  <td className="text-gray-600">
                    {member.course}
                  </td>
                  <td className="text-gray-600">
                    {member.registration}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {teamWithMemberDetails.members.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <Users size={48} className="mb-2 text-gray-300" />
            <p>Nenhum participante cadastrado nesta equipe.</p>
          </div>
        )}
      </div>
    </div>
  );
}