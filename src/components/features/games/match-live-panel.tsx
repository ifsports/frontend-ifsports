'use client'

import { useTeams } from "@/hooks/useTeams";
import { socket } from "@/lib/socket-provider";
import type { MatchLive } from "@/types/match-comments";
import { useEffect, useMemo, useState } from "react";

interface MatchLivePanelProps {
    campusId: string;
    match: MatchLive | undefined;
}

export default function MatchLivePanel({ match, campusId } :  MatchLivePanelProps) {
    const [scoreHome, setScoreHome] = useState(match?.score_home || 0);
    const [scoreAway, setScoreAway] = useState(match?.score_away || 0);

    const { data: teams, isLoading: isLoadingTeams } = useTeams(campusId);

    const homeTeam = useMemo(() => 
        teams?.find(t => t.id === match?.team_home_id), 
        [teams, match?.team_home_id]
    );

    const awayTeam = useMemo(() => 
        teams?.find(t => t.id === match?.team_away_id), 
        [teams, match?.team_away_id]
    );

    useEffect(() => {
        const handleUpdateMatchScore = (data: MatchLive) => {
            setScoreHome(data.score_home);
            setScoreAway(data.score_away);
        };

        socket.on("score_updated", handleUpdateMatchScore);

        return () => {
            socket.off("score_updated", handleUpdateMatchScore);
        };
    }, []);

    if (isLoadingTeams) {
        return (
            <div className="border border-[#E2E8F0] w-full rounded-sm h-full flex flex-col items-center justify-center p-6 animate-pulse">
                <div className="h-9 w-32 bg-gray-200 rounded-full mb-8"></div>

                <div className="flex items-center justify-around w-full">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                        <div className="h-5 w-28 bg-gray-200 rounded-md mt-1"></div>
                        <div className="h-7 w-20 bg-gray-200 rounded-full"></div>
                    </div>

                    <div className="h-12 w-24 bg-gray-200 rounded-lg"></div>

                    <div className="flex flex-col items-center gap-3">
                        <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                        <div className="h-5 w-28 bg-gray-200 rounded-md mt-1"></div>
                        <div className="h-7 w-20 bg-gray-200 rounded-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="border border-[#E2E8F0] w-full rounded-sm h-full flex flex-col items-center justify-center">
            { match?.status === "in-progress" ? (
                <div className="flex items-center justify-center gap-2 bg-red-500 py-2 px-8 rounded-full">
                    <span className="w-3 h-3 bg-[#ffffff] rounded-full inline-block flex-shrink-0" />
                    <p className="font-bold font-title text-[#ffffff]">AO VIVO</p>
                </div>
            ) : (
                <div className="flex items-center justify-center gap-2 bg-[#EDEDED] py-2 px-8 rounded-full">
                    <p className="font-bold font-title text-[#4F4F4F]">Pendente</p>
                </div>
            )}

            <div className="flex items-center justify-around w-full">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-center w-24 h-24 rounded-full flex-shrink-0 bg-gradient-to-r from-[#4CAF50] to-[#147A02]">
                        <p className="font-bold text-[#ffffff] text-lg">{homeTeam?.abbreviation}</p>
                    </div>
                    <div className="flex items-center justify-center flex-col gap-3">
                        <p className="font-bold text-lg">{homeTeam?.name}</p>
                        <p className="text-sm text-[#4F4F4F] bg-[#EDEDED] py-2 px-4 rounded-full">Casa</p>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                    { match?.status === "in-progress" ? (
                        <p className="text-[#147A02] font-bold text-5xl">{scoreHome || match?.score_home} - {scoreAway || match?.score_away}</p>
                    ) : (
                        <p className="text-[#147A02] font-bold text-5xl">-</p>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-center w-24 h-24 rounded-full flex-shrink-0 bg-gradient-to-r from-[#4CAF50] to-[#147A02]">
                        <p className="font-bold text-[#ffffff] text-lg">{awayTeam?.abbreviation}</p>
                    </div>
                    <div className="flex items-center justify-center flex-col gap-3">
                        <p className="font-bold text-lg">{awayTeam?.name}</p>
                        <p className="text-sm text-[#4F4F4F] bg-[#EDEDED] py-2 px-4 rounded-full">Visitante</p>
                    </div>
                </div>
            </div>
        </div>
    )
}