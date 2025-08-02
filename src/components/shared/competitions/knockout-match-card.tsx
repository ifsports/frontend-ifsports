"use client"

import { Edit, Volleyball } from "lucide-react";
import TruncatedTeamName from "./truncated-team-name";
import type { Match } from "@/types/competition";
import type { Team } from "@/types/team";
import dayjs from "dayjs";
import CustomDialog from "../custom-dialog";
import { useState } from "react";
import ActionButton from "../action-button";

interface KnockoutMatchCardProps {
  match: Match;
  homeTeam?: Team;
  awayTeam?: Team;
  stageName?: string;
  variant?: "student" | "organizer";
  onEditMatch?: (match: Match) => void;
  teamOptions?: Array<{ value: string; label: string }>;
}

const formatMatchTime = (datetime: string | null | undefined) => {
  if (!datetime) {
    return 'A definir';
  }
  const dateObj = dayjs(datetime);
  return dateObj.format('DD/MM - HH:mm');
};

export default function KnockoutMatchCard({ match, homeTeam, awayTeam, stageName, variant = "student", onEditMatch, teamOptions = [] }: KnockoutMatchCardProps) {
  const [editGameDialogOpen, setEditGameDialogOpen] = useState(false);
  const [homeTeamSelect, setHomeTeamSelect] = useState(homeTeam?.id || match.team_home?.team_id || '');
  const [awayTeamSelect, setAwayTeamSelect] = useState(awayTeam?.id || match.team_away?.team_id || '');
  const [gameDate, setGameDate] = useState(
    match.scheduled_datetime ? dayjs(match.scheduled_datetime).format('YYYY-MM-DD') : ''
  );
  const [gameTime, setGameTime] = useState(
    match.scheduled_datetime ? dayjs(match.scheduled_datetime).format('HH:mm') : ''
  );
  const [gameRound, setGameRound] = useState(
    match.round ? parseInt(match.round, 10) : 1
  );

  const handleEditGameClick = (e: React.MouseEvent, match: Match) => {
    e.preventDefault();
    e.stopPropagation();
    setEditGameDialogOpen(true);
  };

  const handleGameSubmit = () => {
    
    // salvar as alterações do jogo

    const updatedMatch: Match = {
      ...match,
      team_home: { team_id: homeTeamSelect, competition: match.competition },
      team_away: { team_id: awayTeamSelect, competition: match.competition },
      scheduled_datetime: `${gameDate}T${gameTime}:00`,
      round: gameRound.toString()
    };
    
    if (onEditMatch) {
      onEditMatch(updatedMatch);
    }
    
    setEditGameDialogOpen(false);
  };

  const formattedDateTime = formatMatchTime(match.scheduled_datetime);

  return (
    <>
      <div className="flex-1 flex flex-col gap-4 pt-4 bg-white rounded-md hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between gap-4 px-4">
          <div className="p-1.5 flex items-center bg-green-100 rounded-md">
            <Volleyball size={16} className="text-[#4CAF50]" />
          </div>
          <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded">
            {match.status}
          </span>
        </div>
        
        <div className="w-full flex items-center justify-center gap-16 px-4 h-10">
          <div className="w-36 overflow-hidden break-words flex items-center justify-center text-gray-800 text-sm font-semibold text-center">
            <TruncatedTeamName name={homeTeam?.abbreviation || homeTeam?.name || "A definir"} maxLength={3} />
          </div>
          <div className="flex items-center justify-center gap-8 text-gray-800 text-sm font-semibold text-center">
            <span className="text-base">{match.score_home ?? '–'}</span>
            <span>X</span>
            <span className="text-base">{match.score_away ?? '–'}</span>
          </div>
          <div className="w-36 overflow-hidden break-words flex items-center justify-center text-gray-800 text-sm font-semibold text-center">
            <TruncatedTeamName name={awayTeam?.abbreviation || awayTeam?.name || "A definir"} maxLength={3} />
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-[#4CAF50] font-semibold px-4 pb-4">
          <p>ELIMINATÓRIAS</p>
          {variant === "organizer" ? (
            <div className="flex items-center gap-2">
              <p>{formattedDateTime}</p>
              <button
                onClick={(e) => handleEditGameClick(e, match)}
                className="bg-transparent border-none p-0 hover:scale-110 transition-transform text-[#4CAF50]"
              >
                <Edit size={14} />
              </button>
            </div>
          ) : (
            <p>{formattedDateTime}</p>
          )}
        </div>
      </div>

      {variant === "organizer" && (
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
                  value={Number.isNaN(gameRound) ? '' : gameRound}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!Number.isNaN(val) && val >= 1) {
                      setGameRound(val);
                    } else {
                      setGameRound(1);
                    }
                  }}
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
      )}
    </>
  );
}