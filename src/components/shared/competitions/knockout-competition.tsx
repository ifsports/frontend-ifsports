"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Volleyball } from "lucide-react";
import type { Competition, Match, RoundData } from "@/types/competition";
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import type { Team } from "@/types/team";
import KnockoutMatchCard from "./knockout-match-card";
import Link from "next/link";
import ActionButton from "../action-button";
dayjs.locale('pt-br');

interface KnockoutCompetitionProps {
  competition: Competition;
  teams: Team[];
  rounds: RoundData[];
  variant?: "student" | "organizer";
}

export default function KnockoutCompetition({ competition, teams = [], rounds = [], variant="student" }: KnockoutCompetitionProps) {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);

  const getTeamById = (teamId: string): Team | undefined => {
    return teams.find(team => team.id === teamId);
  };

  const handlePrevStage = () => {
    setCurrentRoundIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextStage = () => {
    setCurrentRoundIndex(prev => Math.min(rounds.length - 1, prev + 1));
  };

  const canGoPrev = currentRoundIndex > 0;
  const canGoNext = currentRoundIndex < rounds.length - 1;
  const currentRound = rounds[currentRoundIndex];

  const organizeMatchesInRows = (matches: Match[]) => {
    const rows = [];
    const itemsPerRow = matches.length > 2 ? 2 : matches.length;
    for (let i = 0; i < matches.length; i += itemsPerRow > 0 ? itemsPerRow : 1) {
      rows.push(matches.slice(i, i + itemsPerRow));
    }
    return rows;
  };

  const renderMatches = () => {
    if (!currentRound || currentRound.matches.length === 0) return null;

    if (currentRound.matches.length === 1) {
      const match = currentRound.matches[0];
      const homeTeam = match.team_home ? getTeamById(match.team_home.team_id) : undefined;
      const awayTeam = match.team_away ? getTeamById(match.team_away.team_id) : undefined;

      return (
        <div className="w-full max-w-md mx-auto">
          <KnockoutMatchCard
            match={match}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            stageName="ELIMINATÓRIAS"
            variant={variant}
          />
        </div>
      );
    }

    const rows = organizeMatchesInRows(currentRound.matches);
    
    return (
      <div className="flex flex-col gap-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className={`w-full flex flex-col gap-4 ${variant === "student" ? 'lg:flex-row' : ''}`}>
            {row.map((match) => {
              const homeTeam = match.team_home ? getTeamById(match.team_home.team_id) : undefined;
              const awayTeam = match.team_away ? getTeamById(match.team_away.team_id) : undefined;
              
              return (
                <KnockoutMatchCard
                  key={match.id}
                  match={match}
                  homeTeam={homeTeam}
                  awayTeam={awayTeam}
                  stageName="ELIMINATÓRIAS"
                  variant={variant}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  if (rounds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <p>Nenhuma fase de eliminatórias disponível para esta competição.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {variant === "organizer" && (
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <Link href="/organizador/competicoes" className="h-4 flex items-center text-black">
              <ChevronLeft size={22} />
            </Link>
            <h1 className="text-2xl font-bold font-title text-[#062601]">
              {competition.name}
            </h1>
          </div>
          <ActionButton
            variant="danger"
            className="bg-red-600 text-white cursor-pointer px-6 py-2.5 rounded-lg font-semibold"
          >
            Encerrar competição
          </ActionButton>
        </div>
      )}
      <div className={`flex items-center justify-between gap-4 pb-4 border-b border-gray-300 ${variant === "student" ? 'mt-16' : ''} `}>
        <button
          onClick={handlePrevStage}
          disabled={!canGoPrev}
          className={`p-2 rounded-full transition-colors ${
            canGoPrev ? "text-[#4CAF50] hover:bg-green-100" : "text-gray-400 cursor-not-allowed"
          }`}
          aria-label="Fase anterior"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex-1 text-center">
          <h3 className="text-2xl text-[#062601] font-title font-bold uppercase">
            {currentRound?.name || "Fase Eliminatória"}
          </h3>
        </div>

        <button
          onClick={handleNextStage}
          disabled={!canGoNext}
          className={`p-2 rounded-full transition-colors ${
            canGoNext ? "text-[#4CAF50] hover:bg-green-100" : "text-gray-400 cursor-not-allowed"
          }`}
          aria-label="Próxima fase"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="mt-8">
        {renderMatches()}
      </div>
    </div>
  );
}
