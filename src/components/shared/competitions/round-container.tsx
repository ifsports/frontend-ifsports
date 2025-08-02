"use client";

import type { RoundData } from "@/types/competition";
import type { Team } from "@/types/team";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import MatchCard from "./match-card";

interface RoundsContainerProps {
  rounds: RoundData[];
  variant?: "student" | "organizer";
  teams?: Team[];
}

export default function RoundsContainer({ rounds, variant, teams }: RoundsContainerProps) {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);

  const handlePrevRound = () => {
    if (currentRoundIndex > 0) {
      setCurrentRoundIndex(currentRoundIndex - 1);
    }
  };

  const handleNextRound = () => {
    if (currentRoundIndex < rounds.length - 1) {
      setCurrentRoundIndex(currentRoundIndex + 1);
    }
  };

  const canGoPrev = currentRoundIndex > 0;
  const canGoNext = currentRoundIndex < rounds.length - 1;

  if (!rounds || rounds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <p>Nenhuma rodada disponível</p>
      </div>
    );
  }

  const currentRound = rounds[currentRoundIndex];

  if (!currentRound) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <p>Rodada não encontrada</p>
        <p className="text-xs mt-1">Index: {currentRoundIndex}, Total: {rounds.length}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center p-2 border-b bg-gray-50">
        <button
          onClick={handlePrevRound}
          disabled={!canGoPrev}
          className={`p-2 rounded-md transition-colors ${
            canGoPrev
              ? "hover:bg-gray-200 text-gray-700"
              : "text-gray-300 cursor-not-allowed"
          }`}
          aria-label="Rodada anterior"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex flex-col items-center">
          <p className="text-sm font-semibold">{currentRound.name}</p>
          <p className="text-xs text-gray-500">
            {currentRound.matches?.length || 0} partidas
          </p>
        </div>
        
        <button
          onClick={handleNextRound}
          disabled={!canGoNext}
          className={`p-2 rounded-md transition-colors ${
            canGoNext
              ? "hover:bg-gray-200 text-gray-700"
              : "text-gray-300 cursor-not-allowed"
          }`}
          aria-label="Próxima rodada"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="flex flex-col gap-4 p-4">
        {currentRound.matches && currentRound.matches.length > 0 ? (
          currentRound.matches.map((match) => {
            return (
              <MatchCard 
                key={match.id} 
                variant={variant} 
                match={match} 
                teams={teams}
              />
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-4">
            <p>Nenhuma partida nesta rodada</p>
          </div>
        )}
      </div>
    </div>
  );
}