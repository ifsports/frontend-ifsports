"use client";
import type { Competition, GroupData, RoundData, Match } from '@/types/competition';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import GroupStageRound from './stage-round';
import KnockoutRoundView from './knockout-round-view';
import type { Team } from '@/types/team';
import Link from 'next/link';
import ActionButton from '../action-button';

interface GroupStageCompetitionProps {
  competition: Competition;
  groups: GroupData[];
  teams: Team[];
  knockoutRounds: RoundData[];
  variant?: "student" | "organizer";
}

const calculateKnockoutPhases = (totalQualifiedTeams: number): string[] => {
  const phases: string[] = [];
  let teamsRemaining = totalQualifiedTeams;
  
  while (teamsRemaining > 1) {
    if (teamsRemaining === 2) {
      phases.push('Final');
      break;
    } else if (teamsRemaining <= 4) {
      phases.push('Semifinal');
      teamsRemaining = 2;
    } else if (teamsRemaining <= 8) {
      phases.push('Quartas de Final');
      teamsRemaining = 4;
    } else if (teamsRemaining <= 16) {
      phases.push('Oitavas de Final');
      teamsRemaining = 8;
    } else if (teamsRemaining <= 32) {
      phases.push('Primeira Fase');
      teamsRemaining = 16;
    } else {
      const phaseNumber = Math.ceil(Math.log2(teamsRemaining)) - 4;
      phases.push(`${phaseNumber + 1}ª Fase`);
      teamsRemaining = Math.ceil(teamsRemaining / 2);
    }
  }
  
  return phases;
};

const generatePlaceholderMatches = (phaseName: string, numMatches: number, competitionId: string): Match[] => {
  const matches: Match[] = [];
  
  for (let i = 0; i < numMatches; i++) {
    matches.push({
      id: `placeholder-${phaseName.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      competition: competitionId,
      round: `placeholder-round-${phaseName.toLowerCase().replace(/\s+/g, '-')}`,
      round_match_number: i + 1,
      group: null,
      team_home: {
        competition: competitionId,
        team_id: 'tbd'
      },
      team_away: {
        competition: competitionId,
        team_id: 'tbd'
      },
      status: 'not-started',
      scheduled_datetime: null,
      home_feeder_match: null,
      away_feeder_match: null,
      score_home: null,
      score_away: null,
      winner: null
    });
  }
  
  return matches;
};

export default function GroupStageCompetition({
  competition,
  groups,
  teams,
  knockoutRounds,
  variant="student"
}: GroupStageCompetitionProps) {
  
  const calculatedKnockoutRounds = useMemo(() => {
    if (knockoutRounds && knockoutRounds.length > 0) {
      return knockoutRounds;
    }
    
    if (competition.system === 'groups_elimination') {
      const numGroups = groups.length;
      const teamsQualifiedPerGroup = competition.teams_qualified_per_group || 2;
      const totalQualifiedTeams = numGroups * teamsQualifiedPerGroup;
      
      if (totalQualifiedTeams > 1) {
        const phaseNames = calculateKnockoutPhases(totalQualifiedTeams);
        let teamsInCurrentPhase = totalQualifiedTeams;
        
        return phaseNames.map((phaseName, index) => {
          const numMatches = Math.floor(teamsInCurrentPhase / 2);
          const matches = generatePlaceholderMatches(phaseName, numMatches, competition.id);
          teamsInCurrentPhase = numMatches;
          
          return {
            id: `calculated-${phaseName.toLowerCase().replace(/\s+/g, '-')}`,
            name: phaseName.toUpperCase(),
            matches
          };
        });
      }
    }
    
    return [];
  }, [competition, groups, knockoutRounds]);

  const allDisplayStages = useMemo(() => [
    { key: 'group-stage', name: 'FASE DE GRUPOS' },
    ...calculatedKnockoutRounds.map(round => ({ key: round.id, name: round.name }))
  ], [calculatedKnockoutRounds]);

  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  const handlePrevStage = () => setCurrentStageIndex(prev => Math.max(0, prev - 1));
  const handleNextStage = () => setCurrentStageIndex(prev => Math.min(allDisplayStages.length - 1, prev + 1));

  const canGoPrev = currentStageIndex > 0;
  const canGoNext = currentStageIndex < allDisplayStages.length - 1;

  return (
    <>
      { variant === "organizer" && (
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <Link href="/organizador/competicoes" className="h-4 flex items-center text-black">
              <ChevronLeft size={22} />
            </Link>
            <h1 className="text-2xl font-bold font-title text-[#062601]">{competition.name}</h1>
          </div>
          <ActionButton
            variant="danger"
            className="bg-red-600 text-white cursor-pointer px-6 py-2.5 rounded-lg font-semibold"
          >
            Encerrar competição
          </ActionButton>
        </div>
      )}

      <div className={`flex items-center justify-between gap-4 pb-4 border-b border-gray-300 ${variant === "student" ? 'mt-16' : ''}`}>
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
              <GroupStageRound key={groupData.id} groupData={groupData} teams={teams} variant={variant} />
            ))}
          </div>
        )}

        {currentStageIndex > 0 && (
          <KnockoutRoundView
            round={calculatedKnockoutRounds[currentStageIndex - 1]}
            teams={teams}
            variant={variant}
          />
        )}
      </div>
    </>
  );
}