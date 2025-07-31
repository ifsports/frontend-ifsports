"use client"

import React, { useState, useMemo } from 'react';
import { ChevronLeft, Edit, Volleyball } from 'lucide-react';
import ActionButton from '../shared/action-button';
import CustomDialog from '../shared/custom-dialog';
import type { Competition, GroupData, Match } from '@/types/competition';
import type { Team } from '@/types/team';
import GroupTable from '../shared/competitions/group-table';
import Link from 'next/link';

interface OrganizerPointsCompetitionProps {
  competition: Competition;
  groups: GroupData[];
}

interface GameForEdit {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  date: string;
  time: string;
  status: 'Encerrado' | 'Agendado' | 'Em andamento';
  round: number;
  originalMatch: Match;
}

export default function OrganizerPointsCompetition({ 
  competition, 
  groups 
}: OrganizerPointsCompetitionProps) {
  const [endCompDialogOpen, setEndCompDialogOpen] = useState(false);
  const [editGameDialogOpen, setEditGameDialogOpen] = useState(false);
  const [activeRoundIndex, setActiveRoundIndex] = useState(0);

  const [selectedGame, setSelectedGame] = useState<GameForEdit | null>(null);
  const [gameDate, setGameDate] = useState('');
  const [gameTime, setGameTime] = useState('');
  const [gamePhase, setGamePhase] = useState('');
  const [gameRound, setGameRound] = useState<number>(1);
  const [homeTeamSelect, setHomeTeamSelect] = useState('');
  const [awayTeamSelect, setAwayTeamSelect] = useState('');

  // pega todas as classificações de todos os grupos para criar uma tabela geral
  const allClassifications = useMemo(() => {
    return groups.flatMap(group => group.classifications);
  }, [groups]);

  // pega todos os times únicos
  const allTeams = useMemo(() => {
    const teamsMap = new Map<string, Team>();
    groups.forEach(group => {
      group.classifications.forEach(classification => {
        teamsMap.set(classification.team.id, classification.team);
      });
    });
    return Array.from(teamsMap.values());
  }, [groups]);

  // cria os times para o select
  const teamOptions = useMemo(() => {
    return allTeams.map(team => ({
      value: team.id,
      label: team.name
    }));
  }, [allTeams]);

  // pega as rodadas de um grupo
  const allRounds = useMemo(() => {
    const roundsMap = new Map<string, { name: string; matches: GameForEdit[] }>();
    
    groups.forEach(group => {
      group.rounds?.forEach(round => {
        if (!roundsMap.has(round.name)) {
          roundsMap.set(round.name, { name: round.name, matches: [] });
        }
        
        const games: GameForEdit[] = round.matches.map(match => {
          const homeTeam = allTeams.find(t => t.id === match.team_home?.team_id);
          const awayTeam = allTeams.find(t => t.id === match.team_away?.team_id);
          
          const date = new Date(match.scheduled_datetime || '');
          const status = match.status === 'finished' ? 'Encerrado' : 
                       match.status === 'in-progress' ? 'Em andamento' : 'Agendado';
          
          return {
            id: match.id,
            homeTeam: homeTeam?.name || 'TBD',
            awayTeam: awayTeam?.name || 'TBD',
            homeScore: match.score_home ?? null,
            awayScore: match.score_away ?? null,
            date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            status,
            round: match.round_match_number || 1,
            originalMatch: match
          };
        });
        
        roundsMap.get(round.name)!.matches.push(...games);
      });
    });
    
    return Array.from(roundsMap.values());
  }, [groups, allTeams]);

  const handleEditGameClick = (e: React.MouseEvent, game: GameForEdit) => {
    e.stopPropagation();
    setSelectedGame(game);
    
    const matchDate = new Date(game.originalMatch.scheduled_datetime || '');
    setGameDate(matchDate.toISOString().split('T')[0]);
    setGameTime(matchDate.toTimeString().slice(0, 5));
    setGamePhase('group-phase'); 
    setGameRound(game.round);
    setHomeTeamSelect(game.originalMatch.team_home?.team_id || '');
    setAwayTeamSelect(game.originalMatch.team_away?.team_id || '');
    setEditGameDialogOpen(true);
  };

  const handleGameSubmit = () => {
    if (!selectedGame) return;
    
    console.log('Game updated:', {
      gameId: selectedGame.id,
      homeTeam: homeTeamSelect,
      awayTeam: awayTeamSelect,
      date: gameDate,
      time: gameTime,
      phase: gamePhase,
      round: gameRound
    });
    
    // atualizar jogo
    
    setEditGameDialogOpen(false);
    setSelectedGame(null);
  };

  const handleEndCompetition = () => {
    console.log('Competitição finalizada:', competition.id);
    
    // finalizar competição

    setEndCompDialogOpen(false);
  };

  return (
    <div className="min-h-screen">
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
          onClick={() => setEndCompDialogOpen(true)}
          className="bg-red-500 text-white cursor-pointer px-6 py-2.5 rounded-lg font-semibold"
        >
          Encerrar competição
        </ActionButton>
      </div>

      <div className="mb-12">
        <GroupTable 
          groupName="Geral" 
          classifications={allClassifications} 
        />
      </div>

      {allRounds.length > 0 && (
        <>
          <div className="flex items-center border-b border-gray-100 mb-8">
            {allRounds.map((round, index) => (
              <button
                key={round.name}
                onClick={() => setActiveRoundIndex(index)}
                className={`border-0 border-b-2 bg-none px-3 pb-4 font-semibold cursor-pointer transition-all duration-200 ${
                  activeRoundIndex === index
                    ? 'text-[#4CAF50] border-b-green-500'
                    : 'text-gray-600 border-b-transparent hover:text-green-800'
                }`}
              >
                {round.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 items-center gap-6 flex-wrap justify-center lg:justify-start max-lg:grid-cols-2 max-sm:grid-cols-1">
            {allRounds[activeRoundIndex]?.matches.map((game) => (
              <div
                key={game.id}
                className="relative flex flex-col gap-3 pt-4 w-full overflow-hidden bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between gap-4 px-4">
                  <div className="p-1.5 flex items-center bg-green-100 rounded-md">
                    <Volleyball size={16} className="text-[#4CAF50]" />
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded">
                    {game.status}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-6 px-4 py-3">
                  <p className="w-20 text-center text-xs font-semibold text-gray-700">{game.homeTeam}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-gray-800">{game.homeScore ?? '-'}</span>
                    <span className="text-gray-400">vs</span>
                    <span className="text-lg font-bold text-gray-800">{game.awayScore ?? '-'}</span>
                  </div>
                  <p className="w-20 text-center text-xs font-semibold text-gray-700">{game.awayTeam}</p>
                </div>
                <div className="flex items-center justify-center text-xs text-white font-semibold bg-[#4CAF50] py-2.5">
                  <div className="flex items-center gap-4">
                    <span>{game.date} - {game.time}</span>
                    <button
                      onClick={(e) => handleEditGameClick(e, game)}
                      className="bg-transparent border-none p-0 hover:scale-110 transition-transform"
                    >
                      <Edit size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <CustomDialog
        open={endCompDialogOpen}
        onClose={() => setEndCompDialogOpen(false)}
        title="Encerrar competição?"
        className="max-w-[42.438rem] w-full p-8 bg-[#F5F6FA]"
      >
        <p className="mb-6 text-gray-700">
          Tem certeza de que deseja encerrar a competição "{competition.name}"? 
          Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-4 justify-end">
          <ActionButton variant="danger" onClick={handleEndCompetition}>
            Encerrar
          </ActionButton>
        </div>
      </CustomDialog>

      <CustomDialog
        open={editGameDialogOpen}
        onClose={() => setEditGameDialogOpen(false)}
        title="Editar jogo"
      >
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <label className="text-[#062601]">Time casa</label>
              <div className="border border-[#d9e1e7] rounded-lg px-5 bg-white">
                <select
                  value={homeTeamSelect}
                  onChange={(e) => setHomeTeamSelect(e.target.value)}
                  className={`w-full py-4 border-none bg-white outline-none ${
                    homeTeamSelect === '' ? 'text-[#a9a9a9]' : 'text-[#062601]'
                  }`}
                  required
                >
                  <option value="" disabled>Selecione uma equipe</option>
                  {teamOptions.map(option => (
                    <option key={option.value} value={option.value} className="text-[#062601]">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[#062601]">Time fora</label>
              <div className="border border-[#d9e1e7] rounded-lg px-5 bg-white">
                <select
                  value={awayTeamSelect}
                  onChange={(e) => setAwayTeamSelect(e.target.value)}
                  className={`w-full py-4 border-none bg-white outline-none ${
                    awayTeamSelect === '' ? 'text-[#a9a9a9]' : 'text-[#062601]'
                  }`}
                  required
                >
                  <option value="" disabled>Selecione uma equipe</option>
                  {teamOptions.map(option => (
                    <option key={option.value} value={option.value} className="text-[#062601]">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <hr />

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-3">
              <label className="text-[#062601]">Data</label>
              <input
                type="date"
                value={gameDate}
                onChange={(e) => setGameDate(e.target.value)}
                className="p-2 border border-[#d9e1e7] rounded-lg"
                required
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[#062601]">Hora</label>
              <input
                type="time"
                value={gameTime}
                onChange={(e) => setGameTime(e.target.value)}
                className="p-2 border border-[#d9e1e7] rounded-lg"
                required
              />
            </div>

            <div className="flex flex-col gap-3 col-span-1">
              <label className="text-[#062601]">Rodada</label>
              <input
                type="number"
                value={gameRound}
                onChange={(e) => setGameRound(Number(e.target.value))}
                className="p-2 border border-[#d9e1e7] rounded-lg"
                min="1"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <ActionButton type="submit" onClick={handleGameSubmit}>
              Confirmar alterações
            </ActionButton>
          </div>
        </div>
      </CustomDialog>
    </div>
  );
}