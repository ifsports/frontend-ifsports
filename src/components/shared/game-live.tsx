'use client'

import { getCompetitionMatches } from "@/lib/requests/competitions";
import type { Competition } from "@/types/competition";
import type { MatchLive } from "@/types/match-comments";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { useTeams } from "@/hooks/useTeams";
import { CalendarPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { axiosAPI } from "@/lib/axios-api";
import { decodeAccessToken } from "@/lib/auth";
import { useSession } from "next-auth/react";

interface GameLiveProps {
    matchData: MatchLive | null;
    competition: Competition | null;
    selectedCampus: string;
    variant?: "student" | "organizer";
}

interface MatchDetails {
    summary: string;
    description: string;
    start_time: string;
    end_time: string;
    location?: string;
}

interface CalendarEventCreate {
    user_email: string;
    match_details: MatchDetails[];
}

export default function GameLive({ matchData, competition, selectedCampus, variant="student" } : GameLiveProps) {
    const { data: teams, isLoading: isLoadingTeams } = useTeams(selectedCampus);
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isAddingToCalendar, setIsAddingToCalendar] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        
        if (status === 'loading') {
            return;
        }

        if (status === 'authenticated' && session?.user) {
            if (session.accessToken) {
                try {
                    const decoded = decodeAccessToken(session.accessToken);
                    
                    if (decoded && decoded.email) {
                        setUserEmail(decoded.email);
                        setIsAuthenticated(true);
                        return;
                    }
                } catch (error) {
                }
            }
            
            if (session.user.email) {
                setUserEmail(session.user.email);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                setUserEmail(null);
            }
        } else {
            setIsAuthenticated(false);
            setUserEmail(null);
        }
    }, [session, status]);

    const matchTeams = useMemo(() => {
        if (!teams || !matchData) return null;
        
        const filteredTeams = teams.filter((team) =>
            team.id === matchData.team_home_id || team.id === matchData.team_away_id
        );

        return filteredTeams;
    }, [teams, matchData]);

    const homeTeam = useMemo(() => {
        const team = matchTeams?.find(t => t.id === matchData?.team_home_id);
        return team;
    }, [matchTeams, matchData?.team_home_id]);

    const awayTeam = useMemo(() => {
        const team = matchTeams?.find(t => t.id === matchData?.team_away_id);
        return team;
    }, [matchTeams, matchData?.team_away_id]);

    const handleAddToCalendar = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (status === 'loading') {
            toast.info('Verificando autenticação...');
            return;
        }

        if (!isAuthenticated || !userEmail) {
            toast.error('Você precisa estar logado para adicionar eventos à agenda');
            router.push('/auth/login');
            return;
        }

        if (!matchData?.match_id || !competition?.id) {
            toast.error('Dados da partida não disponíveis');
            return;
        }

        setIsAddingToCalendar(true);

        try {
            const authResponse = await axiosAPI<{ authorization_url: string }>({
                endpoint: `/calendar/auth/login?user_email=${encodeURIComponent(userEmail)}`,
                method: 'GET',
                withAuth: true
            });

            const competitionMatchesResponse = await getCompetitionMatches(competition.id);

            if (!competitionMatchesResponse.success) {
                throw new Error(competitionMatchesResponse.error);
            }

            let specificMatch = competitionMatchesResponse.data?.results.find(
                match => match.id === matchData.match_id
            );

            if (!specificMatch) {
                specificMatch = competitionMatchesResponse.data?.results.find(
                    match => match.id.toString() === matchData.match_id.toString()
                );
            }

            if (!specificMatch) {
                toast.error('Partida não encontrada. Não é possível adicionar ao calendário.');
                setIsAddingToCalendar(false);
                return;
            }

            if (!specificMatch.scheduled_datetime) {
                toast.warning('Esta partida ainda não tem data e horário definidos. Não é possível adicionar ao calendário.');
                setIsAddingToCalendar(false);
                return;
            }

            const summary = `${homeTeam?.name || 'Equipe Casa'} x ${awayTeam?.name || 'Equipe Visitante'}`;
            const matchUrl = `${window.location.origin}/jogos/${matchData.match_id}/campus/${selectedCampus}`;
            const description = `🏆 ${competition?.name || 'Competição'}
            🏠 Casa: ${homeTeam?.name || 'Equipe Casa'}
            ✈️ Visitante: ${awayTeam?.name || 'Equipe Visitante'}
            🏫 Campus: ${selectedCampus}

            🔗 Ver detalhes: ${matchUrl}`;
        
            const startTime = new Date(specificMatch.scheduled_datetime);
            
            const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);

            const eventData: CalendarEventCreate = {
                user_email: userEmail,
                match_details: [{
                    summary,
                    description,
                    start_time: startTime.toISOString(),
                    end_time: endTime.toISOString(),
                    location: "Ginásio IFRN"
                }]
            };

            localStorage.setItem('pending_calendar_event', JSON.stringify(eventData));

            toast.success('Redirecionando para autorização do Google...');
            
            setTimeout(() => {
                window.location.href = authResponse.data.authorization_url;
            }, 1000);

        } catch (error) {
            toast.error('Erro ao adicionar evento à agenda');
            setIsAddingToCalendar(false);
        }
    };

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
        <Link 
            href={`${variant === "organizer" ? `/organizador/partidas/${matchData?.match_id}` : `/jogos/${matchData?.match_id}`}/campus/${selectedCampus}`} 
            className="rounded-xl bg-white shadow-2xl flex flex-col gap-2 items-center pt-4 px-4 pb-6 hover:shadow-3xl transition-shadow duration-200 relative"
        >
            <button
                onClick={handleAddToCalendar}
                disabled={
                    isAddingToCalendar || 
                    status === 'loading' || 
                    !matchData?.start_time
                }
                className={`absolute top-2 right-2 p-2 rounded-lg transition-colors ${
                    !matchData?.start_time
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:text-[#4CAF50] hover:bg-gray-50'
                } disabled:opacity-50`}
                title={
                    !matchData?.start_time
                        ? "Partida sem data/hora definida"
                        : "Adicionar à agenda"
                }
            >
                <CalendarPlus size={20} className={isAddingToCalendar ? 'animate-spin' : ''} />
            </button>

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
                    <div className="flex flex-col gap-2 items-center">
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