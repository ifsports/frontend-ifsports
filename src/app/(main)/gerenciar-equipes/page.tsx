'use client'

import React, { useEffect, useState, useMemo } from 'react';
import { X, Plus, Trash2, ChevronDown, UserPlus } from 'lucide-react';
import CustomDialog from '@/components/shared/custom-dialog';
import InputField from '@/components/shared/input-field';
import TextAreaField from '@/components/shared/text-area-field';
import ActionButton from '@/components/shared/action-button';
import TeamCard from '@/components/shared/tables/team-card';
import DataTable from '@/components/shared/tables/data-table';
import { getTeamFromCampusAuth } from '@/lib/requests/teams';
import type { Team } from '@/types/team';
import { getDetailsUserByIds } from '@/lib/requests/auth';
import { User } from '@/types/user';
import { toast } from 'sonner';

type DialogType = 'addPlayer' | 'removePlayer' | 'removeTeam';

interface FormattedMember {
  name: string;
  enrollment: string;
  course: string;
  user_id: string;
  [key: string]: any;
}

export default function TeamManagement() {
  const [teams, setTeams] = useState<Team[] | []>([]);
  const [members, setMembers] = useState<User[] | []>([]);
  const [activeTeams, setActiveTeams] = useState<Record<number, boolean>>({});
  const [dialogs, setDialogs] = useState({
    removePlayer: false,
    addPlayer: false,
    removeTeam: false
  });
  const [selectedPlayer, setSelectedPlayer] = useState<FormattedMember | null>(null);
  const [selectedTeam, setSelectedTeam] = useState('');

  // Formulários
  const [formData, setFormData] = useState({
    addPlayer: { name: '', enrollment: '', course: '' },
    removePlayer: { reason: '' },
    removeTeam: { reason: '' }
  });

  const handleInputChange = (dialogType: DialogType, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [dialogType]: {
        ...prev[dialogType],
        [field]: value
      }
    }));
  };

  const handleSubmit = (type: DialogType) => {
    console.log(`Enviando ${type}:`, formData[type]);
    closeDialog(type);
  };

  async function getTeams() {
    const response = await getTeamFromCampusAuth();

    if (!response.data || !Array.isArray(response.data)) {
      toast.error('Dados inválidos recebidos ao buscar equipes.');
      return;
    }

    setTeams(response.data as Team[]);
  }

  useEffect(() => {
    getTeams();
  }, []);

  useEffect(() => {
    if (!teams.length) return;

    const ids = teams.flatMap(team => team.members.map(member => member.user_id));

    if (ids.length === 0) return;

    getPlayers({ ids });
  }, [teams]);

  async function getPlayers(data: { ids: string[] }) {
    const response = await getDetailsUserByIds(data);

    if (!response.data || !Array.isArray(response.data)) {
      toast.error('Dados inválidos recebidos ao buscar membros.');
      return;
    }

    setMembers(response.data as User[]);
  }

  const membersById = useMemo(() => {
    const map = new Map<string, User>();
    members.forEach(user => {
      if (user.matricula) map.set(user.matricula, user);
      if (user.id) map.set(user.id, user);
    });
    return map;
  }, [members]);

  const toggleTeam = (teamIndex: number) => {
    setActiveTeams(prev => ({
      ...prev,
      [teamIndex]: !prev[teamIndex]
    }));
  };

  const openDialog = (type: DialogType, player: FormattedMember | null = null, teamName = '') => {
    if (player) {
      setSelectedPlayer(player);
    }
    setSelectedTeam(teamName);
    setDialogs(prev => ({ ...prev, [type]: true }));
  };

  const closeDialog = (type: DialogType) => {
    setDialogs(prev => ({ ...prev, [type]: false }));
    setSelectedPlayer(null);
    setSelectedTeam('');
    setFormData(prev => ({
      ...prev,
      [type]: type === 'addPlayer'
        ? { name: '', enrollment: '', course: '' }
        : { reason: '' }
    }));
  };

  const tableColumns = [
    {
      key: 'name',
      header: 'Nome do membro',
      width: '2fr'
    },
    {
      key: 'enrollment',
      header: 'Matrícula',
      width: '1fr'
    },
    {
      key: 'course',
      header: 'Curso',
      width: '1fr'
    },
    {
      key: 'actions',
      header: 'Ações',
      width: '1fr',
      render: (row: any, rowIndex: number, onRowAction?: any) => (
        <button
          onClick={() => onRowAction && onRowAction('remove', row, rowIndex)}
          className="border-none bg-transparent"
          title="Remover jogador"
        >
          <Trash2 className="h-4 w-4 text-red-500 cursor-pointer" />
        </button>
      )
    }
  ];

  return (
    <div className="w-full py-12">

      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold font-title text-[#062601] leading-[1.3]">
          Gerenciar equipes
        </h1>
        <p className="text-gray-600 text-base leading-[1.3] max-w-[39.375rem] w-full">
          Nesta seção, você terá a possibilidade de gerenciar todas as suas equipes
          para o Intercurso. Será possível cadastrar suas equipes em diferentes
          competições, adicionar e organizar os membros em cada uma delas, além de
          acompanhar e atualizar as informações dos participantes de forma prática e
          eficiente. Clique na sua equipe, e gerencie os participantes de cada
          competição
        </p>
      </div>

      <div className="flex flex-row w-full justify-between items-start mt-12 max-md:flex-col max-md:gap-4">
        <h1 className="text-2xl font-bold font-title text-[#062601] leading-[1.3]">
          Minhas Equipes
        </h1>
        <button className="border-none py-3 px-6 rounded-lg bg-[#4CAF50] text-white font-semibold cursor-pointer max-[530px]:text-sm">
          Cadastrar nova equipe
        </button>
      </div>

      {teams.map((team, teamIndex) => {
        const formattedMembers: FormattedMember[] = team.members.map(member => {
          const fullData = membersById.get(member.user_id || '');

          if (fullData && fullData.nome && fullData.matricula && fullData.curso) {
            return {
              name: fullData.nome,
              enrollment: fullData.matricula,
              course: fullData.curso,
              user_id: fullData.id || member.user_id,
              ...fullData
            };
          }

          return {
            name: 'Nome não encontrado',
            enrollment: member.user_id || '',
            course: 'N/A',
            user_id: member.user_id || ''
          };
        });

        const teamActions = [
          {
            onClick: () => openDialog('addPlayer', null, team.name),
            className: "text-[#4CAF50] cursor-pointer py-2 px-4 border border-gray-300 rounded-lg bg-white flex items-center gap-2 font-semibold text-xs",
            text: "Adicionar novo membro",
            icon: UserPlus
          },
          {
            onClick: () => openDialog('removeTeam', null, team.name),
            className: "text-red-500 cursor-pointer py-2 px-4 border border-gray-300 rounded-lg bg-white flex items-center gap-2 font-semibold text-xs",
            text: "Excluir equipe",
            icon: Trash2
          }
        ];

        return (
          <TeamCard
            key={teamIndex}
            team={team}
            isExpanded={activeTeams[teamIndex]}
            onToggle={() => toggleTeam(teamIndex)}
            actions={teamActions}
          >
            <DataTable
              columns={tableColumns}
              data={formattedMembers}
              onRowAction={(actionType: string, row: any, rowIndex: number) => {
                if (actionType === 'remove') {
                  openDialog('removePlayer', row as FormattedMember);
                }
              }}
            />
          </TeamCard>
        );
      })}

      <CustomDialog
        open={dialogs.removePlayer}
        onClose={() => closeDialog('removePlayer')}
        title={`Excluir ${selectedPlayer?.name || ''} da equipe?`}
      >
        <TextAreaField
          id="remove-player-reason"
          label="Motivo da alteração"
          placeholder="Explique o motivo..."
          value={formData.removePlayer.reason}
          onChange={(e) => handleInputChange('removePlayer', 'reason', e.target.value)}
        />
        <ActionButton onClick={() => handleSubmit('removePlayer')} variant="danger">
          Excluir participante
        </ActionButton>
      </CustomDialog>

      <CustomDialog
        open={dialogs.addPlayer}
        onClose={() => closeDialog('addPlayer')}
        title="Adicionar membro"
      >
        <InputField
          id="add-player-enrollment"
          label="Matrícula"
          placeholder="Matrícula"
          value={formData.addPlayer.enrollment}
          onChange={(e) => handleInputChange('addPlayer', 'enrollment', e.target.value)}
        />
        <ActionButton onClick={() => handleSubmit('addPlayer')} variant="primary">
          Adicionar membro
        </ActionButton>
      </CustomDialog>

      <CustomDialog
        open={dialogs.removeTeam}
        onClose={() => closeDialog('removeTeam')}
        title={`Excluir equipe ${selectedTeam}?`}
      >
        <TextAreaField
          id="remove-team-reason"
          label="Motivo da alteração"
          placeholder="Explique o motivo..."
          value={formData.removeTeam.reason}
          onChange={(e) => handleInputChange('removeTeam', 'reason', e.target.value)}
        />
        <ActionButton
          onClick={() => handleSubmit('removeTeam')}
          variant="danger"
          className="bg-red-500 py-5 border-0 rounded-md text-center text-white mt-1 cursor-pointer font-semibold w-full"
        >
          Excluir equipe
        </ActionButton>
      </CustomDialog>
    </div>
  );
};
