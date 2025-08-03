"use client"

import { Edit, Volleyball } from "lucide-react";
import TruncatedTeamName from "./truncated-team-name";
import type { Match } from "@/types/competition";
import type { Team } from "@/types/team";
import dayjs from "dayjs";

interface KnockoutMatchCardProps {
  match: Match;
  homeTeam?: Team;
  awayTeam?: Team;
  stageName?: string;
  variant?: "student" | "organizer";
  onEditMatchClick?: (match: Match) => void;
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

export default function KnockoutMatchCard({
  match,
  homeTeam,
  awayTeam,
  stageName,
  variant = "student",
  onEditMatchClick
}: KnockoutMatchCardProps) {

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEditMatchClick) {
      onEditMatchClick(match);
    }
  };

  const isPlaceholderMatch = match.id.startsWith('placeholder-') || match.team_home?.team_id === 'tbd' || match.team_away?.team_id === 'tbd';
  
  const shouldShowEditButton = variant === "organizer" && !isPlaceholderMatch;

  const formattedDateTime = formatMatchTime(match.scheduled_datetime);

  return (
    <>
      <div className="flex-1 flex flex-col gap-4 pt-4 bg-white rounded-md hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between gap-4 px-4">
          <div className="p-1.5 flex items-center bg-green-100 rounded-md">
            <Volleyball size={16} className="text-[#4CAF50]" />
          </div>
          <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded">
            {isPlaceholderMatch ? "Aguardando" : formatMatchStatus(match.status)}
          </span>
        </div>

        <div className="w-full flex items-center justify-center gap-16 px-4 h-10">
          <div className="w-36 overflow-hidden break-words flex items-center justify-center text-gray-800 text-sm font-semibold text-center">
            <TruncatedTeamName name={homeTeam?.abbreviation || homeTeam?.name || "A definir"} maxLength={3} />
          </div>
          <div className="flex items-center justify-center gap-8 text-gray-800 text-sm font-semibold text-center">
            <span className="text-base">{isPlaceholderMatch ? '–' : (match.score_home ?? '–')}</span>
            <span>X</span>
            <span className="text-base">{isPlaceholderMatch ? '–' : (match.score_away ?? '–')}</span>
          </div>
          <div className="w-36 overflow-hidden break-words flex items-center justify-center text-gray-800 text-sm font-semibold text-center">
            <TruncatedTeamName name={awayTeam?.abbreviation || awayTeam?.name || "A definir"} maxLength={3} />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-[#4CAF50] font-semibold px-4 pb-4">
          <p>{stageName || 'ELIMINATÓRIAS'}</p>
          {shouldShowEditButton ? (
            <div className="flex items-center gap-2">
              <p>{formattedDateTime}</p>
              <button
                onClick={handleEditClick}
                className="bg-transparent border-none p-0 hover:scale-110 transition-transform text-[#4CAF50]"
              >
                <Edit size={14} />
              </button>
            </div>
          ) : (
            <p>{isPlaceholderMatch ? "A definir" : formattedDateTime}</p>
          )}
        </div>
      </div>
    </>
  );
}