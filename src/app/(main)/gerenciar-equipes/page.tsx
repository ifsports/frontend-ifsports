'use client'

import React, { useEffect, useState, useMemo } from 'react';
import { Trash2, UserPlus } from 'lucide-react';
import CustomDialog from '@/components/shared/custom-dialog';
import InputField from '@/components/shared/input-field';
import TextAreaField from '@/components/shared/text-area-field';
import ActionButton from '@/components/shared/action-button';
import TeamCard from '@/components/shared/tables/team-card';
import DataTable from '@/components/shared/tables/data-table';
import { addTeamMemberFromTeam, deleteTeam, deleteTeamMemberFromTeam, getTeamFromCampusAuth } from '@/lib/requests/teams';
import type { Team, TeamWithCompetition } from '@/types/team';
import { getDetailsUserByIds } from '@/lib/requests/auth';
import { User } from '@/types/user';
import { toast } from 'sonner';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addMemberToTeam, removeMemberFromTeam, removeTeamSchema, type addMemberToTeamData, type removeMemberFromTeamData, type removeTeamData } from '@/lib/schemas/manage-teams-schema';
import Link from 'next/link';
import { getTeamInCompetition } from '@/lib/requests/competitions';

type DialogType = 'addPlayer' | 'removePlayer' | 'removeTeam';

interface FormattedMember {
  name: string;
  enrollment: string;
  course: string;
  user_id: string;
  [key: string]: any;
}

