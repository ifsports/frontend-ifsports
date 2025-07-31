"use client";

import type { Competition, GroupData, RoundData } from '@/types/competition';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Team } from '@/types/team';
import GroupStageRound from '../shared/competitions/stage-round';
import KnockoutRoundView from '../shared/competitions/knockout-round-view';
import Link from 'next/link';
import ActionButton from '../shared/action-button';

interface OrganizerGroupStageCompetitionProps {
  competition: Competition;
  groups: GroupData[];
  teams: Team[];
  knockoutRounds: RoundData[];
}

export default function OrganizerGroupStageCompetition({ 
  competition, 
  groups,
  teams,
  knockoutRounds
}: OrganizerGroupStageCompetitionProps) {
  
  const allDisplayStages = useMemo(() => [
    { key: 'group-stage', name: 'FASE DE GRUPOS' },
    ...knockoutRounds.map(round => ({ key: round.id, name: round.name }))
  ], [knockoutRounds]);

  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  const handlePrevStage = () => setCurrentStageIndex(prev => Math.max(0, prev - 1));
  const handleNextStage = () => setCurrentStageIndex(prev => Math.min(allDisplayStages.length - 1, prev + 1));

  const canGoPrev = currentStageIndex > 0;
  const canGoNext = currentStageIndex < allDisplayStages.length - 1;

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <Link href="/organizador/competicoes" className="h-4 flex items-center text-black">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold font-['Baloo_2'] text-[#062601]">
            {competition.name}
          </h1>
        </div>
        <ActionButton
          variant="danger"
          className="bg-red-500 text-white cursor-pointer px-6 py-2.5 rounded-lg font-semibold"
        >
          Encerrar competição
        </ActionButton>
      </div>
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-300">
        <button
          onClick={handlePrevStage}
          disabled={!canGoPrev}
          className={`p-2 rounded-full transition-colors ${
            canGoPrev ? "text-[#4CAF50] hover:bg-green-100" : "text-gray-400 cursor-not-allowed"
          }`}
          aria-label="Fase anterior"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex-1 text-center">
          <h3 className="text-2xl text-[#062601] font-title font-bold uppercase">
            {allDisplayStages[currentStageIndex]?.name ?? ""}
          </h3>
        </div>

        <button
          onClick={handleNextStage}
          disabled={!canGoNext}
          className={`p-2 rounded-full transition-colors ${
            canGoNext ? "text-[#4CAF50] hover:bg-green-100" : "text-gray-400 cursor-not-allowed"
          }`}
          aria-label="Próxima fase"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="mt-8">
        {currentStageIndex === 0 && (
          <div className="flex flex-col gap-8">
            {groups.map((groupData) => (
              <GroupStageRound key={groupData.id} groupData={groupData} variant="organizer" />
            ))}
          </div>
        )}
        
        {currentStageIndex > 0 && (
          <KnockoutRoundView
            variant="organizer" 
            round={knockoutRounds[currentStageIndex - 1]} 
            teams={teams}
          />
        )}
      </div>
    </div>
  );
}