"use client";

import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { Team, TeamWithCompetition } from '@/types/team';
import { TableColumn, RowData } from '@/types/table';
import type { Competition, CompetitionStatus, CompetitionSystem, Modality } from '@/types/competition';
import TeamCard from '@/components/shared/tables/team-card';
import DataTable from '@/components/shared/tables/data-table';
import Link from 'next/link';

const mockModalities: Modality[] = [
  { id: '1', name: 'Basquete', campus: 'PF' },
  { id: '2', name: 'Vôlei', campus: 'PF' },
  { id: '3', name: 'Futsal', campus: 'PF' }
];

const mockCompetitions: Competition[] = [
  {
    id: '1',
    name: 'Campeonato de Basquete 2024',
    modality: mockModalities[0],
    status: 'active' as CompetitionStatus,
    start_date: '2024-01-15',
    end_date: '2024-03-15',
    system: 'league' as CompetitionSystem,
    image: '/images/basketball.jpg',
    min_members_per_team: 8,
    teams_per_group: 4,
    teams_qualified_per_group: 2
  },
  {
    id: '2',
    name: 'Torneio de Vôlei Universitário',
    modality: mockModalities[1],
    status: 'active' as CompetitionStatus,
    start_date: '2024-02-01',
    end_date: '2024-04-01',
    system: 'knockout' as CompetitionSystem,
    image: '/images/volleyball.jpg',
    min_members_per_team: 6,
    teams_per_group: 3,
    teams_qualified_per_group: 1
  },
  {
    id: '3',
    name: 'Liga de Futsal',
    modality: mockModalities[2],
    status: 'active' as CompetitionStatus,
    start_date: '2024-03-01',
    end_date: '2024-05-01',
    system: 'league' as CompetitionSystem,
    image: '/images/futsal.jpg',
    min_members_per_team: 7,
    teams_per_group: 4,
    teams_qualified_per_group: 2
  }
];

const mockTeams: TeamWithCompetition[] = [
  {
    id: '1',
    name: 'Equipirangaz',
    abbreviation: 'EQP',
    created_at: '2024-11-27T10:00:00Z',
    status: 'active',
    campus_code: 'CAMPUS01',
    members: [
      { user_id: 'user1' },
      { user_id: 'user2' },
      { user_id: 'user3' },
      { user_id: 'user4' },
      { user_id: 'user5' },
      { user_id: 'user6' },
      { user_id: 'user7' },
      { user_id: 'user8' }
    ],
    competition: mockCompetitions[0]
  },
  {
    id: '2',
    name: 'Amigos do baskas',
    abbreviation: 'ADB',
    created_at: '2024-11-27T14:30:00Z',
    status: 'active',
    campus_code: 'CAMPUS01',
    members: [
      { user_id: 'user9' },
      { user_id: 'user10' },
      { user_id: 'user11' },
      { user_id: 'user12' },
      { user_id: 'user13' },
      { user_id: 'user14' },
      { user_id: 'user15' },
      { user_id: 'user16' }
    ],
    competition: mockCompetitions[0]
  },
  {
    id: '3',
    name: 'Reis do Vôlei',
    abbreviation: 'RDV',
    created_at: '2024-11-28T09:15:00Z',
    status: 'active',
    campus_code: 'CAMPUS01',
    members: [
      { user_id: 'user17' },
      { user_id: 'user18' },
      { user_id: 'user19' },
      { user_id: 'user20' },
      { user_id: 'user21' },
      { user_id: 'user22' }
    ],
    competition: mockCompetitions[1]
  },
  {
    id: '4',
    name: 'Amigos do vôlei',
    abbreviation: 'ADV',
    created_at: '2024-11-28T16:45:00Z',
    status: 'active',
    campus_code: 'CAMPUS01',
    members: [
      { user_id: 'user23' },
      { user_id: 'user24' },
      { user_id: 'user25' },
      { user_id: 'user26' },
      { user_id: 'user27' },
      { user_id: 'user28' }
    ],
    competition: mockCompetitions[1]
  },
  {
    id: '5',
    name: 'Futsal Masters',
    abbreviation: 'FTM',
    created_at: '2024-11-29T11:20:00Z',
    status: 'active',
    campus_code: 'CAMPUS01',
    members: [
      { user_id: 'user29' },
      { user_id: 'user30' },
      { user_id: 'user31' },
      { user_id: 'user32' },
      { user_id: 'user33' },
      { user_id: 'user34' },
      { user_id: 'user35' }
    ],
    competition: mockCompetitions[2]
  },
  {
    id: '6',
    name: 'Amigos do fut',
    abbreviation: 'ADF',
    created_at: '2024-11-29T15:10:00Z',
    status: 'active',
    campus_code: 'CAMPUS01',
    members: [
      { user_id: 'user36' },
      { user_id: 'user37' },
      { user_id: 'user38' },
      { user_id: 'user39' },
      { user_id: 'user40' },
      { user_id: 'user41' },
      { user_id: 'user42' }
    ],
    competition: mockCompetitions[2]
  }
];

