import type { Match } from "@/types/competition";
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { Volleyball, Edit } from "lucide-react";
import { useState } from "react";
import CustomDialog from "../custom-dialog";
import ActionButton from "../action-button";
import type { Team } from "@/types/team";

interface MatchCardProps {
  match: Match;
  variant?: "student" | "organizer";
  onEditMatch?: (match: Match) => void;
  teamOptions?: Array<{ value: string; label: string }>;
  teams?: Team[];
}

const formatMatchTime = (datetime: string | null | undefined) => {
  if (!datetime) {
    return { date: 'A definir', time: '' };
  }
  const dateObj = dayjs(datetime);
  return {
    date: dateObj.format('DD/MM'),
    time: dateObj.format('HH:mm'),
  };
};

export default function MatchCard({ 
  match, 
  variant = "student", 
  onEditMatch,
  teamOptions = [],
  teams
}: MatchCardProps) {
  const { date, time } = formatMatchTime(match.scheduled_datetime);
  const teamHomeId = match.team_home?.team_id;
  const teamAwayId = match.team_away?.team_id;

  const teamHomeName = teams?.find(team => team.id === teamHomeId)?.name ?? 'A definir';
  const teamAwayName = teams?.find(team => team.id === teamAwayId)?.name ?? 'A definir';

  const [editGameDialogOpen, setEditGameDialogOpen] = useState(false);
  const [homeTeamSelect, setHomeTeamSelect] = useState(teamHomeName);
  const [awayTeamSelect, setAwayTeamSelect] = useState(teamAwayName);
  const [gameDate, setGameDate] = useState(
    match.scheduled_datetime ? dayjs(match.scheduled_datetime).format('YYYY-MM-DD') : ''
  );
  const [gameTime, setGameTime] = useState(
    match.scheduled_datetime ? dayjs(match.scheduled_datetime).format('HH:mm') : ''
  );
  const [gameRound, setGameRound] = useState(match.round ?? 1);

  const handleEditGameClick = (e: React.MouseEvent, game: Match) => {
    e.preventDefault();
    e.stopPropagation();
    setEditGameDialogOpen(true);
  };

  const handleGameSubmit = () => {
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

  return (
    <>
      <div className="relative flex flex-col gap-3 pt-4 w-full overflow-hidden bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between gap-4 px-4">
          <div className="p-1.5 flex items-center bg-green-100 rounded-md">
            <Volleyball size={16} className="text-[#4CAF50]" />
          </div>
          <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded">
            {match.status}
          </span>
        </div>
        
        <div className="flex items-center justify-center gap-6 px-4 py-3">
          <p className="w-20 text-center text-xs font-semibold text-gray-700" title={teamHomeName}>
            {teamHomeName}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-gray-800">{match.score_home ?? '-'}</span>
            <span className="text-gray-400">vs</span>
            <span className="text-lg font-bold text-gray-800">{match.score_away ?? '-'}</span>
          </div>
          <p className="w-20 text-center text-xs font-semibold text-gray-700" title={teamAwayName}>
            {teamAwayName}
          </p>
        </div>
        
        <div className="flex items-center justify-center text-xs text-white font-semibold bg-[#4CAF50] py-2.5">
          {variant === "organizer" ? (
            <div className="flex items-center gap-4">
              <span>{date}{time && ` - ${time}`}</span>
              <button
                onClick={(e) => handleEditGameClick(e, match)}
                className="bg-transparent border-none p-0 hover:scale-110 transition-transform"
              >
                <Edit size={12} />
              </button>
            </div>
          ) : (
            <p>
              {date}
              {time && ` - ${time}`}
            </p>
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
      )}
    </>
  );
}