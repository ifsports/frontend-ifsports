"use client";

import type { RoundData, Match } from "@/types/competition";
import 'dayjs/locale/pt-br';
import type { Team } from "@/types/team";
import KnockoutMatchCard from "./knockout-match-card";

interface KnockoutRoundViewProps {
  round: RoundData;
  teams: Team[];
  variant?: "student" | "organizer";
}

export default function KnockoutRoundView({ round, teams, variant }: KnockoutRoundViewProps) {
  const getTeamById = (teamId: string): Team | undefined => {
    return teams.find(team => team.id === teamId);
  };

  const organizeMatchesInRows = (matches: Match[]) => {
    const rows = [];
    const itemsPerRow = matches.length > 2 ? 2 : matches.length;
    for (let i = 0; i < matches.length; i += itemsPerRow > 0 ? itemsPerRow : 1) {
      rows.push(matches.slice(i, i + itemsPerRow));
    }
    return rows;
  };

  if (!round || round.matches.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p>Nenhuma partida encontrada para esta fase.</p>
      </div>
    );
  }

  if (round.matches.length === 1) {
    const match = round.matches[0];
    const homeTeam = match.team_home ? getTeamById(match.team_home.team_id) : undefined;
    const awayTeam = match.team_away ? getTeamById(match.team_away.team_id) : undefined;
    return (
      <div className="w-full max-w-md mx-auto">
        <KnockoutMatchCard variant={variant} match={match} homeTeam={homeTeam} awayTeam={awayTeam} />
      </div>
    );
  }

  const rows = organizeMatchesInRows(round.matches);
  
  return (
    <div className="flex flex-col gap-4">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="w-full flex flex-col gap-4">
          {row.map((match) => {
            const homeTeam = match.team_home ? getTeamById(match.team_home.team_id) : undefined;
            const awayTeam = match.team_away ? getTeamById(match.team_away.team_id) : undefined;
            return <KnockoutMatchCard variant={variant} key={match.id} match={match} homeTeam={homeTeam} awayTeam={awayTeam} />;
          })}
        </div>
      ))}
    </div>
  );
}