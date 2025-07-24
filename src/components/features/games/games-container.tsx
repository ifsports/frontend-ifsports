"use client"

import CompetitionsFilter from "@/components/shared/competitions-filter";
import GameLive from "@/components/shared/game-live";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {useEffect, useMemo, useState} from "react";
import {Competition} from "@/types/competition";
import {getCompetitionsAuth, getCompetitionsNoAuth} from "@/lib/requests/competitions";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

import { campusData } from "@/lib/campus";
import { toast } from "sonner";
import { getMatchesFromCompetition } from "@/lib/requests/match-comments";
import type { MatchLive } from "@/types/match-comments";

const MATCHES_PER_PAGE = 6;

export default function GamesContainer() {
    const [competitions, setCompetitions] = useState<Competition[] | null>(null);
    const [matches, setMatches] = useState<MatchLive[] | null>(null);
    const [selectedCampus, setSelectedCampus] = useState("");
    const [selectedCompetition, setSelectedCompetition] = useState("");
    const [isCampusSelected, setIsCampusSelected] = useState(false);
    const [isCompetitionSelected, setIsCompetitionSelected] = useState(false);
    const [competition, setCompetition] = useState<Competition | null>(null);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);

    const { data: session, status } = useSession();

    async function getCompetitions() {
        try {
            let response;
            if (status === "authenticated" && session?.user?.name) {
                response = await getCompetitionsAuth();
            } else {
                response = await getCompetitionsNoAuth({ campus_code: selectedCampus ? selectedCampus : "" });
            }  

            if (response && Array.isArray(response.data)) {
                setCompetitions(response.data as Competition[]);
            } else {
                setCompetitions(null);
            }
            
        } catch (error) {
            toast.error("Erro ao buscar competições:");
            setCompetitions(null);
        }
    }

    async function getMatchesAllCompetitions() {
        if (!selectedCompetition) {
            setMatches(null);
            return;
        }

        const competitionDetails = competitions?.find((c) => c.id === selectedCompetition);

        if (competitionDetails) {
            setCompetition(competitionDetails);
        }

        try {
        const offset = (page - 1) * MATCHES_PER_PAGE;

        const response = await getMatchesFromCompetition({
            competition_id: selectedCompetition,
            limit: MATCHES_PER_PAGE + 1, 
            offset,
        });

        if (response && Array.isArray(response.data)) {
            const receivedMatches = response.data as MatchLive[];

            const hasMore = receivedMatches.length > MATCHES_PER_PAGE;
            setHasNextPage(hasMore);
            setHasPreviousPage(page > 1);

            if (hasMore) {
                setMatches(receivedMatches.slice(0, MATCHES_PER_PAGE));
            } else {
                setMatches(receivedMatches);
            }
        } else {
            setMatches(null);
            setHasNextPage(false);
            setHasPreviousPage(page > 1);
        }
        } catch (error) {
            toast.error("Erro ao buscar partidas");
            setMatches(null);
        }
    }

    useEffect(() => {
        getMatchesAllCompetitions();
    }, [page]);
    
    useEffect(() => {
        if (status === "authenticated" && session?.user?.name) {
            getCompetitions()
        }
    }, [status, session])

    const competitionsFilterData = useMemo(() => {
        return competitions?.map((competition) => ({
            label: competition.name,
            value: competition.id,
        })) ?? [];
    }, [competitions]);

    return (
        <>
            <div className="flex items-start justify-between mb-8 max-[640px]:flex-col max-[640px]:gap-3">
                <h3 className="font-title text-2xl font-bold text-[#062601]">Todos os jogos</h3>
                <div className="flex gap-4">
                    {(isCampusSelected || status === "authenticated") && (
                        <div className="flex">
                            <CompetitionsFilter 
                                label="a competição" 
                                data={competitionsFilterData} 
                                onChange={(value) => {
                                    console.log("Valor selecionado:", value);
                                    setSelectedCompetition(value);
                                }} 
                            />
                            <Button variant={"link"} onClick={() => { getMatchesAllCompetitions(); setIsCompetitionSelected(true)}} className="rounded-none rounded-tr-lg rounded-br-lg border-none cursor-pointer text-[#ffffff] bg-[#4CAF50] hover:bg-[#147A02]">
                                <Search size={18} />
                            </Button>
                        </div>
                    )} 
                    {status === "unauthenticated" && (
                        <div className="flex">
                         <CompetitionsFilter 
                            label="o campus" 
                            data={campusData}
                            onChange={(value) => {
                                console.log("Valor selecionado:", value);
                                setSelectedCampus(value);
                            }} 
                        />
                        <Button onClick={() => { getCompetitions(); setIsCampusSelected(true)}} variant={"link"} className="rounded-none rounded-tr-lg rounded-br-lg border-none cursor-pointer text-[#ffffff] bg-[#4CAF50] hover:bg-[#147A02]">
                            <Search size={18} />
                        </Button>
                    </div>
                    )}
                </div>
            </div>
            

            {isCompetitionSelected ? (
                matches && matches.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matches.map((match) => {
                            return (
                            <GameLive
                                key={match.match_id} 
                                matchData={match}
                                competition={competition}
                                selectedCampus={selectedCampus}
                            />
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-full my-30">
                    <p>Não há partidas registradas para esta competição!</p>
                    </div>
                )
            ) : (
                isCampusSelected || status === "authenticated") && !isCompetitionSelected ? (
                    <div className="flex items-center justify-center w-full my-30">
                        <p>Selecione a competição...</p>
                    </div>
                ) : status === "unauthenticated" && !isCampusSelected && (
                    <div className="flex items-center justify-center w-full my-30">
                        <p>Selecione o campus...</p>
                    </div>
            )}

            {(matches || []).length > 0 && (
                <Pagination className="my-14">
                    <PaginationContent>

                        <PaginationItem>
                           <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (hasPreviousPage) setPage(page - 1);
                                }}
                                aria-disabled={!hasPreviousPage}
                                className={!hasPreviousPage ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationLink
                                isActive
                                onClick={(e) => e.preventDefault()}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (hasNextPage) setPage(page + 1);
                                }}
                                aria-disabled={!hasNextPage}
                                className={!hasNextPage ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>

                    </PaginationContent>
                </Pagination>
            )}
        </>
    )
}