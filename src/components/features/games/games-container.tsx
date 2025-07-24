"use client"

import CompetitionsFilter from "@/components/shared/competitions-filter";
import GameLive from "@/components/shared/game-live";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {useEffect, useMemo, useState} from "react";
import {Competition, type APIGetCompetitions, type APIGetMatchesFromCampus, type Match} from "@/types/competition";
import {getCompetitionsAuth, getCompetitionsNoAuth, getMatchesFromAllCompetitions} from "@/lib/requests/competitions";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

import { campusData } from "@/lib/campus";
import { toast } from "sonner";

export default function GamesContainer() {
    const [competitions, setCompetitions] = useState<Competition[] | null>(null);
    const [matches, setMatches] = useState<APIGetMatchesFromCampus | undefined>(undefined);
    const [selectedCampus, setSelectedCampus] = useState("");
    const [selectedCompetition, setSelectedCompetition] = useState("");
    const [isCampusSelected, setIsCampusSelected] = useState(false);
    const [isCompetitionSelected, setIsCompetitionSelected] = useState(false);
    const [competition, setCompetition] = useState<Competition | null>(null);

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
        if (selectedCompetition) {
            const competition = competitions?.find((competition) => 
                competition.id === selectedCompetition
            )
            
            if (!competition) {
                return null;
            }

            setCompetition(competition)

            try {
                const response = await getMatchesFromAllCompetitions(competition.id);
                
                setMatches(response?.data)
                
            } catch (error) {
                toast.error("Erro ao buscar partidas");
                setCompetitions(null);
            }
        }
    }
    
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

    function renderPaginationInfo(matches: APIGetMatchesFromCampus | undefined): React.ReactNode {
        if (!matches) return null;

        const getPageParam = (url?: string): number => {
            if (!url) return 1;
            const match = url.match(/[?&]page=(\d+)/);
            return match ? parseInt(match[1], 10) : 1;
        };

        const getPageSize = (): number => {
            const url = matches.next || matches.previous;
            if (!url) return matches.results.length || 10;
            const match = url.match(/[?&](page_size|limit)=(\d+)/);
            return match ? parseInt(match[2], 10) : matches.results.length || 10;
        };

        const pageSize = getPageSize();
        const totalPages = Math.ceil(matches.count / pageSize);

        let currentPage = 1;
        if (matches.previous) {
            currentPage = getPageParam(matches.previous) + 1;
        } else if (matches.next) {
            currentPage = getPageParam(matches.next) - 1;
        }

        return (
            <PaginationItem>
                <PaginationLink>Página {currentPage} de {totalPages}</PaginationLink>
            </PaginationItem>
        );
    }


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
                matches?.results && matches.results.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matches.results.map((match) => (
                            <GameLive 
                                key={match.id} 
                                matchData={match} 
                                competition={competition} 
                                selectedCampus={selectedCampus} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-full my-30">
                        <p>Não há partidas registradas para esta competição!</p>
                    </div>
                )
                ) : (isCampusSelected || status === "authenticated")  && !isCompetitionSelected  ? (
                    <div className="flex items-center justify-center w-full my-30">
                        <p>Selecione a competição...</p>
                    </div>
                ) : status === "unauthenticated" && !isCampusSelected && (
                <div className="flex items-center justify-center w-full my-30">
                    <p>Selecione o campus...</p>
                </div>
            )}

            {(matches?.results || []).length > 0 && (
                <Pagination className="my-10">
                    <PaginationContent className="flex items-center gap-8">
                        <PaginationItem className={matches?.previous && "cursor-pointer"} >
                            <PaginationPrevious
                                href={matches?.previous}
                                className={matches?.previous ? "" : "pointer-events-none opacity-50"}
                            />
                        </PaginationItem>
                        
                        {renderPaginationInfo(matches)}
                        
                        <PaginationItem className={matches?.next && "cursor-pointer"} >
                            <PaginationNext
                                href={matches?.next}
                                className={matches?.next ? "" : "pointer-events-none opacity-50"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </>
    )
}