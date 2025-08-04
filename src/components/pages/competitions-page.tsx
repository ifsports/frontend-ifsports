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
  getCompetitionStandings,
  putEditGame
} from '@/lib/requests/competitions';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { getTeamFromCampusNoAuth } from '@/lib/requests/teams';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editGameSchema, type EditGameFormData } from "@/lib/schemas/edit-game-schema";
import CustomDialog from '../shared/custom-dialog';
import ActionButton from '../shared/action-button';

export interface RawStanding {
  id: string;
  team: string; 
  position: number;
  points: number;
  games_played: number;
  wins: number;
  draws: number;
  losses: number;
  score_pro: number;
  score_against: number;
  score_difference: number;
  group?: {
    id: string;
    name: string;
  };
}

interface GameForEdit {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  date: string;
  time: string;
  status: "Encerrado" | "Pendente" | "Em andamento";
  round: number;
  originalMatch: Match;
}

interface CompetitionPageProps {
  competitionId: string;
  campusId: string;
  variant?: "student" | "organizer";
}

const generateEliminationRoundNames = (totalRounds: number): string[] => {
  const orderedSpecificNames: string[] = [
    'Primeira Fase',
    'Oitavas de Final',
    'Quartas de Final',
    'Semifinal',
    'Final'
  ];
  const names: string[] = [];
  if (totalRounds <= orderedSpecificNames.length) {
    return orderedSpecificNames.slice(0, totalRounds);
  } else {
    const genericPhasesCount = totalRounds - orderedSpecificNames.length;
    for (let i = 1; i <= genericPhasesCount; i++) {
      names.push(`${i}ª Fase Eliminatória`);
    }
    return names.concat(orderedSpecificNames);
  }
};