export default function TeamManagement() {
  const [teams, setTeams] = useState<TeamWithCompetition[] | []>([]);
  const [members, setMembers] = useState<User[] | []>([]);
  const [activeTeams, setActiveTeams] = useState<Record<number, boolean>>({});
  const [dialogs, setDialogs] = useState({
    removePlayer: false,
    addPlayer: false,
    removeTeam: false
  });
  const [selectedPlayer, setSelectedPlayer] = useState<FormattedMember | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const addPlayerForm = useForm<addMemberToTeamData>({
    resolver: zodResolver(addMemberToTeam),
    defaultValues: { enrollment: '' }
  });

  const removePlayerForm = useForm<removeMemberFromTeamData>({
    resolver: zodResolver(removeMemberFromTeam),
    defaultValues: { reason: '' }
  });

  const removeTeamForm = useForm<removeTeamData>({
    resolver: zodResolver(removeTeamSchema),
    defaultValues: { reason: '' }
  });

  async function handleSubmit(type: DialogType, data?: any) {
    if (type === 'addPlayer') {
      const data = addPlayerForm.getValues();

      const response = await addTeamMemberFromTeam({
        team_id: selectedTeam?.id || '',
        data: { user_id: data.enrollment }
      });

      if (!response.success) {
        toast.error(response.error);
        return;
      }

      toast.success('Solicitação enviada com sucesso!');

      addPlayerForm.reset();
      closeDialog(type);
    } else if (type === 'removePlayer') {
      const data = removePlayerForm.getValues();
      
      const response = await deleteTeamMemberFromTeam({
        team_id: selectedTeam?.id || '',
        team_member_id: selectedPlayer?.enrollment || '',
        data: { reason: data.reason }
      });

      if (!response.success) {
        toast.error(response.error);
        return;
      }

      toast.success('Solicitação enviada com sucesso!');

      removePlayerForm.reset();
      closeDialog(type);
    } else if (type === 'removeTeam') {
      const data = removeTeamForm.getValues();
      
      const response = await deleteTeam({
        team_id: selectedTeam?.id || '',
        data: { reason: data.reason }
      });

      if (!response.success) {
        toast.error(response.error);
        return;
      }

      toast.success('Solicitação enviada com sucesso!');

      removeTeamForm.reset();
      closeDialog(type);
    }
  }

  async function getTeams() {
      const response = await getTeamFromCampusAuth();
      
      if (!response.data || !Array.isArray(response.data)) {
        toast.error('Dados inválidos recebidos ao buscar equipes.');
        return;
      }

      setTeams(response.data);

      const teamPromises = response.data.map(team => getTeamCompetition(team.id));
      const teamCompetitions = await Promise.all(teamPromises);
      const updatedTeams = response.data.map((team, index) => ({
        ...team,
        competition: teamCompetitions[index]?.data?.competition || null
      }));
      setTeams(updatedTeams);
  }

  async function getTeamCompetition(teamId: string) {
    const response = await getTeamInCompetition(teamId);

    if (!response.success) {
      toast.error(response.error);
      return null;
    }

    return response.data;
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

    if (!response.success) {
      toast.error(response.error);
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

  const openDialog = (type: DialogType, player: FormattedMember | null = null, team: Team | null = null) => {
    if (player) {
      setSelectedPlayer(player);
    }
    setSelectedTeam(team);
    setDialogs(prev => ({ ...prev, [type]: true }));
  };

  const closeDialog = (type: DialogType) => {
    setDialogs(prev => ({ ...prev, [type]: false }));
    setSelectedPlayer(null);
    setSelectedTeam(null);
    if (type === 'addPlayer') {
      addPlayerForm.reset();
    } else if (type === 'removePlayer') {
      removePlayerForm.reset();
    } else if (type === 'removeTeam') {
      removeTeamForm.reset();
    }
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
        <Link href="/cadastrar-equipe" className="border-none py-3 px-6 rounded-lg bg-[#4CAF50] text-white font-semibold cursor-pointer max-[530px]:text-sm">
          Cadastrar nova equipe
        </Link>
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
            onClick: () => openDialog('addPlayer', null, team),
            className: "text-[#4CAF50] cursor-pointer py-2 px-4 border border-gray-300 rounded-lg bg-white flex items-center gap-2 font-semibold text-xs",
            text: "Adicionar novo membro",
            icon: UserPlus
          },
          {
            onClick: () => openDialog('removeTeam', null, team),
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
                  openDialog('removePlayer', row as FormattedMember, team);
                }
              }}
            />
          </TeamCard>
        );
      })}

      <CustomDialog
        open={dialogs.removePlayer}
        onClose={() => {
          closeDialog('removePlayer');
          removePlayerForm.reset();
        }}
        title={`Excluir ${selectedPlayer?.name || ''} da equipe?`}
      >
        <div className='flex flex-col gap-6'>
          <div>
            <TextAreaField
              id="remove-player-reason"
              label="Motivo da alteração"
              placeholder="Explique o motivo..."
              {...removePlayerForm.register('reason')}
            />
            {removePlayerForm.formState.errors.reason && (
              <p className="text-red-600 text-sm mt-2">
                {removePlayerForm.formState.errors.reason.message}
              </p>
            )}
          </div>
          
          <ActionButton
            type="button"
            variant="danger"
            onClick={async () => {
              const isValid = await removePlayerForm.trigger();
              
              if (!isValid) {
                return;
              }

              await handleSubmit('removePlayer');
            }}
          >
            Excluir participante
          </ActionButton>
        </div>
      </CustomDialog>

      <CustomDialog
        open={dialogs.addPlayer}
        onClose={() => {
          closeDialog('addPlayer');
          addPlayerForm.reset();
        }}
        title="Adicionar membro"
      >
        <form className='flex flex-col gap-6' onSubmit={addPlayerForm.handleSubmit((data) => handleSubmit('addPlayer', data))}>
          <div>
            <InputField
              id="add-player-enrollment"
              label="Matrícula"
              placeholder="Matrícula"
              {...addPlayerForm.register('enrollment')}
            />
            {addPlayerForm.formState.errors.enrollment && (
              <p className="text-red-600 text-sm mt-2">{addPlayerForm.formState.errors.enrollment.message}</p>
            )}
          </div>
          <ActionButton type="submit" variant="primary">
            Adicionar membro
          </ActionButton>
        </form>
      </CustomDialog>

      <CustomDialog
        open={dialogs.removeTeam}
        onClose={() => {
          closeDialog('removeTeam');
          removeTeamForm.reset();
        }}
        title={`Excluir equipe ${selectedTeam?.name}?`}
      >
        <form className='flex flex-col gap-6' onSubmit={removeTeamForm.handleSubmit((data) => handleSubmit('removeTeam', data))}>
          <div>
            <TextAreaField
              id="remove-team-reason"
              label="Motivo da alteração"
              placeholder="Explique o motivo..."
              {...removeTeamForm.register('reason')}
            />
            {removeTeamForm.formState.errors.reason && (
                <p className="text-red-600 text-sm mt-2">{removeTeamForm.formState.errors.reason.message}</p>
            )}
          </div>
          <ActionButton
            type="submit"
            variant="danger"
            className="bg-red-500 py-5 border-0 rounded-md text-center text-white mt-1 cursor-pointer font-semibold w-full"
          >
            Excluir equipe
          </ActionButton>
        </form>
      </CustomDialog>
    </div>
  );
};
