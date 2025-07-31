"use client"

import React, { useState } from 'react';
import { Bell, Users, User } from 'lucide-react';
import CustomDialog from '@/components/shared/custom-dialog';
import TextAreaField from '@/components/shared/text-area-field';
import ActionButton from '@/components/shared/action-button';
import type { TeamMember } from '@/types/team';
import { RequestStatusEnum, RequestTypeEnum, type Request } from '@/types/requests';

export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  created_at: string;
  status: 'pendent' | 'active' | 'closed';
  campus_code: string;
  members: TeamMember[];
}

export interface Competition {
  id: string;
  name: string;
}

export interface TeamWithCompetition extends Team {
  competition: Competition | null;
}

export interface Competition {
  id: string;
  name: string;
}

export interface Player {
  user_id: string;
  name: string;
  registration: string;
  course: string;
}

// 3. Dados Mockados (sem alterações)
const mockAllPlayers: Player[] = [
    { user_id: '1', name: 'Gustavo Emanuel', registration: '20231094040005', course: 'ADS' },
    { user_id: '2', name: 'Ana Carolina', registration: '20221094040010', course: 'Engenharia' },
    { user_id: '3', name: 'Lucas Souza', registration: '20241094040023', course: 'Direito' },
    { user_id: '4', name: 'Mariana Costa', registration: '20211094040008', course: 'Medicina' },
    { user_id: '5', name: 'Pedro Alves', registration: '20231094040015', course: 'ADS' },
    { user_id: '6', name: 'Juliana Ferreira', registration: '20221094040001', course: 'Psicologia' },
];

const mockTeamRequests: Request[] = [
  {
    id: 'req1',
    request_type: RequestTypeEnum.APPROVE_TEAM,
    team: { id: 'team1', name: 'Equipirangaz', abbreviation: 'EQP', created_at: '2025-07-20', status: 'pendent', campus_code: 'IFG-IPORÁ-FUTSAL-MASC', members: [{ user_id: '1' }, { user_id: '2' }, { user_id: '3' }, { user_id: '4' }, { user_id: '5' }], competition: { id: 'comp1', name: 'Futsal Masculino' } },
    status: RequestStatusEnum.PENDENT,
    created_at: '2025-07-20'
  },
  {
    id: 'req2',
    request_type: RequestTypeEnum.DELETE_TEAM,
    team: { id: 'team2', name: 'As Poderosas', abbreviation: 'POD', created_at: '2025-06-15', status: 'active', campus_code: 'IFG-IPORÁ-VOLEI-FEM', members: [{ user_id: '6' }, { user_id: '4' }], competition: { id: 'comp2', name: 'Vôlei Feminino' } },
    reason: 'A equipe decidiu não participar mais da competição.',
    status: RequestStatusEnum.PENDENT,
    created_at: '2025-07-22'
  }
];

