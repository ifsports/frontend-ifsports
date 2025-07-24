'use client'

import { getTeamFromCampusAuth, getTeamFromCampusNoAuth } from "@/lib/requests/teams";
import type { Competition, Match } from "@/types/competition";
import type { Team } from "@/types/team";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface GameLiveProps {
    matchData: Match | null;
    competition: Competition | null;
    selectedCampus: string;
}

export default function GameLive({ matchData, competition, selectedCampus } : GameLiveProps) {
    const [teams, setTeams] = useState<Team[] | null>(null);
    const [matchTeams, setMatchTeams] = useState<Team[] | null>(null);

    const { data: session, status } = useSession();

    useEffect(() => {
        async function fetchTeams() {
            try {
                let response;
                if (status === "authenticated" && session?.user?.name) {
                    response = await getTeamFromCampusAuth();
                } else {
                    response = await getTeamFromCampusNoAuth({ campus: selectedCampus || "" });
                }

                if (response && Array.isArray(response.data)) {
                    const allTeams = response.data as Team[];
                    setTeams(allTeams);

                    if (matchData) {
                        const filtered = getTeamsMatch(allTeams);
                        setMatchTeams(filtered);
                    } else {
                        setMatchTeams(null);
                    }
                } else {
                    setTeams(null);
                    setMatchTeams(null);
                }
            } catch (error) {
                toast.error("Erro ao buscar equipes");
                setTeams(null);
                setMatchTeams(null);
            }
        }

        fetchTeams();
    }, [competition, matchData, selectedCampus, status, session]);


    function getTeamsMatch(teams: Team[]) {
        return teams.filter((team) =>
            team.id === matchData?.team_home?.team_id || team.id === matchData?.team_away?.team_id
        );
    }

    return (
        <Link href={`/jogos/${matchData?.id}`} className="rounded-xl bg-white shadow-2xl flex flex-col gap-2 items-center pt-4 px-4 pb-6">
            <div className="flex items-center gap-2 flex-col">
                { matchData?.status === "in-progress" ? (
                    <div className="flex items-center justify-center gap-2 bg-red-500 px-5 py-2 rounded-full">
                        <span className="w-2 h-2 bg-[#ffffff] rounded-full inline-block flex-shrink-0" />
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
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full flex-shrink-0 bg-[#4CAF50]">
                        <p className="font-bold text-[#ffffff] text-sm">{matchTeams?.find(t => t.id === matchData?.team_home?.team_id)?.abbreviation || ""}</p>
                    </div>
                    <div className="flex items-center justify-center flex-col">
                        <p className="font-medium text-sm">{matchTeams?.find(t => t.id === matchData?.team_home?.team_id)?.name || "Equipe Casa"}</p>
                        <p className="text-xs text-[#9CA4AB]">Casa</p>
                    </div>
                </div>

                <div>
                    { matchData?.status === "in-progress" ? (
                        <p className="text-4xl font-semibold max-[338px]:text-3xl">1 - 1</p>
                    ) : (
                        <p className="text-4xl font-semibold">-</p>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full flex-shrink-0 bg-[#4CAF50]">
                        <p className="font-bold text-[#ffffff] text-sm">{matchTeams?.find(t => t.id === matchData?.team_away?.team_id)?.abbreviation || ""}</p>
                    </div>
                    <div className="flex items-center justify-center flex-col">
                        <p className="font-medium text-sm">{matchTeams?.find(t => t.id === matchData?.team_away?.team_id)?.name || "Equipe Visitante"}</p>
                        <p className="text-xs text-[#9CA4AB]">Visitante</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}