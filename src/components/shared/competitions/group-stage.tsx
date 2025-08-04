"use client";
import type { Competition, GroupData, RoundData, Match } from '@/types/competition';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import GroupStageRound from './stage-round';
import KnockoutRoundView from './knockout-round-view';
import type { Team } from '@/types/team';
import Link from 'next/link';
import ActionButton from '../action-button';
import { patchFinishCompetition, patchStartCompetition } from '@/lib/requests/competitions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import CustomDialog from '../custom-dialog';

interface GroupStageCompetitionProps {
  competition: Competition;
  groups: GroupData[];
  teams: Team[];
  knockoutRounds: RoundData[];
  variant?: "student" | "organizer";
  onEditMatchClick: (match: Match) => void;
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
  variant="student",
  onEditMatchClick
}: GroupStageCompetitionProps) {
  const [endCompDialogOpen, setEndCompDialogOpen] = useState(false);

  const router = useRouter();

  const handleStartCompetition = async () => {
    const result = await patchStartCompetition(competition.id);
    if (result.success) {
      toast.success("Competição iniciada com sucesso!");
      window.location.reload();
    } else {
      toast.error(result.error);
    }
  };

  const handleEndCompetition = async () => {
    const result = await patchFinishCompetition(competition.id);
    if (result.success) {
      toast.success("Competição encerrada com sucesso!");
      router.push("/organizador/competicoes")
    } else {
      toast.error(result.error);
    }
  };
  
  const calculatedKnockoutRounds = useMemo(() => {
    if (competition.system === 'groups_elimination') {
      const numGroups = groups.length;
      const teamsQualifiedPerGroup = competition.teams_qualified_per_group || 2;
      const totalQualifiedTeams = numGroups * teamsQualifiedPerGroup;
      
      const allGroupMatches = groups.flatMap(group => group.rounds.flatMap(round => round.matches));
      const allGroupMatchesFinished = allGroupMatches.length > 0 && allGroupMatches.every(match => match.status === 'finished');
      
      if (!allGroupMatchesFinished && totalQualifiedTeams > 1 && groups.length > 0) {
        const phaseNames = calculateKnockoutPhases(totalQualifiedTeams);
        let teamsInCurrentPhase = totalQualifiedTeams;
        
        return phaseNames.map((phaseName, index) => {
          const numMatches = Math.floor(teamsInCurrentPhase / 2);
          const matches = generatePlaceholderMatches(phaseName, numMatches, competition.id);
          teamsInCurrentPhase = Math.ceil(teamsInCurrentPhase / 2);
          
          return {
            id: `calculated-${phaseName.toLowerCase().replace(/\s+/g, '-')}`,
            name: phaseName.toUpperCase(),
            matches
          };
        });
      }
      
      if (allGroupMatchesFinished && knockoutRounds && knockoutRounds.length > 0) {
        return knockoutRounds;
      }
    }
    
    return [];
  }, [competition, groups, knockoutRounds]);

  const allDisplayStages = useMemo(() => {
    const stages = [{ key: 'group-stage', name: 'FASE DE GRUPOS' }];
    
    if (calculatedKnockoutRounds.length > 0) {
      stages.push(...calculatedKnockoutRounds.map(round => ({ key: round.id, name: round.name })));
    }
    
    return stages;
  }, [calculatedKnockoutRounds]);

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

          {competition.status === "not-started" && (
            <ActionButton variant="primary" className="py-4 px-4 border-0 w-full rounded-lg text-center font-bold cursor-pointer bg-[#4CAF50] text-white" onClick={handleStartCompetition}>
              Iniciar competição
            </ActionButton>
          )}

          {competition.status === "in-progress" && (
            <ActionButton variant="primary" className="py-4 px-4 border-0 w-full rounded-lg text-center font-bold cursor-pointer bg-red-600 text-white"
              type="button"
              onClick={() => setEndCompDialogOpen(true)}
            >
              Encerrar competição
            </ActionButton>
          )}

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
        {currentStageIndex === 0 ? (
          <div className="flex flex-col gap-8">
            {groups && groups.length > 0 ? (
              groups.map((groupData) => (
                <GroupStageRound key={groupData.id} groupData={groupData} teams={teams} variant={variant} onEditMatchClick={onEditMatchClick} />
              ))
            ) : (
              <div className="text-center py-16 text-gray-500">
                <p>Nenhum grupo disponível para esta competição.</p>
              </div>
            )}
          </div>
        ) : (
          calculatedKnockoutRounds && calculatedKnockoutRounds.length > 0 && calculatedKnockoutRounds[currentStageIndex - 1] ? (
            <KnockoutRoundView
              round={calculatedKnockoutRounds[currentStageIndex - 1]}
              teams={teams}
              variant={variant}
              onEditMatchClick={onEditMatchClick}
            />
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p>Nenhuma fase de eliminação disponível.</p>
            </div>
          )
        )}
      </div>

      <CustomDialog
        open={endCompDialogOpen}
        onClose={() => setEndCompDialogOpen(false)}
        title="Encerrar competição"
      >
        <div className="flex flex-col gap-4">
          <p>Tem certeza que deseja encerrar esta competição? Esta ação não pode ser desfeita.</p>
          <div className="flex justify-end gap-4 mt-3">
            <ActionButton variant="danger" onClick={handleEndCompetition}>
              Encerrar
            </ActionButton>
          </div>
        </div>
      </CustomDialog>
    </>
  );
}