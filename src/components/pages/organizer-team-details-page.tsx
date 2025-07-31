'use client'

import React from 'react';
import { Users, Trophy, ArrowLeft, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import type { Competition } from '@/types/competition';

interface TeamMember {
  user_id: string;
  name?: string;
  email?: string;
  course?: string;
}

interface TeamWithCompetition {
  id: string;
  name: string;
  abbreviation: string;
  created_at: string;
  status: 'active' | 'inactive';
  campus_code: string;
  members: TeamMember[];
  competition: Competition;
}

const mockTeams: TeamWithCompetition[] = [
  {
    id: '1',
    name: 'Equipirangaz',
    abbreviation: 'EQP',
    created_at: '2024-11-27T10:00:00Z',
    status: 'active',
    campus_code: 'CAMPUS01',
    members: [
      { user_id: 'user1', name: 'João Silva', email: 'joao.silva@email.com', course: 'Engenharia' },
      { user_id: 'user2', name: 'Maria Santos', email: 'maria.santos@email.com', course: 'Administração' },
      { user_id: 'user3', name: 'Pedro Costa', email: 'pedro.costa@email.com', course: 'Direito' },
      { user_id: 'user4', name: 'Ana Oliveira', email: 'ana.oliveira@email.com', course: 'Medicina' },
      { user_id: 'user5', name: 'Carlos Pereira', email: 'carlos.pereira@email.com', course: 'Engenharia' },
      { user_id: 'user6', name: 'Luciana Lima', email: 'luciana.lima@email.com', course: 'Psicologia' },
      { user_id: 'user7', name: 'Rafael Souza', email: 'rafael.souza@email.com', course: 'Educação Física' },
      { user_id: 'user8', name: 'Fernanda Alves', email: 'fernanda.alves@email.com', course: 'Nutrição' }
    ],
    competition: {
      id: '1',
      name: 'Campeonato de Basquete 2024',
      modality: { id: '1', name: 'Basquete', campus: 'PF' },
      status: "in-progress",
      start_date: '2024-01-15',
      end_date: '2024-03-15',
      system: 'league',
      image: '/images/basketball.jpg',
      min_members_per_team: 8,
      teams_per_group: 4,
      teams_qualified_per_group: 2
    }
  },
  {
    id: '2',
    name: 'Amigos do baskas',
    abbreviation: 'ADB',
    created_at: '2024-11-27T14:30:00Z',
    status: 'active',
    campus_code: 'CAMPUS01',
    members: [
      { user_id: 'user9', name: 'Bruno Martins', email: 'bruno.martins@email.com', course: 'Ciência da Computação' },
      { user_id: 'user10', name: 'Camila Rocha', email: 'camila.rocha@email.com', course: 'Design' },
      { user_id: 'user11', name: 'Diego Ferreira', email: 'diego.ferreira@email.com', course: 'Engenharia' },
      { user_id: 'user12', name: 'Eduarda Silva', email: 'eduarda.silva@email.com', course: 'Jornalismo' },
      { user_id: 'user13', name: 'Felipe Santos', email: 'felipe.santos@email.com', course: 'Economia' },
      { user_id: 'user14', name: 'Gabriela Costa', email: 'gabriela.costa@email.com', course: 'Letras' },
      { user_id: 'user15', name: 'Henrique Lima', email: 'henrique.lima@email.com', course: 'História' },
      { user_id: 'user16', name: 'Isabela Moura', email: 'isabela.moura@email.com', course: 'Fisioterapia' }
    ],
    competition: {
      id: '1',
      name: 'Campeonato de Basquete 2024',
      modality: { id: '1', name: 'Basquete', campus: 'PF' },
      status: 'in-progress',
      start_date: '2024-01-15',
      end_date: '2024-03-15',
      system: 'league',
      image: '/images/basketball.jpg',
      min_members_per_team: 8,
      teams_per_group: 4,
      teams_qualified_per_group: 2
    }
  },
  {
    id: '3',
    name: 'Reis do Vôlei',
    abbreviation: 'RDV',
    created_at: '2024-11-28T09:15:00Z',
    status: 'active',
    campus_code: 'CAMPUS01',
    members: [
      { user_id: 'user17', name: 'Lucas Barbosa', email: 'lucas.barbosa@email.com', course: 'Educação Física' },
      { user_id: 'user18', name: 'Mariana Cardoso', email: 'mariana.cardoso@email.com', course: 'Enfermagem' },
      { user_id: 'user19', name: 'Nicolas Mendes', email: 'nicolas.mendes@email.com', course: 'Arquitetura' },
      { user_id: 'user20', name: 'Olivia Nascimento', email: 'olivia.nascimento@email.com', course: 'Veterinária' },
      { user_id: 'user21', name: 'Paulo Ribeiro', email: 'paulo.ribeiro@email.com', course: 'Matemática' },
      { user_id: 'user22', name: 'Quezia Torres', email: 'quezia.torres@email.com', course: 'Química' }
    ],
    competition: {
      id: '2',
      name: 'Torneio de Vôlei Universitário',
      modality: { id: '2', name: 'Vôlei', campus: 'PF' },
      status: 'in-progress',
      start_date: '2024-02-01',
      end_date: '2024-04-01',
      system: 'elimination',
      image: '/images/volleyball.jpg',
      min_members_per_team: 6,
      teams_per_group: 3,
      teams_qualified_per_group: 1
    }
  }
];

interface OrganizerTeamDetailsPageProps {
  teamId: string;
}

export default function OrganizerTeamDetailsPage({ teamId }: OrganizerTeamDetailsPageProps) {
  const team = mockTeams.find(t => t.id === teamId);

  if (!team) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href="/organizador/equipes"
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl text-[#062601] font-['Baloo_2'] font-bold">
            Equipe não encontrada
          </h1>
        </div>
        <div className="bg-white rounded-2xl p-6">
          <p className="text-gray-600">A equipe solicitada não foi encontrada.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusText = (status: string) => {
    return status === 'active' ? 'Ativa' : 'Inativa';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'text-[#4CAF50]' 
      : 'text-red-600 bg-red-50';
  };

  return (
    <div className="w-full">

      <div className="flex items-center gap-4 mb-6">
        <Link href="/organizador/equipes" className="h-4 flex items-center text-black">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold font-['Baloo_2'] text-[#062601]">
          {team.name}
        </h1>
      </div>

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
            <span className="font-medium text-sm">{team.abbreviation}</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Status</span>
            <span className={`font-medium text-sm w-fit ${getStatusColor(team.status)}`}>
              {getStatusText(team.status)}
            </span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Data de Criação</span>
            <span className="font-medium text-sm">{formatDate(team.created_at)}</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Campus</span>
            <span className="font-medium text-sm">{team.campus_code}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-6 border border-gray-300 rounded-lg flex justify-center items-center">
            <Users size={14} className='text-[#4CAF50]' />
          </div>
          <span className="text-sm font-medium">
            Participantes ({team.members.length})
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
              {team.members.map((member, index) => (
                <tr 
                  key={member.user_id}
                  className={`grid grid-cols-3 gap-4 px-4 py-3 text-gray-800 ${
                    index !== team.members.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <td className="font-medium">
                    {member.name || `Participante ${index + 1}`}
                  </td>
                  <td className="text-gray-600">
                    {member.course || 'Não informado'}
                  </td>
                  <td className="text-gray-500 font-mono text-xs">
                    {member.user_id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {team.members.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <Users size={48} className="mb-2 text-gray-300" />
            <p>Nenhum participante cadastrado nesta equipe.</p>
          </div>
        )}
      </div>
    </div>
  );
}