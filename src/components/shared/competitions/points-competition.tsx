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
}

interface GameForEdit {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  date: string;
  time: string;
  status: "Encerrado" | "Agendado" | "Em andamento";
  round: number;
  originalMatch: Match;
}

export default function PointsCompetition({
  competition,
  groups,
  teams,
  variant = "student",
}: PointsCompetitionProps) {
  const [activeRoundIndex, setActiveRoundIndex] = useState(0);

  const mainGroup = groups[0];

  if (!mainGroup) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <p>Nenhum dado disponível para esta competição</p>
      </div>
    );
  }

  if (variant === "student") {
    return (
      <div className="w-full">
        <div className="mb-12">
          <div className="flex flex-col gap-4 mb-8">
            <h3 className="text-2xl text-[#062601] font-title font-bold">TABELA</h3>
            <hr className="border-gray-300" />
          </div>

          <GroupTable groupName="Geral" classifications={mainGroup.classifications} teams={teams} />
        </div>

        <div className="flex items-center border-b border-gray-100 mb-8">
          {mainGroup.rounds.map((round, index) => (
            <button
              key={round.id}
              onClick={() => setActiveRoundIndex(index)}
              className={`border-0 border-b-2 bg-none px-3 pb-4 font-semibold cursor-pointer transition-all duration-200 ${
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
            <MatchCard key={match.id} match={match} teams={teams} />
          ))}
        </div>
      </div>
    );
  }

  const [endCompDialogOpen, setEndCompDialogOpen] = useState(false);
  const [editGameDialogOpen, setEditGameDialogOpen] = useState(false);

  const [selectedGame, setSelectedGame] = useState<GameForEdit | null>(null);
  const [gameDate, setGameDate] = useState("");
  const [gameTime, setGameTime] = useState("");
  const [gameRound, setGameRound] = useState<number>(1);
  const [homeTeamSelect, setHomeTeamSelect] = useState("");
  const [awayTeamSelect, setAwayTeamSelect] = useState("");

  function matchToGameForEdit(match: Match): GameForEdit {
    const homeTeam = teams.find((t) => t.id === match.team_home?.team_id);
    const awayTeam = teams.find((t) => t.id === match.team_away?.team_id);

    const dateObj = new Date(match.scheduled_datetime || "");
    const isValidDate = !isNaN(dateObj.getTime());

    const date = isValidDate
      ? dateObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
      : "";
    const time = isValidDate ? dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "";

    const status =
      match.status === "finished"
        ? "Encerrado"
        : match.status === "in-progress"
        ? "Em andamento"
        : "Agendado";

    return {
      id: match.id,
      homeTeam: homeTeam?.name || "TBD",
      awayTeam: awayTeam?.name || "TBD",
      homeScore: match.score_home ?? null,
      awayScore: match.score_away ?? null,
      date,
      time,
      status,
      round: match.round_match_number || 1,
      originalMatch: match,
    };
  }

  const organizerRounds = mainGroup.rounds.map((round) => ({
    name: round.name,
    matches: round.matches.map(matchToGameForEdit),
  }));

  const handleEditGameClick = (e: React.MouseEvent, game: GameForEdit) => {
    e.stopPropagation();
    setSelectedGame(game);

    if (game.date && game.time) {
      const dt = new Date(game.originalMatch.scheduled_datetime || "");
      if (!isNaN(dt.getTime())) {
        setGameDate(dt.toISOString().split("T")[0]);
        setGameTime(dt.toTimeString().slice(0, 5));
      } else {
        setGameDate("");
        setGameTime("");
      }
    } else {
      setGameDate("");
      setGameTime("");
    }

    setGameRound(game.round);
    setHomeTeamSelect(game.originalMatch.team_home?.team_id || "");
    setAwayTeamSelect(game.originalMatch.team_away?.team_id || "");
    setEditGameDialogOpen(true);
  };

  const handleGameSubmit = () => {
    if (!selectedGame) return;

    setEditGameDialogOpen(false);
    setSelectedGame(null);
  };

  const handleEndCompetition = () => {
    setEndCompDialogOpen(false);
  };

  return (
    <div className="min-h-screen">
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

      <div className="mb-12">
        <GroupTable groupName="Geral" classifications={mainGroup.classifications} teams={teams} />
      </div>

      <div className="flex items-center border-b border-gray-100 mb-8">
        {organizerRounds.map((round, index) => (
          <button
            key={round.name}
            onClick={() => setActiveRoundIndex(index)}
            className={`border-0 border-b-2 bg-none px-3 pb-4 font-semibold cursor-pointer transition-all duration-200 ${
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
        {organizerRounds[activeRoundIndex]?.matches.map((game) => (
          <div
            key={game.id}
            className="relative flex flex-col gap-3 pt-4 w-full overflow-hidden bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between gap-4 px-4">
              <div className="p-1.5 flex items-center bg-green-100 rounded-md">
                <Volleyball size={16} className="text-[#4CAF50]" />
              </div>
              <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded">{game.status}</span>
            </div>
            <div className="flex items-center justify-center gap-6 px-4 py-3">
              <p className="w-20 text-center text-xs font-semibold text-gray-700">{game.homeTeam}</p>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-gray-800">{game.homeScore ?? "-"}</span>
                <span className="text-gray-400">vs</span>
                <span className="text-lg font-bold text-gray-800">{game.awayScore ?? "-"}</span>
              </div>
              <p className="w-20 text-center text-xs font-semibold text-gray-700">{game.awayTeam}</p>
            </div>
            <div className="flex items-center justify-center text-xs text-white font-semibold bg-[#4CAF50] py-2.5">
              <div className="flex items-center gap-4">
                <span>
                  {game.date && game.time ? `${game.date} - ${game.time}` : "A definir"}
                </span>
                <button
                  onClick={(e) => handleEditGameClick(e, game)}
                  className="bg-transparent border-none p-0 hover:scale-110 transition-transform"
                >
                  <Edit size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CustomDialog
        open={endCompDialogOpen}
        onClose={() => setEndCompDialogOpen(false)}
        title="Encerrar competição?"
        className="max-w-[42.438rem] w-full p-8 bg-[#F5F6FA]"
      >
        <p className="mb-6 text-gray-700">
          Tem certeza de que deseja encerrar a competição "{competition.name}"? Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-4 justify-end">
          <ActionButton variant="danger" onClick={handleEndCompetition}>
            Encerrar
          </ActionButton>
        </div>
      </CustomDialog>

      <CustomDialog open={editGameDialogOpen} onClose={() => setEditGameDialogOpen(false)} title="Editar jogo">
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <label className="text-[#062601]">Time casa</label>
              <div className="border border-[#d9e1e7] rounded-lg px-5 bg-white">
                <select
                  value={homeTeamSelect}
                  onChange={(e) => setHomeTeamSelect(e.target.value)}
                  className={`w-full py-4 border-none bg-white outline-none ${
                    homeTeamSelect === "" ? "text-[#a9a9a9]" : "text-[#062601]"
                  }`}
                  required
                >
                  <option value="" disabled>
                    Selecione uma equipe
                  </option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id} className="text-[#062601]">
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[#062601]">Time fora</label>
              <div className="border border-[#d9e1e7] rounded-lg px-5 bg-white">
                <select
                  value={awayTeamSelect}
                  onChange={(e) => setAwayTeamSelect(e.target.value)}
                  className={`w-full py-4 border-none bg-white outline-none ${
                    awayTeamSelect === "" ? "text-[#a9a9a9]" : "text-[#062601]"
                  }`}
                  required
                >
                  <option value="" disabled>
                    Selecione uma equipe
                  </option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id} className="text-[#062601]">
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <hr />

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-3">
              <label className="text-[#062601]">Data</label>
              <input
                type="date"
                value={gameDate}
                onChange={(e) => setGameDate(e.target.value)}
                className="p-2 border border-[#d9e1e7] rounded-lg"
                required
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[#062601]">Hora</label>
              <input
                type="time"
                value={gameTime}
                onChange={(e) => setGameTime(e.target.value)}
                className="p-2 border border-[#d9e1e7] rounded-lg"
                required
              />
            </div>

            <div className="flex flex-col gap-3 col-span-1">
              <label className="text-[#062601]">Rodada</label>
              <input
                type="number"
                value={gameRound}
                onChange={(e) => setGameRound(Number(e.target.value))}
                className="p-2 border border-[#d9e1e7] rounded-lg"
                min="1"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <ActionButton type="submit" onClick={handleGameSubmit}>
              Confirmar alterações
            </ActionButton>
          </div>
        </div>
      </CustomDialog>
    </div>
  );
}
