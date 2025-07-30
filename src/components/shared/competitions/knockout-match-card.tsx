import { Volleyball } from "lucide-react";
import TruncatedTeamName from "./truncated-team-name";
import type { Match } from "@/types/competition";
import type { Team } from "@/types/team";

interface KnockoutMatchCardPRops { 
  match: Match, 
  homeTeam?: Team, 
  awayTeam?: Team,
  stageName?: string;
}

export default function KnockoutMatchCard({ match, homeTeam, awayTeam, stageName }: KnockoutMatchCardPRops ) {
  return (
    <div className="flex-1 flex flex-col gap-4 pt-4 border border-gray-200 rounded-md">
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
        <p>{match.scheduled_datetime}</p>
      </div>
    </div>
  );
};