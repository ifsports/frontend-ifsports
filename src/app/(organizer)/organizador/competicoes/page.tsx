'use client'

import React, { useState } from 'react';
import { Trophy } from 'lucide-react';

interface Competition {
  id: string;
  name: string;
  modality: Modality;
  status: 'not-started' | 'in-progress' | 'finished';
  start_date: string | null;
  end_date: string | null;
  system: 'league' | 'groups_elimination' | 'elimination';
  image: string;
  min_members_per_team: number;
  teams_per_group: number | null;
  teams_qualified_per_group: number | null;
  teamsCount: number;
}

interface Modality {
  id: string;
  name: string;
  campus: string;
}

export default function OrganizerCompetitionsPage() {
  const [competitions] = useState<Competition[]>([
    {
      id: '1',
      name: 'Basquete masculino',
      modality: { id: '1', name: 'Basquete', campus: 'Campus Central' },
      status: 'in-progress',
      start_date: '2024-11-27',
      end_date: '2024-12-15',
      system: 'groups_elimination',
      image: '/images/basquete-masculino.jpg',
      min_members_per_team: 8,
      teams_per_group: 4,
      teams_qualified_per_group: 2,
      teamsCount: 20
    },
    {
      id: '2',
      name: 'Vôlei feminino',
      modality: { id: '2', name: 'Vôlei', campus: 'Campus Central' },
      status: 'not-started',
      start_date: '2024-12-01',
      end_date: '2024-12-20',
      system: 'league',
      image: '/images/volei-feminino.jpg',
      min_members_per_team: 6,
      teams_per_group: null,
      teams_qualified_per_group: null,
      teamsCount: 16
    },
    {
      id: '3',
      name: 'Futsal masculino',
      modality: { id: '3', name: 'Futsal', campus: 'Campus Central' },
      status: 'finished',
      start_date: '2024-10-15',
      end_date: '2024-11-15',
      system: 'elimination',
      image: '/images/futsal-masculino.jpg',
      min_members_per_team: 10,
      teams_per_group: null,
      teams_qualified_per_group: null,
      teamsCount: 12
    },
    {
      id: '4',
      name: 'Vôlei de areia misto',
      modality: { id: '2', name: 'Vôlei', campus: 'Campus Central' },
      status: 'in-progress',
      start_date: '2024-11-20',
      end_date: '2024-12-10',
      system: 'elimination',
      image: '/images/volei-areia-misto.jpg',
      min_members_per_team: 4,
      teams_per_group: null,
      teams_qualified_per_group: null,
      teamsCount: 8
    }
  ]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Não definido';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusText = (status: Competition['status']) => {
    switch (status) {
      case 'not-started':
        return 'Não iniciado';
      case 'in-progress':
        return 'Em andamento';
      case 'finished':
        return 'Finalizado';
      default:
        return status;
    }
  };

  const getStatusColor = (status: Competition['status']) => {
    switch (status) {
      case 'not-started':
        return 'text-yellow-600 bg-yellow-50';
      case 'in-progress':
        return 'text-cyan-600 bg-cyan-50';
      case 'finished':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="w-full">
      <div className="pt-4 pr-5 pb-0 pl-3 rounded-2xl bg-white">

        <div className="flex items-center gap-2 mb-5">
          <div className="h-6 w-6 border border-gray-300 rounded-lg flex justify-center items-center">
            <Trophy size={14} className='text-[#4CAF50]' />
          </div>
          <span className="text-sm font-medium">Competições</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[47rem] md:min-w-full">
            <thead>
              <tr className="grid grid-cols-5 gap-12 items-center px-4 py-2 bg-gray-50 text-gray-400 border border-gray-300 rounded-lg">
                <th className="text-left">Nome da competição</th>
                <th className="text-left">Status</th>
                <th className="text-left">Equipes inscritas</th>
                <th className="text-left">Data início</th>
                <th className="text-left">Ações</th>
              </tr>
            </thead>
            <tbody className="mt-5">
              {competitions.map((competition, index) => (
                <tr 
                  key={competition.id}
                  className={`grid grid-cols-5 gap-12 px-4 py-4 text-gray-800 ${
                    index !== competitions.length - 1 ? 'border-b border-gray-300' : ''
                  }`}
                >
                  <td className="flex flex-col justify-start items-start gap-1">
                    <span className="font-medium text-sm">{competition.name}</span>
                    <span className="font-light text-xs text-gray-600">{competition.modality.name}</span>
                  </td>
                  
                  <td className="flex items-center">
                    <span className={`px-4 py-2 rounded-lg font-medium text-xs ${getStatusColor(competition.status)}`}>
                      {getStatusText(competition.status)}
                    </span>
                  </td>
                  
                  <td className="flex items-center">
                    {competition.teamsCount} equipes
                  </td>
                  
                  <td className="flex items-center">
                    {formatDate(competition.start_date)}
                  </td>
                  
                  <td className="flex items-center">
                    <a 
                      href={`/competicoes/${competition.id}`}
                      className="text-blue-500 font-medium text-sm no-underline hover:text-blue-600 transition-colors"
                    >
                      Gerenciar competição
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}