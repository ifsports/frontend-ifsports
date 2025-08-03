"use client";

import React, { useState } from "react";
import { ChevronLeft, Edit, Volleyball } from "lucide-react";
import type { Competition, GroupData, Match } from "@/types/competition";
import type { Team } from "@/types/team";
import Link from "next/link";
import GroupTable from "./group-table";
import ActionButton from "../action-button";
import CustomDialog from "../custom-dialog";
import MatchCard from "./match-card";

interface PointsCompetitionProps {
  competition: Competition;
  groups: GroupData[];
  teams: Team[];
  variant?: "student" | "organizer";
  onMatchUpdated: () => void;
  onEditMatchClick: (match: Match) => void;
}

export default function PointsCompetition({
  competition,
  groups,
  teams,
  variant = "student",
  onMatchUpdated,
  onEditMatchClick
}: PointsCompetitionProps) {
  const [activeRoundIndex, setActiveRoundIndex] = useState(0);
  const [endCompDialogOpen, setEndCompDialogOpen] = useState(false);

  const mainGroup = groups[0];

  if (!mainGroup) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <p>Nenhum dado disponível para esta competição</p>
      </div>
    );
  }

  const handleEndCompetition = () => {
    setEndCompDialogOpen(false);
    onMatchUpdated();
  };

  return (
    <div className="min-h-screen">
      {variant === "organizer" && (
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <Link href="/organizador/competicoes" className="h-4 flex items-center text-black">
              <ChevronLeft size={22} />
            </Link>
            <h1 className="text-2xl font-bold font-title text-[#062601]">{competition.name}</h1>
          </div>
          <ActionButton
            variant="danger"
            onClick={() => setEndCompDialogOpen(true)}
            className="bg-red-600 text-white cursor-pointer px-6 py-2.5 rounded-lg font-semibold"
          >
            Encerrar competição
          </ActionButton>
        </div>
      )}

      <div className="mb-12">
        <div className="flex flex-col gap-4 mb-8">
          {variant === "student" && (
            <h3 className="text-2xl text-[#062601] font-title font-bold">TABELA</h3>
          )}
          <hr className="border-gray-300" />
        </div>
        <GroupTable groupName="Geral" classifications={mainGroup.classifications} teams={teams} />
      </div>

      <div className="flex items-center border-b border-gray-100 mb-8 overflow-x-auto">
        {mainGroup.rounds.map((round, index) => (
          <button
            key={round.id}
            onClick={() => setActiveRoundIndex(index)}
            className={`border-0 border-b-2 bg-none px-3 pb-4 font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap ${
              activeRoundIndex === index
                ? "text-[#4CAF50] border-b-green-500"
                : "text-gray-600 border-b-transparent hover:text-green-800"
            }`}
          >
            {round.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 items-center gap-6 flex-wrap justify-center lg:justify-start max-lg:grid-cols-2 max-sm:grid-cols-1">
        {mainGroup.rounds[activeRoundIndex]?.matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            teams={teams}
            variant={variant}
            onEditMatchClick={variant === "organizer" ? onEditMatchClick : undefined}
          />
        ))}
      </div>

      <CustomDialog
        open={endCompDialogOpen}
        onClose={() => setEndCompDialogOpen(false)}
        title="Encerrar competição"
      >
        <div className="flex flex-col gap-4">
          <p>Tem certeza que deseja encerrar esta competição? Esta ação não pode ser desfeita.</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setEndCompDialogOpen(false)}
              className="px-4 py-2 border border-[#d9e1e7] rounded-lg text-[#062601] hover:bg-gray-50"
            >
              Cancelar
            </button>
            <ActionButton onClick={handleEndCompetition}>
              Confirmar
            </ActionButton>
          </div>
        </div>
      </CustomDialog>
    </div>
  );
}