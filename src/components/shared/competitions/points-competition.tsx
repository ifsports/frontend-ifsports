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
import { generateMatchesCompetition, patchFinishCompetition, patchStartCompetition } from "@/lib/requests/competitions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

  const mainGroup = groups[0];

  if (!mainGroup) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <p>Nenhum dado disponível para esta competição</p>
      </div>
    );
  }

  const handleGenerateMatches = async () => {
    const result = await generateMatchesCompetition(competition.id);
    
    if (result.success) {
      toast.success("Partidas geradas com sucesso!");
      window.location.reload();
    } else {
      toast.error(result.error);
    }
  }

  const handleStartCompetition = async () => {
    const result = await patchStartCompetition(competition.id);
    if (result.success) {
      toast.success("Competição iniciada com sucesso!");
      window.location.reload();
    } else {
      toast.error(result.error);
    }
  };

  const handleEndCompetition = async () => {
    const result = await patchFinishCompetition(competition.id);
    if (result.success) {
      toast.success("Competição encerrada com sucesso!");
      router.push("/organizador/competicoes")
    } else {
      toast.error(result.error);
    }
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

          <div>
            <div className='flex items-center gap-4'>
              {competition.status === "not-started" && (
                mainGroup.rounds.length > 0 ? (
                  <ActionButton variant="primary" className="py-4 px-4 border-0 rounded-lg text-center font-semibold cursor-pointer bg-[#4CAF50] text-white" onClick={handleStartCompetition}>
                    Iniciar competição
                  </ActionButton>
                ) : (
                <ActionButton variant="primary" className="py-4 px-4 border-0 rounded-lg text-center font-semibold cursor-pointer bg-[#4CAF50] text-white" onClick={handleGenerateMatches}>
                  Gerar partidas
                </ActionButton>
              ))}
            </div>

            {competition.status === "in-progress" && (
              <ActionButton variant="primary" className="py-4 px-4 border-0 rounded-lg text-center font-bold cursor-pointer bg-red-600 text-white"
                type="button"
                onClick={() => setEndCompDialogOpen(true)}
              >
                Encerrar competição
              </ActionButton>
            )}
          </div>
        </div>
      )}

      <div className="mb-12">
        <div className="flex flex-col gap-4">
          {variant === "student" && (
            <h3 className="text-2xl text-[#062601] font-title font-bold">TABELA</h3>
          )}
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
          <div className="flex justify-end gap-4 mt-3">
            <ActionButton variant="danger" onClick={handleEndCompetition}>
              Encerrar
            </ActionButton>
          </div>
        </div>
      </CustomDialog>
    </div>
  );
}