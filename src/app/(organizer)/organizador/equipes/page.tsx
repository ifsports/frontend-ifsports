"use client";

import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { TeamWithCompetition } from '@/types/team';
import { TableColumn, RowData } from '@/types/table';
import type { CompetitionTeam } from '@/types/competition';
import TeamCard from '@/components/shared/tables/team-card';
import DataTable from '@/components/shared/tables/data-table';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getCompetitionsAuth, getCompetitionTeams } from '@/lib/requests/competitions';
import { getAllTeams } from '@/lib/requests/teams';

export default function TeamsPage() {
  const [expandedCompetitions, setExpandedCompetitions] = useState<Record<string, boolean>>({});

  const { data: competitions, isLoading: isLoadingCompetitions, error: competitionsError } = useQuery({
    queryKey: ['competitions-auth'],
    queryFn: async () => {
      const result = await getCompetitionsAuth();

      if (!result.success) throw new Error(result.error);

      return result.data;
    },
  });

  const { data: allTeamsResponse, isLoading: isLoadingAllTeams, error: allTeamsError } = useQuery({
    queryKey: ['all-teams'],
    queryFn: async () => {
      const result = await getAllTeams();

      if (!result.success) throw new Error(result.error);

      return result.data;
    },
  });

  const { data: competitionsWithTeams, isLoading: isLoadingTeams, error: teamsError } = useQuery({
    queryKey: ['competitions-with-teams', competitions?.map(c => c.id)],
    queryFn: async () => {
      if (!competitions || !allTeamsResponse) {
        return [];
      }
      
      const results = await Promise.all(
        competitions.map(async (competition) => {
          const competitionTeamsResult = await getCompetitionTeams(competition.id);
          
          if (!competitionTeamsResult.success) {
            return { competition, teams: [] };
          }

          const teamsWithCompetition: TeamWithCompetition[] = competitionTeamsResult.data
            .reduce<TeamWithCompetition[]>((acc, competitionTeam: CompetitionTeam) => {
              
              const fullTeam = allTeamsResponse.find(team => team.id === competitionTeam.team_id);
              
              if (!fullTeam) {
                return acc;
              }

              acc.push({
                ...fullTeam,
                competition: competition,
                created_at: fullTeam.created_at
              });

              return acc;
            }, []);

          return { competition, teams: teamsWithCompetition };
        })
      );

      return results;
    },
    enabled: !!competitions && !!allTeamsResponse,
  });

  const toggleCompetition = (competitionId: string) => {
    setExpandedCompetitions(prev => ({
      ...prev,
      [competitionId]: !prev[competitionId]
    }));
  };

  const tableColumns: TableColumn[] = [
    {
      key: 'name',
      header: 'Nome da Equipe',
      width: '2fr',
      render: (row: RowData) => {
        const teamData = row as TeamWithCompetition;
        
        return (
          <div className="flex flex-col justify-start items-start gap-1">
            <span className="font-medium text-sm text-gray-800">{teamData.name}</span>
            <span className="font-light text-xs text-gray-500">{teamData.abbreviation}</span>
          </div>
        );
      }
    },
    {
      key: 'members',
      header: 'Membros',
      width: '1fr',
      render: (row: RowData) => {
        const teamData = row as TeamWithCompetition;
        const memberCount = teamData.members?.length || 0;
        
        return (
          <span className="font-medium text-sm text-gray-800">
            {memberCount} {memberCount === 1 ? 'membro' : 'membros'}
          </span>
        );
      }
    },
    {
      key: 'created_at',
      header: 'Data de inscrição',
      width: '1fr',
      render: (row: RowData) => {
        const teamData = row as TeamWithCompetition;
        if (!teamData.created_at) return <span>-</span>;
        return <span>{new Date(teamData.created_at).toLocaleDateString('pt-BR')}</span>;
      }
    },
    {
      key: 'actions',
      header: 'Ações',
      width: '1fr',
      render: (row: RowData) => {
        const teamData = row as TeamWithCompetition;
        return (
          <div className="flex justify-end">
            <Link
              href={`/organizador/equipes/${teamData.id}`}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
              title="Visualizar equipe"
            >
              <Eye size={16} />
            </Link>
          </div>
        );
      }
    }
  ];

  if (isLoadingCompetitions || isLoadingTeams || isLoadingAllTeams) {
    return (
      <div className="flex w-full justify-center items-center py-8">
        <p className="text-gray-600">Carregando equipes...</p>
      </div>
    );
  }

  if (competitionsError || teamsError || allTeamsError) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl text-[#062601] font-['Baloo_2'] font-bold">
            Equipes
          </h3>
        </div>
        <div className="flex justify-center items-center py-8">
          <p className="text-red-600">Erro ao carregar dados das equipes.</p>
          <pre className="text-xs mt-2 text-gray-500">
            {JSON.stringify({ competitionsError, teamsError, allTeamsError }, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl text-[#062601] font-['Baloo_2'] font-bold">
          Equipes
        </h3>
      </div>

      <div className="w-full mt-8 flex gap-4 flex-col">
        {competitionsWithTeams?.map(({ competition, teams }) => {

          const competitionAsTeam: TeamWithCompetition = {
            id: competition.id,
            name: competition.name,
            abbreviation: competition.modality || 'N/A',
            created_at: competition.start_date || new Date().toISOString(),
            status: 'active',
            campus_code: competition.modality || 'CAMPUS01',
            members: [],
            competition: null
          };

          return (
            <TeamCard
              key={competition.id}
              team={competitionAsTeam}
              isExpanded={expandedCompetitions[competition.id] || false}
              onToggle={() => toggleCompetition(competition.id)}
              showToggle={true}
              className='bg-white rounded-2xl p-2 pl-3 pr-5 w-full'
            >
              {teams.length > 0 ? (
                <DataTable
                  columns={tableColumns}
                  data={teams}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                  <p>Nenhuma equipe inscrita nesta competição.</p>
                </div>
              )}
            </TeamCard>
          );
        })}
      </div>
    </div>
  );
}