export default function TeamsPage() {
  const teams = mockTeams;
  
  const teamsByCompetition = teams.reduce((acc, team) => {
    const competitionId = team.competition?.id || 'no-competition';
    const competitionName = team.competition?.name || 'Sem Competição';
    
    if (!acc[competitionId]) {
      acc[competitionId] = {
        competition: team.competition ?? undefined,
        name: competitionName,
        teams: []
      };
    }
    acc[competitionId].teams.push(team);
    return acc;
  }, {} as Record<string, { competition: Competition | undefined, name: string, teams: TeamWithCompetition[] }>);

  const [expandedCompetitions, setExpandedCompetitions] = useState<Record<string, boolean>>({});

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
      render: (row: RowData) => (
        <div className="flex flex-col justify-start items-start gap-1">
          <span className="font-medium text-sm text-gray-800">{row.name}</span>
          <span className="font-light text-xs text-gray-500">{row.abbreviation}</span>
        </div>
      )
    },
    {
      key: 'members',
      header: 'Participantes inscritos',
      width: '1fr',
      render: (row: RowData) => (
        <span>{row.members?.length || 0} participantes</span>
      )
    },
    {
      key: 'created_at',
      header: 'Data de inscrição',
      width: '1fr',
      render: (row: RowData) => (
        <span>{new Date(row.created_at).toLocaleDateString('pt-BR')}</span>
      )
    },
    {
      key: 'actions',
      header: 'Ações',
      width: '1fr',
      render: (row: RowData) => (
        <div className="flex justify-end">
          <Link
            href={`/organizador/equipes/${row.id}`}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
            title="Visualizar equipe"
          >
            <Eye size={16} />
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl text-[#062601] font-['Baloo_2'] font-bold">
          Equipes
        </h3>
      </div>

      <div className="w-full mt-8 flex gap-4 flex-col">
        {Object.entries(teamsByCompetition).map(([competitionId, { competition, name, teams: competitionTeams }]) => {
          
          const competitionAsTeam: TeamWithCompetition = {
            id: competitionId,
            name: name,
            abbreviation: competition?.modality?.name || 'N/A',
            created_at: competition?.start_date || new Date().toISOString(),
            status: 'active',
            campus_code: competition?.modality?.campus || 'CAMPUS01',
            members: [],
            competition: competition ?? null
          };

          return (
            <TeamCard
              key={competitionId}
              team={competitionAsTeam}
              isExpanded={expandedCompetitions[competitionId] || false}
              onToggle={() => toggleCompetition(competitionId)}
              showToggle={true}
              className='bg-white rounded-2xl p-2 pl-3 pr-5 w-full'
            >
              <DataTable
                columns={tableColumns}
                data={competitionTeams}
              />
            </TeamCard>
          );
        })}
      </div>

      {teams.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-gray-500">
          <p>Nenhuma equipe encontrada.</p>
        </div>
      )}
    </div>
  );
}