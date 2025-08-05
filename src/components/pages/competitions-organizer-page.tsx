'use client'

import React from 'react';
import { Trophy } from 'lucide-react';
import type { Competition, Modality } from '@/types/competition';
import useCompetitionsWithModalities from '@/hooks/useCompetitionsWithModalities';

export default function OrganizerCompetitionsPage() {
  
  const { competitions, modalities, teamsCountMap, loading } = useCompetitionsWithModalities();

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full">
        <p>Carregando competições...</p>
      </div>
    )
  }

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
              <tr className="grid grid-cols-4 gap-12 items-center px-4 py-2 bg-gray-50 text-gray-400 border border-gray-300 rounded-lg">
                <th className="text-left">Nome da competição</th>
                <th className="text-left">Status</th>
                <th className="text-left">Equipes inscritas</th>
                <th className="text-left">Ações</th>
              </tr>
            </thead>
            <tbody className="mt-5">
              {competitions.map((competition, index) => (
                <tr 
                  key={competition.id}
                  className={`grid grid-cols-4 gap-12 px-4 py-4 text-gray-800 ${
                    index !== competitions.length - 1 ? 'border-b border-gray-300' : ''
                  }`}
                >
                  <td className="flex flex-col justify-start items-start">
                    <span className="font-medium text-sm">{competition.name}</span>
                    <span className="font-light text-xs text-gray-600">
                      {modalities[competition.modality]?.name ?? "Modalidade desconhecida"}
                    </span>
                  </td>
                  
                  <td className="flex items-center">
                    <span className={`px-4 py-2 rounded-lg font-medium text-xs ${getStatusColor(competition.status)}`}>
                      {getStatusText(competition.status)}
                    </span>
                  </td>
                  
                  <td className="flex items-center">
                    {teamsCountMap[competition.id] ?? 0} equipes
                  </td>
                  
                  <td className="flex items-center">
                    <a 
                      href={`/organizador/competicoes/${competition.id}/campus/${modalities[competition.modality]?.campus ?? ''}`}
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