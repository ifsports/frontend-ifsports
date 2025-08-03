"use client";

import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { Volleyball, Edit } from "lucide-react";

import type { Match } from "@/types/competition";
import type { Team } from "@/types/team";

interface MatchCardProps {
  match: Match;
  variant?: "student" | "organizer";
  onEditMatchClick?: (match: Match) => void;
  teams?: Team[]; 
}

const formatMatchTime = (datetime: string | null | undefined) => {
  if (!datetime) {
    return 'A definir';
  }
  const dateObj = dayjs(datetime);
  return dateObj.format('DD/MM - HH:mm');
};

const formatMatchStatus = (status: string) => {
  switch (status) {
    case "in_progress":
      return "Em andamento";
    case "finished":
      return "Finalizada";
    default:
      return "Pendente";
  }
};

export default function MatchCard({
  match,
  variant = "student",
  onEditMatchClick,
  teams
}: MatchCardProps) {
  const formattedDateTime = formatMatchTime(match.scheduled_datetime);
  const teamHomeId = match.team_home?.team_id;
  const teamAwayId = match.team_away?.team_id;

  const teamHomeName = teams?.find(team => team.id === teamHomeId)?.name ?? 'A definir';
  const teamAwayName = teams?.find(team => team.id === teamAwayId)?.name ?? 'A definir';

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEditMatchClick) {
      onEditMatchClick(match);
    }
  };

  return (
    <>
      <div className="relative flex flex-col gap-3 pt-4 w-full overflow-hidden bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between gap-4 px-4">
          <div className="p-1.5 flex items-center bg-green-100 rounded-md">
            <Volleyball size={16} className="text-[#4CAF50]" />
          </div>
          <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded">
            {formatMatchStatus(match.status)}
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
              <span>{formattedDateTime}</span>
              <button
                onClick={handleEditClick}
                className="bg-transparent border-none p-0 hover:scale-110 transition-transform"
              >
                <Edit size={12} />
              </button>
            </div>
          ) : (
            <p>{formattedDateTime}</p>
          )}
        </div>
      </div>
    </>
  );
}