const mockPlayerRequests: Request[] = [
  {
    id: 'req3',
    request_type: RequestTypeEnum.REMOVE_TEAM_MEMBER,
    team: { id: 'team1', name: 'Equipirangaz', abbreviation: 'EQP', created_at: '2025-07-20', status: 'pendent', campus_code: 'IFG-IPORÁ-FUTSAL-MASC', members: [{ user_id: '1' }, { user_id: '2' }, { user_id: '3' }, { user_id: '4' }, { user_id: '5' }], competition: { id: 'comp1', name: 'Futsal Masculino' } },
    user: { user_id: '1', name: 'Gustavo Emanuel', registration: '20231094040005', course: 'ADS' },
    reason: 'Ele não quer mais jogar!',
    status: RequestStatusEnum.PENDENT,
    created_at: '2025-07-25'
  },
  {
    id: 'req4',
    request_type: RequestTypeEnum.ADD_TEAM_MEMBER,
    team: { id: 'team2', name: 'As Poderosas', abbreviation: 'POD', created_at: '2025-06-15', status: 'active', campus_code: 'IFG-IPORÁ-VOLEI-FEM', members: [{ user_id: '6' }, { user_id: '4' }], competition: { id: 'comp2', name: 'Vôlei Feminino' } },
    user: { user_id: '2', name: 'Ana Carolina', registration: '20221094040010', course: 'Engenharia' },
    reason: 'Precisamos de uma nova jogadora para completar o time.',
    status: RequestStatusEnum.PENDENT,
    created_at: '2025-07-28'
  }
];

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState<'teams' | 'players'>('teams');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [decision, setDecision] = useState<'approve' | 'deny' | ''>('');
  const [rejectionReason, setRejectionReason] = useState('');

  const getRequestTypeLabel = (type: RequestTypeEnum) => {
    switch (type) {
      case RequestTypeEnum.APPROVE_TEAM:
        return 'Aprovar equipe';
      case RequestTypeEnum.DELETE_TEAM:
        return 'Excluir equipe';
      case RequestTypeEnum.ADD_TEAM_MEMBER:
        return 'Adicionar membro';
      case RequestTypeEnum.REMOVE_TEAM_MEMBER:
        return 'Remover membro';
      default:
        return type;
    }
  };

  /**
   * NOVA FUNÇÃO: Retorna as classes de estilo com base no tipo de solicitação.
   */
  const getRequestTypeStyle = (type: RequestTypeEnum) => {
    switch (type) {
      case RequestTypeEnum.APPROVE_TEAM:
      case RequestTypeEnum.ADD_TEAM_MEMBER:
        return 'text-green-700 bg-green-100'; // Estilo verde para ações positivas
      
      case RequestTypeEnum.DELETE_TEAM:
      case RequestTypeEnum.REMOVE_TEAM_MEMBER:
        return 'text-red-700 bg-red-100'; // Estilo vermelho para ações negativas
      
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const handleShowRequest = (request: Request) => {
    setSelectedRequest(request);
    setDialogOpen(true);
    setDecision('');
    setRejectionReason('');
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRequest(null);
    setDecision('');
    setRejectionReason('');
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!decision) {
      alert("Por favor, selecione 'Aprovar' ou 'Negar' a solicitação.");
      return;
    }
    if (decision === 'deny' && !rejectionReason) {
      alert('Por favor, forneça um motivo para negar a solicitação.');
      return;
    }
    console.log('Submitting:', {
      requestId: selectedRequest?.id,
      decision,
      rejectionReason: decision === 'deny' ? rejectionReason : undefined
    });
    handleCloseDialog();
  };

  const currentRequests = activeTab === 'teams' ? mockTeamRequests : mockPlayerRequests;

  const renderDialogContent = () => {
    if (!selectedRequest) return null;

    const isPlayerRequest = selectedRequest.request_type === RequestTypeEnum.ADD_TEAM_MEMBER || selectedRequest.request_type === RequestTypeEnum.REMOVE_TEAM_MEMBER;
    const dialogTitle = getRequestTypeLabel(selectedRequest.request_type);

    const memberDetails = selectedRequest.team.members
      .map(member => mockAllPlayers.find(p => p.user_id === member.user_id))
      .filter((p): p is Player => p !== undefined);

    return (
      <CustomDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        title={dialogTitle}
      >
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-3 gap-4">
            {isPlayerRequest ? (
              <>
                <div className="flex flex-col gap-2">
                  <p className="font-bold">{selectedRequest.request_type === RequestTypeEnum.ADD_TEAM_MEMBER ? "Membro a ser adicionado" : "Membro a ser excluído"}</p>
                  <span>{selectedRequest.user?.name}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-bold">Equipe</p>
                  <span>{selectedRequest.team.name}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-bold">Competição</p>
                  <span>{selectedRequest.team.competition?.name ?? 'N/A'}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <p className="font-bold">Nome da equipe</p>
                  <span>{selectedRequest.team.name} ({selectedRequest.team.abbreviation})</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-bold">Competição</p>
                  <span>{selectedRequest.team.competition?.name ?? 'N/A'}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-bold">Número de membros</p>
                  <span>{selectedRequest.team.members.length} membros</span>
                </div>
              </>
            )}
          </div>

          {selectedRequest.request_type === RequestTypeEnum.APPROVE_TEAM && (
            <div className="flex flex-col gap-2">
              <p className="font-bold">Membros</p>
              <div className="p-4 rounded-lg bg-white pb-0">
                <div className="h-64 overflow-y-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-gray-50 border border-gray-200 rounded-lg">
                      <tr className="grid grid-cols-[1.5fr_1fr_1fr] gap-4 p-2 text-gray-400 text-sm">
                        <th className="text-left">Nome do participante</th>
                        <th className="text-left">Matrícula</th>
                        <th className="text-left">Curso</th>
                      </tr>
                    </thead>
                    <tbody>
                      {memberDetails.map((member, index) => (
                        <tr
                          key={member.user_id}
                          className={`grid grid-cols-[1.5fr_1fr_1fr] gap-4 p-4 text-sm ${index !== memberDetails.length - 1 ? 'border-b border-gray-200' : ''}`}
                        >
                          <td>{member.name}</td>
                          <td>{member.registration}</td>
                          <td>{member.course}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {selectedRequest.reason && selectedRequest.request_type !== RequestTypeEnum.ADD_TEAM_MEMBER && (
            <div className="flex flex-col gap-2">
              <span className="font-bold">Motivo da solicitação</span>
              <div className="p-4 bg-white rounded-lg min-h-[8rem] flex items-start">
                <p>{selectedRequest.reason}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-8">
            <TextAreaField
              id="rejection-reason"
              label="Caso seja negado, dê um motivo (obrigatório)"
              placeholder="Explique o motivo..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              disabled={decision !== 'deny'}
            />
            <div className="flex gap-4 justify-between items-center">
              <label className="cursor-pointer p-4 w-full bg-white rounded-lg flex items-center justify-center gap-2 border has-[:checked]:border-[#4CAF50] has-[:checked]:bg-[#d7f8d9]">
                <input type="radio" name="decision" value="approve" checked={decision === 'approve'} onChange={(e) => setDecision(e.target.value as 'approve')} required className="accent-[#4CAF50]" />
                Aprovar solicitação
              </label>
              <label className="cursor-pointer p-4 w-full bg-white rounded-lg flex items-center justify-center gap-2 border has-[:checked]:border-red-500 has-[:checked]:bg-red-50">
                <input type="radio" name="decision" value="deny" checked={decision === 'deny'} onChange={(e) => setDecision(e.target.value as 'deny')} required className="accent-red-500"/>
                Negar solicitação
              </label>
            </div>
            <ActionButton type="submit" onClick={handleSubmit}>
              Confirmar
            </ActionButton>
          </div>
        </div>
      </CustomDialog>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-2 pl-3 pr-5 w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 border border-gray-300 rounded-lg flex justify-center items-center">
            <Bell className="w-3.5 h-3.5 text-[#4CAF50]" />
          </div>
          <span className="font-medium text-sm">Solicitações</span>
        </div>
        <div className="flex items-center min-h-[46px]">
          <button
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border border-gray-300 rounded-l-lg cursor-pointer transition-colors ${activeTab === 'teams' ? 'bg-[#4CAF50] text-white' : 'bg-white text-[#4CAF50] hover:bg-gray-50'}`}
            onClick={() => setActiveTab('teams')}
          >
            <Users className="w-4 h-4" />
            <span>Equipes</span>
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border border-gray-300 border-l-0 rounded-r-lg cursor-pointer transition-colors ${activeTab === 'players' ? 'bg-[#4CAF50] text-white' : 'bg-white text-[#4CAF50] hover:bg-gray-50'}`}
            onClick={() => setActiveTab('players')}
          >
            <User className="w-4 h-4" />
            <span>Participantes</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mt-5">
        <table className="w-full text-sm min-w-[47rem] md:min-w-full">
          <thead className="bg-gray-50 border border-gray-200 rounded-lg">
            <tr className="grid grid-cols-[2fr_1.5fr_1fr_1fr] gap-4 p-2 text-gray-400">
              <th className="text-left">Equipe Solicitante</th>
              <th className="text-left">Tipo de Solicitação</th>
              <th className="text-left">Data da Solicitação</th>
              <th className="text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.map((request, index) => (
              <tr
                key={request.id}
                className={`grid grid-cols-[2fr_1.5fr_1fr_1fr] gap-4 p-4 items-center text-gray-800 ${index !== currentRequests.length - 1 ? 'border-b border-gray-200' : ''}`}
              >
                <td className="flex flex-col gap-1">
                  <p>{request.team.name}</p>
                  <span className="text-gray-400 text-xs">
                    {request.team.competition?.name ?? 'Sem competição'}
                  </span>
                </td>
                <td>
                  <span className={`inline-flex items-center px-4 py-2 rounded-lg text-xs font-medium ${getRequestTypeStyle(request.request_type)}`}>
                    {getRequestTypeLabel(request.request_type)}
                  </span>
                </td>
                <td>{formatDate(request.created_at)}</td>
                <td>
                  <button
                    className="text-blue-500 cursor-pointer bg-transparent border-0 font-semibold hover:underline"
                    onClick={() => handleShowRequest(request)}
                  >
                    Exibir solicitação
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {renderDialogContent()}
    </div>
  );
};