import type { Match } from "@/types/competition";

import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { Volleyball } from "lucide-react";

interface MatchCardProps {
  match: Match;
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


export default function MatchCard({ match }: MatchCardProps) {
  const { date, time } = formatMatchTime(match.scheduled_datetime);
  
  const teamHomeName = match.team_away?.team_id ?? 'A definir';
  const teamAwayName = match.team_away?.team_id ?? 'A definir';

  return (
    <div className="relative flex flex-col gap-3 pt-4 w-full overflow-hidden bg-white border border-gray-200 rounded-lg">
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
        <p>
          {date}
          {time && ` - ${time}`}
        </p>
      </div>
    </div>
  );
}