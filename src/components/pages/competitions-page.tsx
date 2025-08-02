"use client";

import type { Competition, GroupData, RoundData, CompetitionTeam, PaginatedResponse, Match, TeamClassification } from '@/types/competition';
import GroupStageCompetition from '../shared/competitions/group-stage';
import KnockoutCompetition from '../shared/competitions/knockout-competition';
import PointsCompetition from '../shared/competitions/points-competition';
import type { Team } from '@/types/team';
import { populateCompetitionStages } from '@/utils/competitions';
import { 
  getCompetitionTeams, 
  getDetailsCompetition, 
  getCompetitionMatches, 
  getCompetitionStandings 
} from '@/lib/requests/competitions';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { getTeamFromCampusNoAuth } from '@/lib/requests/teams';

interface CompetitionPageProps {
  competitionId: string;
  campusId: string;
  variant?: "student" | "organizer";
}

const generateEliminationRoundNames = (totalRounds: number): string[] => {
  const names: string[] = [];
  
  const phaseNames: Record<number, string[]> = {
    1: ['Final'],
    2: ['Semifinal', 'Final'],
    3: ['Quartas de Final', 'Semifinal', 'Final'],
    4: ['Oitavas de Final', 'Quartas de Final', 'Semifinal', 'Final'],
    5: ['1ª Fase', 'Oitavas de Final', 'Quartas de Final', 'Semifinal', 'Final'],
    6: ['2ª Fase', '1ª Fase', 'Oitavas de Final', 'Quartas de Final', 'Semifinal', 'Final'],
  };

  if (phaseNames[totalRounds]) {
    return phaseNames[totalRounds];
  }

  for (let i = 0; i < totalRounds - 4; i++) {
    names.push(`${totalRounds - i}ª Fase`);
  }
  names.push('Quartas de Final', 'Semifinal', 'Final');

  return names;
};

