"use client";

import type { Competition, GroupData } from "@/types/competition";
import GroupTable from "./group-table";
import { useState } from "react";
import MatchCard from "./match-card";
import type { Team } from "@/types/team";

interface PointsCompetitionProps {
  competition: Competition;
  groups: GroupData[];
  teams: Team[];
}

export default function PointsCompetition({ competition, groups, teams }: PointsCompetitionProps) {
  const [activeRoundIndex, setActiveRoundIndex] = useState(0);

  const mainGroup = groups[0];

  if (!mainGroup) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <p>Nenhum dado disponível para esta competição</p>
      </div>
    );
  }

  return (
    <div className="w-full">

      <div className="mb-12">
        <div className="flex flex-col gap-4 mb-8">
          <h3 className="text-2xl text-[#062601] font-title font-bold">TABELA</h3>
          <hr className="border-gray-300" />
        </div>

        <GroupTable 
          groupName="Geral"
          classifications={mainGroup.classifications}
          teams={teams}
        />
      </div>

      <div className="flex items-center border-b border-gray-100 mb-8">
        {mainGroup.rounds.map((round, index) => (
          <button
            key={round.id}
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
        {mainGroup.rounds[activeRoundIndex]?.matches.map((match) => {
          return (
            <MatchCard
              key={match.id}
              match={match}
              teams={teams}
            />
          );
        })}
      </div>
   </div>
  );
}