'use client'

import React, { useState, useEffect } from 'react';
import { Trophy, Edit2, Trash2, ChevronDown, Plus, X, Upload, Volleyball } from 'lucide-react';
import CustomDialog from '@/components/shared/custom-dialog';
import InputField from '@/components/shared/input-field';
import ActionButton from '@/components/shared/action-button';
import { createCompetition, createModality, deleteCompetition, deleteModality, getCompetitionsAuth, getCompetitionTeams, getModalities, putModality } from '@/lib/requests/competitions';
import { toast } from 'sonner';

interface Competition {
  id: string;
  name: string;
  modality: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  system: string;
  image: string;
  min_members_per_team: number;
  max_members_per_team: number;
  teams_per_group: number | null;
  teams_qualified_per_group: number | null;
  teamsCount?: number;
}

interface Modality {
  id: string;
  name: string;
  campus: string;
  competitions?: Competition[];
}

interface ModalityWithCompetitions extends Modality {
  competitions: Competition[];
}

type DialogType = 'addModality' | 'editModality' | 'removeModality' | 'removeCompetition' | 'createCompetition';

export default function ModalitiesPage() {
  const [modalities, setModalities] = useState<ModalityWithCompetitions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [expandedModalities, setExpandedModalities] = useState<Record<string, boolean>>({});
  const [dialogs, setDialogs] = useState({
    addModality: false,
    editModality: false,
    removeModality: false,
    removeCompetition: false,
    createCompetition: false
  });

  const [selectedModality, setSelectedModality] = useState<ModalityWithCompetitions | null>(null);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [modalitiesResult, competitionsResult] = await Promise.all([
          getModalities(),
          getCompetitionsAuth()
        ]);

        if (!modalitiesResult.success) {
          throw new Error(modalitiesResult.error || 'Erro ao carregar modalidades');
        }

        if (!competitionsResult.success) {
          throw new Error(competitionsResult.error || 'Erro ao carregar competições');
        }

        const modalitiesData = modalitiesResult.data || [];
        const competitionsData = competitionsResult.data || [];

        const competitionsWithTeamsCount = await Promise.all(
          competitionsData.map(async (competition) => {
            try {
              const teamsResult = await getCompetitionTeams(competition.id);
              const teamsCount = teamsResult.success ? teamsResult.data?.length || 0 : 0;
              return {
                ...competition,
                teamsCount
              };
            } catch (err) {
              return {
                ...competition,
                teamsCount: 0
              };
            }
          })
        );

        const modalitiesWithCompetitions: ModalityWithCompetitions[] = modalitiesData.map(modality => ({
          ...modality,
          competitions: competitionsWithTeamsCount.filter(competition => competition.modality === modality.id)
        }));

        setModalities(modalitiesWithCompetitions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleModality = (modalityId: string) => {
    setExpandedModalities(prev => ({
      ...prev,
      [modalityId]: !prev[modalityId]
    }));
  };

  const openDialog = (
    type: DialogType, 
    modality: ModalityWithCompetitions | null = null, 
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

  const handleCreateModality = async () => {
    if (!newModalityName.trim()) return;
    
    try {
      const result = await createModality({ 
        data: { name: newModalityName } 
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao criar modalidade');
      }
      
      if (!result.data || !result.data.id || !result.data.name || !result.data.campus) {
        throw new Error('Dados obrigatórios ausentes na resposta da API');
      }

      const newModality: ModalityWithCompetitions = {
        id: result.data.id,
        name: result.data.name,
        campus: result.data.campus,
        competitions: []
      };
      
      setModalities(prev => [...prev, newModality]);
      closeDialog('addModality');
      
      toast('Modalidade criada com sucesso!');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar modalidade');
    }
  };

  const handleEditModality = async () => {
    if (!selectedModality || !editModalityName.trim()) return;
    
    try {
      const result = await putModality({ 
        data: { name: editModalityName }, 
        modality_id: selectedModality.id 
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao editar modalidade');
      }
      
      setModalities(prev => 
        prev.map(modality => 
          modality.id === selectedModality.id 
            ? { ...modality, name: editModalityName }
            : modality
        )
      );
      
      closeDialog('editModality');
      toast('Modalidade editada com sucesso!');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao editar modalidade');
    }
  };

  const handleRemoveModality = async () => {
    if (!selectedModality) return;
    
    try {
      const result = await deleteModality(selectedModality.id);
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao remover modalidade');
      }
      
      setModalities(prev => prev.filter(modality => modality.id !== selectedModality.id));
      closeDialog('removeModality');
      
      toast('Modalidade removida com sucesso!');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover modalidade');
    }
  };

  const handleRemoveCompetition = async () => {
    if (!selectedModality || !selectedCompetition) return;
    
    try {
      const result = await deleteCompetition(selectedCompetition.id);
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao remover competição');
      }
      
      setModalities(prev => 
        prev.map(modality => 
          modality.id === selectedModality.id
            ? {
                ...modality,
                competitions: modality.competitions.filter(comp => comp.id !== selectedCompetition.id)
              }
            : modality
        )
      );
      
      closeDialog('removeCompetition');
      
      toast('Competição removida com sucesso!');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover competição');
    }
  };

  const handleCreateCompetition = async () => {
    if (
      !selectedModality ||
      !newCompetitionForm.name.trim() ||
      !newCompetitionForm.system ||
      !newCompetitionForm.minPlayers ||
      !newCompetitionForm.maxPlayers
    ) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const formData = new FormData();

      formData.append('name', newCompetitionForm.name);
      formData.append('modality', selectedModality.id);
      formData.append('system', newCompetitionForm.system);
      formData.append('min_members_per_team', newCompetitionForm.minPlayers);
      formData.append('max_members_per_team', newCompetitionForm.maxPlayers);

      if (newCompetitionForm.system === 'groups_elimination') {
        formData.append('teams_per_group', newCompetitionForm.teamsPerGroup || '');
        formData.append('teams_qualified_per_group', newCompetitionForm.teamsQualifiedPerGroup || '');
      }

      if (newCompetitionForm.image) {
        formData.append('image', newCompetitionForm.image);
      }

      const result = await createCompetition({ data: formData });

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Erro ao criar competição');
      }

      const newCompetition: Competition = result.data;

      setModalities(prev =>
        prev.map(modality =>
          modality.id === selectedModality.id
            ? { ...modality, competitions: [...modality.competitions, { ...newCompetition, teamsCount: 0 }] }
            : modality
        )
      );

      closeDialog('createCompetition');
    } catch (err) {
      setError('Erro ao criar competição');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewCompetitionForm(prev => ({ ...prev, image: file }));
    }
  };

  const getStatusLabel = (status: string) => {
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

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-8">
        <p>Carregando modalidades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700">Erro: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-red-600 underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

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
        {modalities.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-gray-500">Nenhuma modalidade encontrada</p>
          </div>
        ) : (
          modalities.map((modality) => {
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
                    {modality.competitions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        Nenhuma competição cadastrada para esta modalidade
                      </div>
                    ) : (
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
                          {modality.competitions.map((competition, index) => (
                            <tr 
                              key={competition.id}
                              className={`grid grid-cols-4 gap-16 px-4 py-4 text-gray-800 ${
                                index !== modality.competitions.length - 1 ? 'border-b border-gray-300' : ''
                              }`}
                            >
                              <td className="flex items-center">{competition.name}</td>
                              <td className="flex items-center">{competition.teamsCount || 0} equipes</td>
                              <td className="flex items-center">
                                <span className="px-4 py-2 text-cyan-600 bg-cyan-50 rounded-lg font-medium text-xs">
                                  {getStatusLabel(competition.status)}
                                </span>
                              </td>
                              <td className="flex items-center">
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
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Dialogs permanecem iguais */}
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

            <div className="flex flex-col gap-4">
              <label>Quantidade máxima de participantes por equipe</label>
              <input
                type="number"
                placeholder="Ex: 12"
                value={newCompetitionForm.maxPlayers}
                onChange={(e) => setNewCompetitionForm(prev => ({ ...prev, maxPlayers: e.target.value }))}
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
              {newCompetitionForm.image ? newCompetitionForm.image.name : 'Inserir imagem'}
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