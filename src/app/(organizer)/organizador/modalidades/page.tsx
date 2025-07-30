'use client'

import React, { useState } from 'react';
import { Trophy, Edit2, Trash2, ChevronDown, Plus, X, Upload, Volleyball } from 'lucide-react';
import CustomDialog from '@/components/shared/custom-dialog';
import InputField from '@/components/shared/input-field';
import ActionButton from '@/components/shared/action-button';
import Link from 'next/link';

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
  teamsCount?: number; // Para exibição na tabela
}

interface Modality {
  id: string;
  name: string;
  campus: string;
  competitions?: Competition[]; // Para exibição local
}

type DialogType = 'addModality' | 'editModality' | 'removeModality' | 'removeCompetition' | 'createCompetition';

export default function ModalitiesPage() {
  const [modalities, setModalities] = useState<Modality[]>([
    {
      id: '1',
      name: 'Basquete',
      campus: 'Campus Central',
      competitions: [
        { 
          id: '1', 
          name: 'Basquete masculino', 
          modality: { id: '1', name: 'Basquete', campus: 'Campus Central' },
          status: 'in-progress' as const,
          start_date: '2024-01-15',
          end_date: '2024-03-15',
          system: 'groups_elimination' as const,
          image: '/images/basquete-masculino.jpg',
          min_members_per_team: 8,
          teams_per_group: 4,
          teams_qualified_per_group: 2,
          teamsCount: 20
        },
        { 
          id: '2', 
          name: 'Basquete feminino', 
          modality: { id: '1', name: 'Basquete', campus: 'Campus Central' },
          status: 'in-progress' as const,
          start_date: '2024-01-15',
          end_date: '2024-03-15',
          system: 'groups_elimination' as const,
          image: '/images/basquete-feminino.jpg',
          min_members_per_team: 8,
          teams_per_group: 4,
          teams_qualified_per_group: 2,
          teamsCount: 20
        }
      ]
    },
    {
      id: '2',
      name: 'Vôlei',
      campus: 'Campus Central',
      competitions: [
        { 
          id: '3', 
          name: 'Vôlei Indoor', 
          modality: { id: '2', name: 'Vôlei', campus: 'Campus Central' },
          status: 'in-progress' as const,
          start_date: '2024-02-01',
          end_date: '2024-04-01',
          system: 'league' as const,
          image: '/images/volei-indoor.jpg',
          min_members_per_team: 6,
          teams_per_group: null,
          teams_qualified_per_group: null,
          teamsCount: 20
        },
        { 
          id: '4', 
          name: 'Vôlei de areia masculino', 
          modality: { id: '2', name: 'Vôlei', campus: 'Campus Central' },
          status: 'in-progress' as const,
          start_date: '2024-02-15',
          end_date: '2024-04-15',
          system: 'elimination' as const,
          image: '/images/volei-areia-masc.jpg',
          min_members_per_team: 4,
          teams_per_group: null,
          teams_qualified_per_group: null,
          teamsCount: 20
        },
        { 
          id: '5', 
          name: 'Vôlei de areia feminino', 
          modality: { id: '2', name: 'Vôlei', campus: 'Campus Central' },
          status: 'in-progress' as const,
          start_date: '2024-02-15',
          end_date: '2024-04-15',
          system: 'elimination' as const,
          image: '/images/volei-areia-fem.jpg',
          min_members_per_team: 4,
          teams_per_group: null,
          teams_qualified_per_group: null,
          teamsCount: 20
        }
      ]
    },
    {
      id: '3',
      name: 'Futsal',
      campus: 'Campus Central',
      competitions: [
        { 
          id: '6', 
          name: 'Futsal masculino', 
          modality: { id: '3', name: 'Futsal', campus: 'Campus Central' },
          status: 'in-progress' as const,
          start_date: '2024-01-10',
          end_date: '2024-03-10',
          system: 'groups_elimination' as const,
          image: '/images/futsal-masculino.jpg',
          min_members_per_team: 10,
          teams_per_group: 4,
          teams_qualified_per_group: 2,
          teamsCount: 20
        },
        { 
          id: '7', 
          name: 'Futsal feminino', 
          modality: { id: '3', name: 'Futsal', campus: 'Campus Central' },
          status: 'in-progress' as const,
          start_date: '2024-01-10',
          end_date: '2024-03-10',
          system: 'groups_elimination' as const,
          image: '/images/futsal-feminino.jpg',
          min_members_per_team: 10,
          teams_per_group: 4,
          teams_qualified_per_group: 2,
          teamsCount: 20
        }
      ]
    }
  ]);

  const [expandedModalities, setExpandedModalities] = useState<Record<string, boolean>>({});
  const [dialogs, setDialogs] = useState({
    addModality: false,
    editModality: false,
    removeModality: false,
    removeCompetition: false,
    createCompetition: false
  });

  const [selectedModality, setSelectedModality] = useState<Modality | null>(null);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  
  const [newModalityName, setNewModalityName] = useState('');
  const [editModalityName, setEditModalityName] = useState('');
  const [newCompetitionForm, setNewCompetitionForm] = useState({
    name: '',
    system: '' as 'league' | 'groups_elimination' | 'elimination' | '',
    minPlayers: '',
    maxPlayers: '',
    teamsPerGroup: '',
    teamsQualifiedPerGroup: '',
    image: null as File | null
  });

  const toggleModality = (modalityId: string) => {
    setExpandedModalities(prev => ({
      ...prev,
      [modalityId]: !prev[modalityId]
    }));
  };

  const openDialog = (
    type: DialogType, 
    modality: Modality | null = null, 
    competition: Competition | null = null
  ) => {
    setSelectedModality(modality);
    setSelectedCompetition(competition);
    
    if (type === 'editModality' && modality) {
      setEditModalityName(modality.name);
    }
    
    setDialogs(prev => ({ ...prev, [type]: true }));
  };

  const closeDialog = (type: DialogType) => {
    setDialogs(prev => ({ ...prev, [type]: false }));
    setSelectedModality(null);
    setSelectedCompetition(null);
    
    setNewModalityName('');
    setEditModalityName('');
    setNewCompetitionForm({
      name: '',
      system: '' as 'league' | 'groups_elimination' | 'elimination' | '',
      minPlayers: '',
      maxPlayers: '',
      teamsPerGroup: '',
      teamsQualifiedPerGroup: '',
      image: null
    });
  };

  const handleCreateModality = () => {
    if (!newModalityName.trim()) return;
    
    const newModality: Modality = {
      id: Date.now().toString(),
      name: newModalityName,
      campus: 'Campus Central',
      competitions: []
    };
    
    setModalities(prev => [...prev, newModality]);
    closeDialog('addModality');
  };

  const handleEditModality = () => {
    if (!selectedModality || !editModalityName.trim()) return;
    
    setModalities(prev => 
      prev.map(modality => 
        modality.id === selectedModality.id 
          ? { ...modality, name: editModalityName }
          : modality
      )
    );
    closeDialog('editModality');
  };

  const handleRemoveModality = () => {
    if (!selectedModality) return;
    
    setModalities(prev => prev.filter(modality => modality.id !== selectedModality.id));
    closeDialog('removeModality');
  };

  const handleRemoveCompetition = () => {
    if (!selectedModality || !selectedCompetition) return;
    
    setModalities(prev => 
      prev.map(modality => 
        modality.id === selectedModality.id
          ? {
              ...modality,
              competitions: modality.competitions?.filter(comp => comp.id !== selectedCompetition.id) || []
            }
          : modality
      )
    );
    closeDialog('removeCompetition');
  };

  const handleCreateCompetition = () => {
    if (!selectedModality || !newCompetitionForm.name.trim() || !newCompetitionForm.system) return;
    
    const newCompetition: Competition = {
      id: Date.now().toString(),
      name: newCompetitionForm.name,
      modality: selectedModality,
      status: 'not-started',
      start_date: null,
      end_date: null,
      system: newCompetitionForm.system as 'league' | 'groups_elimination' | 'elimination',
      image: '/images/default-competition.jpg',
      min_members_per_team: parseInt(newCompetitionForm.minPlayers) || 1,
      teams_per_group: newCompetitionForm.system === 'groups_elimination' ? parseInt(newCompetitionForm.teamsPerGroup) || null : null,
      teams_qualified_per_group: newCompetitionForm.system === 'groups_elimination' ? parseInt(newCompetitionForm.teamsQualifiedPerGroup) || null : null,
      teamsCount: 0
    };
    
    setModalities(prev => 
      prev.map(modality => 
        modality.id === selectedModality.id
          ? { ...modality, competitions: [...(modality.competitions || []), newCompetition] }
          : modality
      )
    );
    closeDialog('createCompetition');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewCompetitionForm(prev => ({ ...prev, image: file }));
    }
  };

  return (
    <div className="w-full">

      <div className="flex items-start justify-between mb-8">
        <h3 className="text-2xl text-[#062601] font-title font-bold">Modalidades</h3>
        <button
          onClick={() => openDialog('addModality')}
          className="bg-[#4CAF50] text-white px-4 py-2.5 rounded-md font-semibold cursor-pointer border-0"
        >
          Cadastrar modalidade
        </button>
      </div>

      <div className="w-full flex flex-col gap-4">
        {modalities.map((modality) => {
          const isExpanded = expandedModalities[modality.id];
          
          return (
            <div key={modality.id} className="bg-white rounded-2xl p-2 pr-5 pl-3 w-full">

              <div className="flex justify-between items-center min-h-[46px]">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 border border-gray-300 rounded-lg flex justify-center items-center">
                    <Volleyball size={16} className='text-[#4CAF50]' />
                  </div>
                  <span className="text-sm font-medium">{modality.name}</span>
                </div>

                <div className="flex items-center gap-4">
                  {isExpanded && (
                    <>
                      <button
                        onClick={() => openDialog('createCompetition', modality)}
                        className="text-[#4CAF50] font-semibold text-xs px-4 py-2 border border-gray-300 rounded-lg bg-white flex items-center gap-2 cursor-pointer"
                      >
                        <span className="max-md:hidden">Criar nova competição</span>
                        <Trophy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDialog('editModality', modality)}
                        className="text-[#4CAF50] font-semibold text-xs px-4 py-2 border border-gray-300 rounded-lg bg-white flex items-center gap-2 cursor-pointer"
                      >
                        <span className="max-md:hidden">Editar modalidade</span>
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDialog('removeModality', modality)}
                        className="text-red-500 font-semibold text-xs px-4 py-2 border border-gray-300 rounded-lg bg-white flex items-center gap-2 cursor-pointer"
                      >
                        <span className="max-md:hidden">Excluir modalidade</span>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => toggleModality(modality.id)}
                    className="border-none bg-transparent cursor-pointer"
                  >
                    <ChevronDown 
                      className={`h-4 w-4 text-gray-600 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="overflow-x-auto mt-5">
                  <table className="w-full text-sm min-w-[47rem] md:min-w-full">
                    <thead>
                      <tr className="grid grid-cols-4 gap-16 items-center px-4 py-2 bg-gray-50 text-gray-400 border border-gray-300 rounded-lg">
                        <th className="text-left">Nome da competição</th>
                        <th className="text-left">Equipes inscritas</th>
                        <th className="text-left">Status</th>
                        <th className="text-left">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modality.competitions?.map((competition, index) => (
                        <tr 
                          key={competition.id}
                          className={`grid grid-cols-4 gap-16 px-4 py-4 text-gray-800 ${
                            index !== (modality.competitions?.length || 0) - 1 ? 'border-b border-gray-300' : ''
                          }`}
                        >
                          <td className="flex items-center">{competition.name}</td>
                          <td className="flex items-center">{competition.teamsCount || 0} equipes</td>
                          <td className="flex items-center">
                            <span className="px-4 py-2 text-cyan-600 bg-cyan-50 rounded-lg font-medium text-xs">
                              {competition.status === 'not-started' ? 'Não iniciado' : 
                               competition.status === 'in-progress' ? 'Em andamento' : 'Finalizado'}
                            </span>
                          </td>
                          <td className="flex items-center gap-2">
                            <Link href={`/organizador/competicoes/${competition.id}`} className="border-none bg-transparent cursor-pointer">
                              <Edit2 className="h-4 w-4 text-gray-600" />
                            </Link>
                            <button
                              onClick={() => openDialog('removeCompetition', modality, competition)}
                              className="border-none bg-transparent cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <CustomDialog
        open={dialogs.addModality}
        onClose={() => closeDialog('addModality')}
        title="Cadastrar nova modalidade"
      >
        <InputField
          id="new-modality-name"
          label="Nome da modalidade"
          placeholder="Modalidade"
          value={newModalityName}
          onChange={(e) => setNewModalityName(e.target.value)}
        />
        <ActionButton onClick={handleCreateModality} variant="primary">
          Criar modalidade
        </ActionButton>
      </CustomDialog>

      <CustomDialog
        open={dialogs.editModality}
        onClose={() => closeDialog('editModality')}
        title="Editar modalidade"
      >
        <InputField
          id="edit-modality-name"
          label="Nome da modalidade"
          value={editModalityName}
          onChange={(e) => setEditModalityName(e.target.value)}
        />
        <ActionButton onClick={handleEditModality} variant="primary">
          Concluir alterações
        </ActionButton>
      </CustomDialog>

      <CustomDialog
        open={dialogs.removeModality}
        onClose={() => closeDialog('removeModality')}
        title={`Excluir modalidade ${selectedModality?.name || ''}?`}
      >
        <ActionButton onClick={handleRemoveModality} variant="danger">
          Excluir
        </ActionButton>
      </CustomDialog>

      <CustomDialog
        open={dialogs.removeCompetition}
        onClose={() => closeDialog('removeCompetition')}
        title={`Excluir competição ${selectedCompetition?.name || ''}?`}
      >
        <ActionButton onClick={handleRemoveCompetition} variant="danger">
          Excluir
        </ActionButton>
      </CustomDialog>

      <CustomDialog
        open={dialogs.createCompetition}
        onClose={() => closeDialog('createCompetition')}
        title={`Criar nova competição de ${selectedModality?.name || ''}`}
      >
        <div className="flex flex-col gap-6">
          <InputField
            id="new-competition-name"
            label="Nome da competição"
            placeholder="Ex: Basquete masculino"
            value={newCompetitionForm.name}
            onChange={(e) => setNewCompetitionForm(prev => ({ ...prev, name: e.target.value }))}
          />

          <div className="flex flex-col gap-4">
            <label>Sistema da competição</label>
            <div className="flex items-center gap-2 justify-between max-md:flex-col max-md:gap-4">
              <label className="flex items-center gap-2 px-3 py-6 bg-white rounded-md text-xs cursor-pointer max-md:w-full max-md:justify-center">
                <input
                  type="radio"
                  name="competition-type"
                  value="groups_elimination"
                  checked={newCompetitionForm.system === 'groups_elimination'}
                  onChange={(e) => setNewCompetitionForm(prev => ({ ...prev, system: e.target.value as 'league' | 'groups_elimination' | 'elimination' }))}
                />
                Fase de grupos
              </label>
              <label className="flex items-center gap-2 px-3 py-6 bg-white rounded-md text-xs cursor-pointer max-md:w-full max-md:justify-center">
                <input
                  type="radio"
                  name="competition-type"
                  value="league"
                  checked={newCompetitionForm.system === 'league'}
                  onChange={(e) => setNewCompetitionForm(prev => ({ ...prev, system: e.target.value as 'league' | 'groups_elimination' | 'elimination' }))}
                />
                Pontos Corridos
              </label>
              <label className="flex items-center gap-2 px-3 py-6 bg-white rounded-md text-xs cursor-pointer max-md:w-full max-md:justify-center">
                <input
                  type="radio"
                  name="competition-type"
                  value="elimination"
                  checked={newCompetitionForm.system === 'elimination'}
                  onChange={(e) => setNewCompetitionForm(prev => ({ ...prev, system: e.target.value as 'league' | 'groups_elimination' | 'elimination' }))}
                />
                Eliminatórias
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <label>Quantidade mínima de participantes por equipe</label>
              <input
                type="number"
                placeholder="Ex: 8"
                value={newCompetitionForm.minPlayers}
                onChange={(e) => setNewCompetitionForm(prev => ({ ...prev, minPlayers: e.target.value }))}
                className="py-4 px-4 border-0 rounded-md bg-white"
              />
            </div>
            
            {newCompetitionForm.system === 'groups_elimination' && (
              <>
                <div className="flex flex-col gap-4">
                  <label>Equipes por grupo</label>
                  <input
                    type="number"
                    placeholder="Ex: 4"
                    value={newCompetitionForm.teamsPerGroup}
                    onChange={(e) => setNewCompetitionForm(prev => ({ ...prev, teamsPerGroup: e.target.value }))}
                    className="py-4 px-4 border-0 rounded-md bg-white"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <label>Equipes classificadas por grupo</label>
                  <input
                    type="number"
                    placeholder="Ex: 2"
                    value={newCompetitionForm.teamsQualifiedPerGroup}
                    onChange={(e) => setNewCompetitionForm(prev => ({ ...prev, teamsQualifiedPerGroup: e.target.value }))}
                    className="py-4 px-4 border-0 rounded-md bg-white"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <label>Imagem da competição</label>
            <label className="px-8 py-6 bg-white rounded-md cursor-pointer flex items-center gap-5">
              <Upload className="text-[#4CAF50]" size={20} />
              Inserir imagem
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
          <div className='mt-4'>
            <ActionButton onClick={handleCreateCompetition} type='button' variant="primary">
              Criar competição
            </ActionButton>
          </div>
          
        </div>
      </CustomDialog>
    </div>
  );
}