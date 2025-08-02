"use client"

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { X, Users } from 'lucide-react';
import { toast } from 'sonner';
import { getCompetitionsAuth } from '@/lib/requests/competitions';
import type { Competition } from '@/types/competition';
import { teamSchema, type CreateTeamFormData } from '@/lib/schemas/team-schema';
import { createTeam } from '@/lib/requests/teams';
import type { CreateTeamPayload } from '@/types/team';

export default function TeamRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [competitions, setCompetitions] = useState<Competition[] | []>([])

  async function getCompetitions() {
    const response = await getCompetitionsAuth();
    
    if (!response.success) {
      toast.error(response.error);
      return null;
    }

    setCompetitions(response.data as Competition[])
  }

  useEffect(() => {
    getCompetitions()
  }, [])

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      abbreviation: '',
      competition_id: '',
      members: [{ registration: '' }]
    }
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'members'
  });

  const selectedCompetition = watch('competition_id');

  const getCompetitionLimits = () => {
    if (!selectedCompetition) return null;

    const competition = competitions.find(c => c.id === selectedCompetition);

    if (!competition) return null;

    return {
      min: competition.min_members_per_team,
      max: competition.max_members_per_team
    };
  };

  const updateMembersForCompetition = () => {
    const limits = getCompetitionLimits();

    if (limits) {
      const currentCount = fields.length;
      const targetCount = limits.min;
      
      if (currentCount < targetCount) {
        const membersToAdd = targetCount - currentCount;
        for (let i = 0; i < membersToAdd; i++) {
          append({ registration: '' });
        }
      } else if (currentCount > targetCount) {
        const newMembers = fields.slice(0, targetCount).map(() => ({ registration: '' }));
        replace(newMembers);
      }
    } else {
      replace([{ registration: '' }]);
    }
  };

  useEffect(() => {
    updateMembersForCompetition();
  }, [selectedCompetition]);

  const addNewMember = () => {
    const limits = getCompetitionLimits();
    if (limits && fields.length < limits.max) {
      append({ registration: '' });
    }
  };

  const removeMember = (index: number) => {
    const limits = getCompetitionLimits();
    if (limits && fields.length > limits.min) {
      remove(index);
    }
  };

  const onSubmit = async (data: CreateTeamFormData) => {
    setIsSubmitting(true);

    const payload: CreateTeamPayload = {
      ...data,
      members: data.members.map(m => m.registration)
    };

    console.log(payload)
    
    try {
      const response = await createTeam(payload)

      if (!response.success) {
        toast.error(response.error);
        return;
      }

      toast("Solicitação enviada com sucesso!");
  
      setValue('name', '');
      setValue('abbreviation', '');
      setValue('competition_id', '');
      replace([{ registration: '' }]);
    } catch (error) {
      toast.error("Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const limits = getCompetitionLimits();
  const canAddMember = limits && fields.length < limits.max;
  const canRemoveMember = limits && fields.length > (limits?.min || 1);

  // Função para agrupar membros em grupos de 3 para o grid
  const getMemberGroups = () => {
    const groups = [];
    for (let i = 0; i < fields.length; i += 3) {
      groups.push(fields.slice(i, i + 3));
    }
    return groups;
  };

  return (
    <div className="py-12">
      <div className="flex flex-col gap-3 mb-8">
        <h1 className="text-4xl font-bold text-[#062601] leading-tight font-title">
          Cadastrar nova equipe
        </h1>
        <p className="text-gray-600 text-base leading-relaxed max-w-2xl">
          Nesta seção, você poderá cadastrar uma nova equipe para o Intercurso, escolhendo a modalidade desejada e preenchendo
          as matrículas dos alunos participantes. Disponibilizamos os campos mínimos necessários para inserir os dados
          dos integrantes da equipe, mas, caso queira adicionar mais participantes, basta clicar no botão "Adicionar
          Participante" para incluir novos membros de forma simples e rápida.
        </p>
      </div>

      <div className="flex flex-col gap-8 mt-8 mb-6">
        {errors.root && (
          <div className="bg-red-50 border border-red-600 p-3 rounded-md mb-4">
            <div className="text-red-600 text-sm">{errors.root.message}</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col">
            <label className="mb-4 text-base text-[#062601] font-medium">
              Nome da Equipe
            </label>
            <input
              {...register('name')}
              className="text-base p-4 border border-gray-300 rounded-lg focus:outline-none"
              placeholder="Digite o nome da equipe"
            />
            {errors.name && (
              <div className="text-red-600 text-sm mt-1">{errors.name.message}</div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-4 text-base text-[#062601] font-medium">
              Abreviação
            </label>
            <input
              {...register('abbreviation')}
              className="text-base p-4 border border-gray-300 rounded-lg focus:outline-none"
              placeholder="Digite a abreviação"
            />
            {errors.abbreviation && (
              <div className="text-red-600 text-sm mt-1">{errors.abbreviation.message}</div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-4 text-base text-[#062601] font-medium">
              Competição
            </label>
            <div className="border border-gray-300 rounded-lg">
              <select
                {...register('competition_id')}
                className={`w-full p-4 bg-transparent outline-none text-base ${
                  !selectedCompetition ? 'text-gray-500' : 'text-black'
                }`}
              >
                <option value="">Selecione uma competição</option>
                {competitions.map((competition) => (
                  <option key={competition.id} value={competition.id} className="text-black">
                    {competition.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.competition_id && (
              <div className="text-red-600 text-sm mt-1">{errors.competition_id.message}</div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <label className="text-base text-[#062601] font-medium">
              Membros - {fields.length} / {limits?.max || 1}
            </label>
          </div>

          <div className="flex flex-col gap-6">
            {getMemberGroups().map((group, groupIndex) => (
              <div key={groupIndex} className="relative">
                <div className="block md:hidden mb-4">
                  {group.map((field, fieldIndex) => {
                    const actualIndex = groupIndex * 3 + fieldIndex;
                    return (
                      <div key={field.id} className="mb-4">
                        <div className="text-[#062601] font-medium mb-2">
                          Membro {actualIndex + 1}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            {...register(`members.${actualIndex}.registration`)}
                            className="flex-1 text-base p-4 border border-gray-300 rounded-lg focus:outline-none"
                            placeholder="Matrícula"
                          />
                          {canRemoveMember && actualIndex >= (limits?.min || 1) && (
                            <button
                              type="button"
                              onClick={() => removeMember(actualIndex)}
                              className="p-2 text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                        {errors.members?.[actualIndex]?.registration && (
                          <div className="text-red-600 text-sm mt-1">
                            {errors.members[actualIndex].registration.message}
                          </div>
                        )}
                        {actualIndex < fields.length - 1 && (
                          <hr className="mt-4 border-gray-300" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="hidden md:grid md:grid-cols-3 gap-8">
                  {group.map((field, fieldIndex) => {
                    const actualIndex = groupIndex * 3 + fieldIndex;
                    return (
                      <div key={field.id} className="flex flex-col relative">
                        <label className="mb-2 text-sm text-[#062601] font-medium">
                          Membro {actualIndex + 1}
                        </label>
                        <div className="relative">
                          <input
                            {...register(`members.${actualIndex}.registration`)}
                            className="w-full text-base p-4 border border-gray-300 rounded-lg focus:outline-none"
                            placeholder="Matrícula"
                          />
                          {canRemoveMember && actualIndex >= (limits?.min || 1) && (
                            <button
                              type="button"
                              onClick={() => removeMember(actualIndex)}
                              className="absolute -top-2 -right-2 p-1 bg-white border border-gray-300 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                        {errors.members?.[actualIndex]?.registration && (
                          <div className="text-red-600 text-sm mt-1">
                            {errors.members[actualIndex].registration.message}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {errors.members?.root && (
              <div className="text-red-600 text-sm">{errors.members.root.message}</div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <button
            type="button"
            onClick={addNewMember}
            disabled={!canAddMember}
            className={`w-full max-w-md flex items-center justify-center gap-2 p-4 border border-gray-500 rounded-lg text-sm font-semibold transition-colors ${
              canAddMember 
                ? 'text-[#4CAF50] cursor-pointer bg-transparent hover:bg-green-50' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>Adicionar novo membro</span>
            <Users size={16} />
          </button>

          <div className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              id="agree"
              className="cursor-pointer"
            />
            <label htmlFor="agree" className="cursor-pointer">
              Eu li e concordo com o{' '}
              <a href="#" className="text-blue-500 hover:underline">
                regulamento da competição
              </a>
            </label>
          </div>

          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className={`w-full max-w-md py-5 px-0 rounded-lg bg-[#4CAF50] text-base font-semibold text-white transition-all ${
              isSubmitting
                ? 'bg-[#4CAF50]/50 cursor-not-allowed'
                : 'hover:bg-green-600 cursor-pointer'
            }`}
          >
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar equipe'}
          </button>
        </div>
      </div>
    </div>
  );
};