export default function CompetitionPage({ competitionId, campusId, variant="student" }: CompetitionPageProps) {
  const [competition, setCompetition] = useState<Competition>();
  const [competitionTeams, setCompetitionTeams] = useState<CompetitionTeam[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [rounds, setRounds] = useState<RoundData[]>([]);
  const [standings, setStandings] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        const compResult = await getDetailsCompetition(competitionId);
        if (!compResult.success) {
          throw new Error(compResult.error);
        }
        setCompetition(compResult.data);

        const teamsResult = await getCompetitionTeams(competitionId);
        if (!teamsResult.success || !teamsResult.data) {
          throw new Error(teamsResult.error || 'Erro ao buscar equipes');
        }
        setCompetitionTeams(teamsResult.data);
        
        const campusTeamsResult = await getTeamFromCampusNoAuth({ campus: campusId });
        if (!campusTeamsResult || !Array.isArray(campusTeamsResult.data)) {
          toast.error("Nenhuma equipe encontrada para o campus selecionado.");
          throw new Error("Dados de equipes não encontrados");
        }
        
        const competitionTeamIds = teamsResult.data.map((ct: CompetitionTeam) => ct.team_id);
        const competitionTeamsData = campusTeamsResult.data.filter((team: Team) => 
          competitionTeamIds.includes(team.id)
        );
        
        setTeams(competitionTeamsData);

        const matchesResult = await getCompetitionMatches(competitionId);
        if (matchesResult.success && matchesResult.data) {
          const matches: Match[] = matchesResult.data.results;
          const roundsMap: Record<string, Match[]> = {};

          matches.forEach((match) => {
            const roundId = match.round || 'rodada-desconhecida';
            if (!roundsMap[roundId]) {
              roundsMap[roundId] = [];
            }
            roundsMap[roundId].push(match);
          });

          const roundsData: RoundData[] = Object.entries(roundsMap).map(([roundId, matches], index) => {
            let roundName = `Rodada ${index + 1}`;
            
            if (compResult.success && compResult.data && compResult.data.system === 'elimination') {
              const totalRounds = Object.keys(roundsMap).length;
              const eliminationNames = generateEliminationRoundNames(totalRounds);
              roundName = eliminationNames[index] || `${totalRounds - index}ª Fase`;
            }

            return {
              id: roundId,
              name: roundName,
              matches,
            };
          });

          setRounds(roundsData);

          const teamIds = competitionTeamsData.map(team => team.id);

          let matchesWithUnknownTeams = 0;
          roundsData.forEach(round => {
            round.matches?.forEach(match => {
              const homeTeamId = match.team_home?.team_id;
              const awayTeamId = match.team_away?.team_id;
              
              if (!teamIds.includes(homeTeamId) || !teamIds.includes(awayTeamId)) {
                matchesWithUnknownTeams++;
              }
            });
          });

        } else {
          setRounds([]);
        }

        const standingsResult = await getCompetitionStandings(competitionId);
        if (standingsResult.success && standingsResult.data) {
          setStandings(standingsResult.data);
        } else {
          setStandings([]);
        }

      } catch (err) {
        toast.error("Erro ao buscar dados da competição");
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [competitionId, campusId]);

  const groupsData: GroupData[] = useMemo(() => {
    if (!competition || !teams) {
      return [];
    }

    const teamsPerGroup = competition.teams_per_group || 2;
    const totalTeams = teams.length;
    const numberOfGroups = Math.ceil(totalTeams / teamsPerGroup);

    const createEmptyClassification = (team: Team, position: number): TeamClassification => ({
      id: `${team.id}`,
      team,
      position,
      games_played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      score_pro: 0,
      score_against: 0,
      score_difference: 0,
      points: 0,
    });

    if (competition.system === 'league') {
      return [
        {
          id: 'league',
          name: 'Tabela Geral',
          classifications: standings,
          rounds,
        },
      ];
    }

    if (competition.system === 'groups_elimination') {
      
      if (competition.status === 'not-started') {
        const generatedGroups: GroupData[] = [];

        for (let i = 0; i < numberOfGroups; i++) {
          const groupName = String.fromCharCode(65 + i); 
          const groupTeams = teams.slice(i * teamsPerGroup, (i + 1) * teamsPerGroup);

          const classifications = groupTeams.map((team, idx) =>
            createEmptyClassification(team, idx + 1)
          );

          const groupRounds = rounds.filter(round => {
            if (round.matches && round.matches.length > 0) {
              const teamIds = groupTeams.map(t => t.id);
             return round.matches.some(match => {
                const homeTeamId = match.team_home?.team_id;
                const awayTeamId = match.team_away?.team_id;
                
                return (homeTeamId && teamIds.includes(homeTeamId)) ||
                      (awayTeamId && teamIds.includes(awayTeamId));
              });
            }
            return false;
          });

          generatedGroups.push({
            id: `group-${groupName.toLowerCase()}`,
            name: `Grupo ${groupName}`,
            classifications,
            rounds: groupRounds,
          });
        }

        return generatedGroups;
      }
      
      const allGroupIds = new Set<string>();
      rounds.forEach(round => {
        round.matches?.forEach(match => {
          if (match.group) {
            allGroupIds.add(match.group);
          }
        });
      });

      function getGroupId(standing: any, fallbackId: string): string {
        return standing?.group?.id || standing?.group_id || standing?.group || fallbackId;
      }

      const groupedStandings = standings.reduce((acc: Record<string, TeamClassification[]>, standing: TeamClassification) => {
        const groupId = getGroupId(standing, Array.from(allGroupIds)[0]);
        
        if (groupId && !acc[groupId]) acc[groupId] = [];
        if (groupId) acc[groupId].push(standing);
        return acc;
      }, {});

      const groupedRounds = rounds.reduce((acc: Record<string, RoundData[]>, round) => {
        const roundsByGroup: Record<string, Match[]> = {};
        
        round.matches?.forEach(match => {
          const groupId = match.group;
          
          if (groupId) {
            if (!roundsByGroup[groupId]) {
              roundsByGroup[groupId] = [];
            }
            roundsByGroup[groupId].push(match);
          }
        });

        Object.entries(roundsByGroup).forEach(([groupId, matches]) => {
          if (!acc[groupId]) acc[groupId] = [];
          
          acc[groupId].push({
            id: `${round.id}-${groupId}`,
            name: round.name,
            matches: matches
          });
        });

        return acc;
      }, {});

      const allFoundGroupIds = new Set([
        ...Object.keys(groupedStandings),
        ...Object.keys(groupedRounds),
        ...Array.from(allGroupIds)
      ]);

      const result = Array.from(allFoundGroupIds).map((groupId, index) => {
        const groupLetter = String.fromCharCode(65 + index);
        
        return {
          id: `group-${groupLetter.toLowerCase()}`,
          name: `Grupo ${groupLetter}`,
          classifications: groupedStandings[groupId] || [],
          rounds: groupedRounds[groupId] || [],
        };
      });

      return result;
    }

    if (competition.system === 'elimination') {
      return [
        {
          id: 'elimination',
          name: 'Chaveamento',
          classifications: [],
          rounds,
        },
      ];
    }

    return [];
  }, [competition, standings, rounds, teams]);

  const knockoutRoundsData: RoundData[] = useMemo(() => {
    if (!competition || competition.system !== 'elimination') return [];
    
    return rounds.map(round => ({
      ...round,
      matches: round.matches || []
    }));
  }, [competition, rounds]);

  const competitionData = useMemo(() => {
    if (!competition) return undefined;

    return populateCompetitionStages(competition, {
      numberOfGroups: groupsData.length,
    });
  }, [competition, groupsData]);

  const renderCompetitionType = () => {
    if (!competitionData) return null;

    switch (competitionData.system) {
      case "groups_elimination":
        return (
          <GroupStageCompetition 
            competition={competitionData} 
            groups={groupsData}
            teams={teams} 
            knockoutRounds={knockoutRoundsData}
            variant={variant}
          />
        );

      case "elimination":
        return (
          <KnockoutCompetition 
            competition={competitionData} 
            teams={teams} 
            rounds={knockoutRoundsData} 
            variant={variant}
          />
        );
      
      case "league":
        return (
          <PointsCompetition 
            competition={competitionData} 
            groups={groupsData} 
            teams={teams}
            variant={variant}
          />
        );
      
      default:
        return <div>Tipo de competição não suportado</div>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full my-30">
        <p>Carregando competição...</p>
      </div>
    );
  }

  if (!competitionData) {
    return (
      <div className="py-12">
        <h2 className="text-2xl font-bold text-center">Competição não encontrada</h2>
      </div>
    );
  }

  return (
    <div className={`${variant === "student" ? 'py-12' : ''}`}>
      { variant === "student" && (
        <div className="flex flex-col gap-3 mb-12">
        <h2 className="text-4xl text-[#062601] font-title font-bold">
          {competitionData.name}
        </h2>
        <p className="max-w-2xl text-[#4F4F4F] leading-relaxed">
          Nesta seção, você poderá visualizar todos os dados relacionados à competição 
          de {competitionData.name.toLowerCase()}, incluindo as equipes participantes, tabelas de classificação 
          atualizadas e todas as rodadas de partidas.
        </p>
      </div>
      )}
      {renderCompetitionType()}
    </div>
  );
}