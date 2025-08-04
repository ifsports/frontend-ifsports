'use client'

import { getTeamFromCampusNoAuth } from "@/lib/requests/teams";
import type { Competition } from "@/types/competition";
import type { MatchLive } from "@/types/match-comments";
import type { Team } from "@/types/team";
import Link from "next/link";
import { useMemo } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useTeams } from "@/hooks/useTeams";

interface GameLiveProps {
    matchData: MatchLive | null;
    competition: Competition | null;
    selectedCampus: string;
    variant?: "student" | "organizer";
}

export default function GameLive({ matchData, competition, selectedCampus, variant="student" } : GameLiveProps) {
    const { data: teams, isLoading: isLoadingTeams } = useTeams(selectedCampus);

    const matchTeams = useMemo(() => {
        if (!teams || !matchData) return null;
        
        return teams.filter((team) =>
            team.id === matchData.team_home_id || team.id === matchData.team_away_id
        );
    }, [teams, matchData]);

    const homeTeam = useMemo(() => 
        matchTeams?.find(t => t.id === matchData?.team_home_id), 
        [matchTeams, matchData?.team_home_id]
    );

    const awayTeam = useMemo(() => 
        matchTeams?.find(t => t.id === matchData?.team_away_id), 
        [matchTeams, matchData?.team_away_id]
    );

    if (isLoadingTeams) {
        return (
            <div className="rounded-xl bg-white shadow-2xl flex flex-col gap-2 items-center pt-4 px-4 pb-6 animate-pulse">
                <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="flex items-center justify-between gap-4 w-full">
                    <div className="flex flex-col gap-2 items-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="flex flex-col gap-2 items-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Link href={`${variant === "organizer" ? `/organizador/partidas/${matchData?.match_id}` : `/jogos/${matchData?.match_id}`}/campus/${selectedCampus}`} className="rounded-xl bg-white shadow-2xl flex flex-col gap-2 items-center pt-4 px-4 pb-6 hover:shadow-3xl transition-shadow duration-200">
            <div className="flex items-center gap-2 flex-col">
                { matchData?.status === "in-progress" ? (
                    <div className="flex items-center justify-center gap-2 bg-red-500 px-5 py-2 rounded-full">
                        <span className="w-2 h-2 bg-[#ffffff] rounded-full inline-block flex-shrink-0 animate-pulse" />
                        <p className="text-xs font-bold text-[#ffffff]">Ao vivo</p>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-2 bg-[#EDEDED] px-5 py-2 rounded-full">
                        <p className="text-xs font-semibold text-[#4F4F4F] font-title">Pendente</p>
                    </div>
                )}
                <p className="text-[#9CA4AB] text-sm">{competition?.name}</p>
            </div>

            <div className="flex items-center justify-between gap-4 w-full">
                <div className="flex flex-col gap-2 items-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full flex-shrink-0 bg-[#4CAF50]">
                        <p className="font-bold text-[#ffffff] text-sm">
                            {homeTeam?.abbreviation || "HC"}
                        </p>
                    </div>
                    <div className="flex items-center justify-center flex-col">
                        <p className="font-medium text-sm text-center w-24 truncate">
                            {homeTeam?.name || "Equipe Casa"}
                        </p>
                        <p className="text-xs text-[#9CA4AB]">Casa</p>
                    </div>
                </div>

                <div>
                    { matchData?.status === "in-progress" ? (
                        <p className="text-4xl font-semibold max-[338px]:text-3xl">1 - 1</p>
                    ) : (
                        <p className="text-4xl font-semibold text-gray-400">-</p>
                    )}
                </div>

                <div className="flex flex-col gap-2 items-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full flex-shrink-0 bg-[#4CAF50]">
                        <p className="font-bold text-[#ffffff] text-sm">
                            {awayTeam?.abbreviation || "AW"}
                        </p>
                    </div>
                    <div className="flex items-center justify-center flex-col">
                        <p className="font-medium text-sm text-center w-24 truncate">
                            {awayTeam?.name || "Equipe Visitante"}
                        </p>
                        <p className="text-xs text-[#9CA4AB]">Visitante</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}