const calculateEliminationPhases = (totalTeams: number): string[] => {
  const phases: string[] = [];
  let teamsRemaining = totalTeams;
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


export default function CompetitionPage({ competitionId, campusId, variant="student" }: CompetitionPageProps) {
  const [competition, setCompetition] = useState<Competition>();
  const [competitionTeams, setCompetitionTeams] = useState<CompetitionTeam[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [rounds, setRounds] = useState<RoundData[]>([]);
  const [standings, setStandings] = useState<RawStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [editGameDialogOpen, setEditGameDialogOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameForEdit | null>(null);

  const form = useForm<EditGameFormData>({
    resolver: zodResolver(editGameSchema),
    defaultValues: {
      team_home_id: '',
      team_away_id: '',
      date: '',
      time: '',
      round: '',
    },
  });

  const { register, handleSubmit, formState: { errors }, watch, reset } = form;

  const watchedHomeTeam = watch('team_home_id');
  const watchedAwayTeam = watch('team_away_id');

  function matchToGameForEdit(match: Match): GameForEdit {
    const homeTeam = teams.find((t) => t.id === match.team_home?.team_id);
    const awayTeam = teams.find((t) => t.id === match.team_away?.team_id);

    const dateObj = match.scheduled_datetime ? new Date(match.scheduled_datetime) : null;
    const isValidDate = dateObj ? !isNaN(dateObj.getTime()) : false;

    const date = isValidDate
      ? dateObj!.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
      : "";
    const time = isValidDate
      ? dateObj!.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      : "";

    const status =
      match.status === "finished"
        ? "Encerrado"
        : match.status === 'in-progress'
        ? "Em andamento"
        : "Pendente";

    return {
      id: match.id,
      homeTeam: homeTeam?.name || "A definir",
      awayTeam: awayTeam?.name || "A definir",
      homeScore: match.score_home ?? null,
      awayScore: match.score_away ?? null,
      date,
      time,
      status,
      round: match.round_match_number || 1,
      originalMatch: match,
    };
  }

  useEffect(() => {
    if (selectedGame && editGameDialogOpen) {
      const dateObj = new Date(selectedGame.originalMatch.scheduled_datetime || "");
      const isValidDate = !isNaN(dateObj.getTime());

      reset({
        team_home_id: selectedGame.originalMatch.team_home?.team_id || '',
        team_away_id: selectedGame.originalMatch.team_away?.team_id || '',
        date: isValidDate ? dateObj.toISOString().split('T')[0] : '',
        time: isValidDate ? dateObj.toTimeString().slice(0, 5) : '',
        round: selectedGame.originalMatch.round || '',
      });
    } else if (!editGameDialogOpen) {
        reset({
            team_home_id: '',
            team_away_id: '',
            date: '',
            time: '',
            round: '',
        });
        setSelectedGame(null);
    }
  }, [selectedGame, editGameDialogOpen, reset]);

  const handleRefreshData = async () => {
      await fetchData();
      toast.info("Dados da competição atualizados!");
  };

  const onSubmit = async (data: EditGameFormData) => {
    try {
      const updateData: { [key: string]: any } = {};

      if (data.team_home_id !== '') updateData.team_home_id = data.team_home_id; else updateData.team_home_id = null;
      if (data.team_away_id !== '') updateData.team_away_id = data.team_away_id; else updateData.team_away_id = null;
      if (data.round !== '') updateData.round = data.round; else updateData.round = null;

      if (data.date && data.time) {
        const localDateTimeString = `${data.date}T${data.time}:00`;
        const localDate = new Date(localDateTimeString);
        const offsetMinutes = localDate.getTimezoneOffset();
        const utcDate = new Date(localDate.getTime() - (offsetMinutes * 60 * 1000));
        updateData.scheduled_datetime = utcDate.toISOString();
      } else if (data.date && !data.time) {
        const localDateString = `${data.date}T00:00:00`;
        const localDate = new Date(localDateString);
        const offsetMinutes = localDate.getTimezoneOffset();
        const utcDate = new Date(localDate.getTime() - (offsetMinutes * 60 * 1000));
        updateData.scheduled_datetime = utcDate.toISOString();
      } else if (!data.date && data.time) {
        const currentDate = selectedGame?.originalMatch.scheduled_datetime
          ? new Date(selectedGame.originalMatch.scheduled_datetime).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];
        const localDateTimeString = `${currentDate}T${data.time}:00`;
        const localDate = new Date(localDateTimeString);
        const offsetMinutes = localDate.getTimezoneOffset();
        const utcDate = new Date(localDate.getTime() - (offsetMinutes * 60 * 1000));
        updateData.scheduled_datetime = utcDate.toISOString();
      } else {
        updateData.scheduled_datetime = null;
      }

      const finalPayload: { [key: string]: any } = {};
      for (const key in updateData) {
          if (updateData[key] !== undefined) {
              finalPayload[key] = updateData[key];
          }
      }

      if (!selectedGame) {
          toast.error("Nenhuma partida selecionada para atualização.");
          return;
      }

      const response = await putEditGame({matchId: selectedGame.id, data: finalPayload});

      if (!response.success) {
        toast.error(response.error);
        return;
      }

      toast.success("Jogo atualizado com sucesso!");
      setEditGameDialogOpen(false);
      handleRefreshData();
      setSelectedGame(null);

    } catch (error) {
      toast.error("Erro ao atualizar jogo");
    }
  };

  const handleEditMatchClick = (matchToEdit: Match) => {
    setSelectedGame(matchToGameForEdit(matchToEdit));
    setEditGameDialogOpen(true);
  };

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

          for (const roundId in roundsMap) {
            roundsMap[roundId].sort((a, b) => {
                const dateA = a.scheduled_datetime ? new Date(a.scheduled_datetime).getTime() : 0;
                const dateB = b.scheduled_datetime ? new Date(b.scheduled_datetime).getTime() : 0;

                if (dateA !== dateB) {
                    return dateA - dateB;
                }
                return a.id.localeCompare(b.id);
            });
          }

          const sortedRoundIds = Object.keys(roundsMap).sort((a, b) => {
            const numA = parseInt(a, 10);
            const numB = parseInt(b, 10);
            if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
            }
            return 0;
          });

          const roundsData: RoundData[] = sortedRoundIds.map((roundId, index) => {
            let roundName = `Rodada ${index + 1}`;

            if (compResult.data?.system === 'elimination') {
              roundName = `Rodada ${index + 1}`;
            } else if (compResult.data?.system === 'groups_elimination') {
              const totalRounds = sortedRoundIds.length;
              const eliminationNames = generateEliminationRoundNames(totalRounds);
              roundName = eliminationNames[index] || roundName;
            }

            return {
              id: roundId,
              name: roundName,
              matches: roundsMap[roundId],
            };
          });

          roundsData.sort((a, b) => {
            const extractOrderFromPhaseName = (name: string): number => {
                const genericMatch = name.match(/Rodada (\d+)/) || name.match(/(\d+)ª Fase/);
                if (genericMatch && genericMatch[1]) {
                    return parseInt(genericMatch[1], 10);
                }
                switch (name.toLowerCase()) {
                    case 'final': return 100;
                    case 'semifinal': return 90;
                    case 'quartas de final': return 80;
                    case 'oitavas de final': return 70;
                    case 'primeira fase': return 60;
                    default: return Infinity;
                }
            };
            const orderA = extractOrderFromPhaseName(a.name);
            const orderB = extractOrderFromPhaseName(b.name);
            return orderA - orderB;
        });

          setRounds(roundsData);

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

  useEffect(() => {
    fetchData();
  }, [competitionId, campusId]);

  const groupsData: GroupData[] = useMemo(() => {
    if (!competition || !teams || teams.length === 0) {
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
      const processedStandings: TeamClassification[] = standings.map(rawStanding => {
        const team = teams.find(t => t.id === rawStanding.team);
        return {
          id: rawStanding.id,
          team: team!,
          position: rawStanding.position,
          games_played: rawStanding.games_played,
          wins: rawStanding.wins,
          draws: rawStanding.draws,
          losses: rawStanding.losses,
          score_pro: rawStanding.score_pro,
          score_against: rawStanding.score_against,
          score_difference: rawStanding.score_difference,
          points: rawStanding.points,
        };
      }).filter(s => s.team); 

      return [
        {
          id: 'league',
          name: 'Tabela Geral',
          classifications: processedStandings,
          rounds,
        },
      ];
    }

    if (competition.system === 'groups_elimination') {
      const finalGroups: GroupData[] = [];

      const groupedStandings: Record<string, RawStanding[]> = {};
      standings.forEach(standing => {
        const groupId = standing.group?.id;
        if (groupId) {
          if (!groupedStandings[groupId]) {
            groupedStandings[groupId] = [];
          }
          groupedStandings[groupId].push(standing);
        }
      });

      if (Object.keys(groupedStandings).length > 0) {
        const groupedRoundsByMatchGroup: Record<string, RoundData[]> = {};
        
        const allMatchesByGroup: Record<string, Match[]> = {};
        
        rounds.forEach(round => {
          const matchesByGroup: Record<string, Match[]> = {};
          
          (round.matches || []).forEach(match => {
            if (match.group) {
              if (!matchesByGroup[match.group]) matchesByGroup[match.group] = [];
              matchesByGroup[match.group].push(match);
              
              if (!allMatchesByGroup[match.group]) allMatchesByGroup[match.group] = [];
              allMatchesByGroup[match.group].push(match);
            }
          });
          
          for (const groupId in matchesByGroup) {
            if (!groupedRoundsByMatchGroup[groupId]) groupedRoundsByMatchGroup[groupId] = [];
            groupedRoundsByMatchGroup[groupId].push({
              id: `${round.id}-${groupId}`,
              name: round.name,
              matches: matchesByGroup[groupId]
            });
          }
        });
        
        Object.keys(groupedStandings).forEach(groupId => {
          if (!groupedRoundsByMatchGroup[groupId] || groupedRoundsByMatchGroup[groupId].length === 0) {
            const groupMatches = allMatchesByGroup[groupId] || [];
            
            if (groupMatches.length > 0) {
              const matchesByRound: Record<string, Match[]> = {};
              groupMatches.forEach(match => {
                const roundId = match.round || 'rodada-desconhecida';
                if (!matchesByRound[roundId]) matchesByRound[roundId] = [];
                matchesByRound[roundId].push(match);
              });
              
              const createdRounds: RoundData[] = Object.keys(matchesByRound).sort((a, b) => {
                const numA = parseInt(a, 10);
                const numB = parseInt(b, 10);
                if (!isNaN(numA) && !isNaN(numB)) {
                  return numA - numB;
                }
                return 0;
              }).map(roundId => ({
                id: roundId,
                name: rounds.find(r => r.id === roundId)?.name || `Rodada ${roundId}`,
                matches: matchesByRound[roundId]
              }));
              
              groupedRoundsByMatchGroup[groupId] = createdRounds;
            }
          }
        });

        Object.keys(groupedStandings).forEach(groupId => {
          const rawStandingsInGroup = groupedStandings[groupId];
          const sampleStanding = rawStandingsInGroup[0];
          const groupName = sampleStanding?.group?.name || `Grupo ${groupId.slice(-1).toUpperCase()}`;
          
          const processedStandings: TeamClassification[] = rawStandingsInGroup.map(rawStanding => {
            const team = teams.find(t => t.id === rawStanding.team);
            return {
              id: rawStanding.id,
              team: team!,
              position: rawStanding.position,
              games_played: rawStanding.games_played,
              wins: rawStanding.wins,
              draws: rawStanding.draws,
              losses: rawStanding.losses,
              score_pro: rawStanding.score_pro,
              score_against: rawStanding.score_against,
              score_difference: rawStanding.score_difference,
              points: rawStanding.points,
            };
          }).filter(s => s.team);
          
          finalGroups.push({
            id: groupId,
            name: groupName,
            classifications: processedStandings,
            rounds: groupedRoundsByMatchGroup[groupId] || [],
          });
          
        });

      } else {
        const uniqueGroupIdsFromMatches = new Set<string>();
        const matchesByGroupId: Record<string, Match[]> = {};

        rounds.forEach(round => {
          (round.matches || []).forEach(match => {
            if (match.group) {
              uniqueGroupIdsFromMatches.add(match.group);
              if (!matchesByGroupId[match.group]) {
                matchesByGroupId[match.group] = [];
              }
              matchesByGroupId[match.group].push(match);
            }
          });
        });

        if (uniqueGroupIdsFromMatches.size === 1) {
          const teamsPerGroup = competition.teams_per_group || 4;
          const totalTeams = teams.length;
          const numberOfGroups = Math.ceil(totalTeams / teamsPerGroup);
          
          const teamsByGroup: Record<string, Team[]> = {};
          teams.forEach((team, index) => {
            const groupIndex = Math.floor(index / teamsPerGroup);
            const groupId = `group-${groupIndex}`;
            if (!teamsByGroup[groupId]) {
              teamsByGroup[groupId] = [];
            }
            teamsByGroup[groupId].push(team);
          });
          
          const allMatches = rounds.flatMap(round => round.matches || []);
          const matchesByGroup: Record<string, Match[]> = {};
          
          allMatches.forEach(match => {
            const homeTeamId = match.team_home?.team_id;
            const awayTeamId = match.team_away?.team_id;
            
            let homeTeamGroup: string | null = null;
            let awayTeamGroup: string | null = null;
            
            Object.entries(teamsByGroup).forEach(([groupId, groupTeams]) => {
              if (groupTeams.some(team => team.id === homeTeamId)) {
                homeTeamGroup = groupId;
              }
              if (groupTeams.some(team => team.id === awayTeamId)) {
                awayTeamGroup = groupId;
              }
            });
            
            if (homeTeamGroup && awayTeamGroup && homeTeamGroup === awayTeamGroup) {
              if (!matchesByGroup[homeTeamGroup]) {
                matchesByGroup[homeTeamGroup] = [];
              }
              matchesByGroup[homeTeamGroup].push(match);
            }
          });
          
          for (let i = 0; i < numberOfGroups; i++) {
            const groupId = `group-${i}`;
            const groupName = `Grupo ${String.fromCharCode(65 + i)}`;
            const groupTeams = teamsByGroup[groupId] || [];
            const groupMatches = matchesByGroup[groupId] || [];
            
            const finalGroupMatches = [...groupMatches];
            
            const expectedMatches = (groupTeams.length * (groupTeams.length - 1)) / 2;
            
            if (finalGroupMatches.length < expectedMatches && groupTeams.length >= 2) {
              for (let j = 0; j < groupTeams.length; j++) {
                for (let k = j + 1; k < groupTeams.length; k++) {
                  const homeTeam = groupTeams[j];
                  const awayTeam = groupTeams[k];
                  
                  const existingMatch = finalGroupMatches.find(match => 
                    (match.team_home?.team_id === homeTeam.id && match.team_away?.team_id === awayTeam.id) ||
                    (match.team_home?.team_id === awayTeam.id && match.team_away?.team_id === homeTeam.id)
                  );
                  
                  if (!existingMatch) {
                    const fakeMatch: Match = {
                      id: `fake-${groupId}-${j}-${k}`,
                      competition: competition.id,
                      round: '1',
                      round_match_number: finalGroupMatches.length + 1,
                      group: groupId,
                      team_home: {
                        competition: competition.id,
                        team_id: homeTeam.id
                      },
                      team_away: {
                        competition: competition.id,
                        team_id: awayTeam.id
                      },
                      status: 'not-started',
                      scheduled_datetime: null,
                      home_feeder_match: null,
                      away_feeder_match: null,
                      score_home: null,
                      score_away: null,
                      winner: null
                    };
                    
                    finalGroupMatches.push(fakeMatch);
                  }
                }
              }
            }
            
            const classifications: TeamClassification[] = groupTeams
              .map((team, index) => createEmptyClassification(team, index + 1))
              .filter(Boolean) as TeamClassification[];
            
            const roundsByGroup: Record<string, Match[]> = {};
            
            const matchesPerRound = groupTeams.length === 4 ? 2 : finalGroupMatches.length;
            const numberOfRounds = Math.ceil(finalGroupMatches.length / matchesPerRound);
            
            finalGroupMatches.forEach((match, index) => {
              const roundNumber = Math.floor(index / matchesPerRound) + 1;
              const roundId = roundNumber.toString();
              
              if (!roundsByGroup[roundId]) {
                roundsByGroup[roundId] = [];
              }
              roundsByGroup[roundId].push({
                ...match,
                round: roundId,
                round_match_number: index + 1
              });
            });
            
            const groupRounds: RoundData[] = Object.keys(roundsByGroup).sort((a, b) => {
              const numA = parseInt(a, 10);
              const numB = parseInt(b, 10);
              if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
              }
              return 0;
            }).map((roundId, index) => {
              const roundName = `Rodada ${index + 1}`;
              
              return {
                id: roundId,
                name: roundName,
                matches: roundsByGroup[roundId]
              };
            });
            
            finalGroups.push({
              id: groupId,
              name: groupName,
              classifications: classifications,
              rounds: groupRounds,
            });
          }
          
        } else {
        const sortedUniqueGroupIds = Array.from(uniqueGroupIdsFromMatches).sort();

        const groupNamesMap: Record<string, string> = {};
        sortedUniqueGroupIds.forEach((groupId, index) => {
            groupNamesMap[groupId] = `Grupo ${String.fromCharCode(65 + index)}`;
        });

        sortedUniqueGroupIds.forEach(groupId => {
          const groupMatches = matchesByGroupId[groupId];
          const groupName = groupNamesMap[groupId];

          const teamIdsInGroup = new Set<string>();
          groupMatches.forEach(match => {
            if (match.team_home?.team_id) teamIdsInGroup.add(match.team_home.team_id);
            if (match.team_away?.team_id) teamIdsInGroup.add(match.team_away.team_id);
          });

          const classifications: TeamClassification[] = Array.from(teamIdsInGroup)
            .map(teamId => {
              const team = teams.find(t => t.id === teamId);
                return team ? createEmptyClassification(team, 0) : null;
            })
            .filter(Boolean) as TeamClassification[];

          const inferredGroupRoundsMap: Record<string, Match[]> = {};
          groupMatches.forEach(match => {
            const roundId = match.round || 'rodada-desconhecida';
            if (!inferredGroupRoundsMap[roundId]) inferredGroupRoundsMap[roundId] = [];
            inferredGroupRoundsMap[roundId].push(match);
          });

          const inferredGroupRounds: RoundData[] = Object.keys(inferredGroupRoundsMap).sort((a, b) => {
            const numA = parseInt(a, 10);
            const numB = parseInt(b, 10);
            if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
            }
            return 0;
            }).map((roundId, index) => {
              const roundName = `Rodada ${index + 1}`;
              
              return {
            id: roundId,
                name: roundName,
            matches: inferredGroupRoundsMap[roundId]
              };
            });

          finalGroups.push({
            id: groupId,
            name: groupName,
            classifications: classifications,
            rounds: inferredGroupRounds,
          });
        });
        }
      }
      
      finalGroups.sort((a, b) => a.name.localeCompare(b.name));
      return finalGroups;
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
    if (!competition || (competition.system !== 'elimination' && competition.system !== 'groups_elimination')) return [];
    if (competition.system === 'groups_elimination') {
      const knockoutMatches: Match[] = [];
      rounds.forEach(round => {
        const knockoutMatchesInRound = (round.matches || []).filter(match => !match.group);
        if (knockoutMatchesInRound.length > 0) {
          knockoutMatches.push(...knockoutMatchesInRound);
        }
      });
      if (knockoutMatches.length > 0) {
        return [{
          id: 'knockout-phase',
          name: 'Fase Eliminatória',
          matches: knockoutMatches
        }];
      }
    }
    if (competition.system === 'elimination' && teams.length > 0) {
      const phases = calculateEliminationPhases(teams.length);
      return rounds.map((round, index) => ({
        ...round,
        name: phases[index] || round.name,
        matches: round.matches || []
      }));
    }
    return rounds.map(round => ({
      ...round,
      matches: round.matches || []
    }));
  }, [competition, rounds, teams]);

  const competitionData = useMemo(() => {
    if (!competition) return null;

    try {
      return populateCompetitionStages(competition, {
        numberOfGroups: groupsData.length,
      });
    } catch (error) {
      return null;
    }
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
            onEditMatchClick={handleEditMatchClick}
          />
        );

      case "elimination":
        return (
          <KnockoutCompetition
            competition={competitionData}
            teams={teams}
            rounds={knockoutRoundsData}
            variant={variant}
            onEditMatchClick={handleEditMatchClick}
          />
        );

      case "league":
        return (
          <PointsCompetition
            competition={competitionData}
            groups={groupsData}
            teams={teams}
            variant={variant}
            onMatchUpdated={handleRefreshData}
            onEditMatchClick={handleEditMatchClick}
          />
        );

      default:
        return <div>Tipo de competição não suportado</div>;
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center w-full ${variant === "student" ? 'h-full my-30 ' : ''}`}>
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

      {variant === "organizer" && selectedGame && (
        <CustomDialog open={editGameDialogOpen} onClose={() => setEditGameDialogOpen(false)} title="Editar jogo">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <label className="text-[#062601]">Time casa</label>
                <div className="border border-[#d9e1e7] rounded-lg px-5 bg-white">
                  <select
                    {...register('team_home_id')}
                    className={`w-full py-4 border-none bg-white outline-none ${
                      !watchedHomeTeam ? "text-[#a9a9a9]" : "text-[#062601]"
                    }`}
                  >
                    <option value="">Selecione uma equipe (opcional)</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id} className="text-[#062601]">
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.team_home_id && (
                  <span className="text-red-500 text-sm">{errors.team_home_id.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[#062601]">Time fora</label>
                <div className="border border-[#d9e1e7] rounded-lg px-5 bg-white">
                  <select
                    {...register('team_away_id')}
                    className={`w-full py-4 border-none bg-white outline-none ${
                      !watchedAwayTeam ? "text-[#a9a9a9]" : "text-[#062601]"
                    }`}
                  >
                    <option value="">Selecione uma equipe (opcional)</option>
                    {teams.filter(team => team.id !== watchedHomeTeam).map((team) => (
                      <option key={team.id} value={team.id} className="text-[#062601]">
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.team_away_id && (
                  <span className="text-red-500 text-sm">{errors.team_away_id.message}</span>
                )}
              </div>
            </div>

            <hr />

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-3">
                <label className="text-[#062601]">Data</label>
                <input
                  type="date"
                  {...register('date')}
                  className="p-2 border border-[#d9e1e7] rounded-lg"
                />
                {errors.date && (
                  <span className="text-red-500 text-sm">{errors.date.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[#062601]">Hora</label>
                <input
                  type="time"
                  {...register('time')}
                  className="p-2 border border-[#d9e1e7] rounded-lg"
                />
                {errors.time && (
                  <span className="text-red-500 text-sm">{errors.time.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-3 col-span-1">
                <label className="text-[#062601]">Rodada</label>
                <select
                  {...register('round')}
                  className="p-2 border border-[#d9e1e7] rounded-lg"
                >
                  <option value="">Selecione uma rodada (opcional)</option>
                  {rounds.filter(r => r.id !== 'rodada-desconhecida').map((round) => (
                    <option key={round.id} value={round.id}>
                      {round.name}
                    </option>
                  ))}
                </select>
                {errors.round && (
                  <span className="text-red-500 text-sm">{errors.round.message}</span>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setEditGameDialogOpen(false);
                  setSelectedGame(null);
                }}
                className="px-4 py-2 border border-[#d9e1e7] rounded-lg text-[#062601] hover:bg-gray-50"
              >
                Cancelar
              </button>
              <ActionButton type="submit">
                Confirmar alterações
              </ActionButton>
            </div>
          </form>
        </CustomDialog>
      )}
    </div>
  );
}