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
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

import { useMatches } from "@/hooks/useMatches";
import { useCampusCode } from "@/hooks/useCampusCode";
import type { Competition } from "@/types/competition";
import { getCompetitionsAuth } from "@/lib/requests/competitions";
import { toast } from "sonner";

const MATCHES_PER_PAGE = 6;

export default function OrganizerGamesContainer() {
    const [selectedCompetition, setSelectedCompetition] = useState("");
    const [competitions, setCompetitions] = useState<Competition[] | []>([])
    const [isCompetitionSelected, setIsCompetitionSelected] = useState(false);
    const [page, setPage] = useState(1);   

    const selectedCampus = useCampusCode();

    async function getCompetitions() {
      const response = await getCompetitionsAuth();
      
      if (!response.success) {
        toast.error(response.error);
        console.log(response.error)
        return null;
      }

      setCompetitions(response.data as Competition[])
    }

    useEffect(() => {
      getCompetitions()
    }, [])

    const { 
        data: matchesData, 
        isLoading: isLoadingMatches,
        refetch: refetchMatches 
    } = useMatches(selectedCompetition, page, isCompetitionSelected, MATCHES_PER_PAGE)

    const matches = matchesData?.matches || [];
    const hasNextPage = matchesData?.hasNextPage || false;
    const hasPreviousPage = matchesData?.hasPreviousPage || false;

    const competition = useMemo(() => {
        return competitions?.find((c) => c.id === selectedCompetition) || null;
    }, [competitions, selectedCompetition]);

    const competitionsFilterData = useMemo(() => {
        return competitions?.map((competition) => ({
            label: competition.name,
            value: competition.id,
        })) ?? [];
    }, [competitions]);

    const handleSearchMatches = () => {
        if (selectedCompetition) {
            setIsCompetitionSelected(true);
            setPage(1); 
            refetchMatches();
        } 
    };

    useEffect(() => {
        setPage(1);
    }, [selectedCompetition]);

    return (
        <div className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between mb-8 max-[640px]:flex-col max-[640px]:gap-3">
                <h3 className="font-title text-2xl font-bold text-[#062601]">Todos os jogos</h3>
                <div className="flex gap-4">  
                  <div className="flex">
                      <CompetitionsFilter 
                          label="a competição" 
                          data={competitionsFilterData} 
                          value={selectedCompetition}
                          onChange={(value) => {
                              console.log("Valor selecionado:", value);
                              setSelectedCompetition(value);
                          }} 
                      />
                      <Button 
                          variant={"link"} 
                          onClick={handleSearchMatches}
                          disabled={!selectedCompetition || isLoadingMatches}
                          className="rounded-none rounded-tr-lg rounded-br-lg border-none cursor-pointer text-[#ffffff] bg-[#4CAF50] hover:bg-[#147A02] disabled:opacity-50"
                      >
                          <Search size={18} />
                      </Button>
                  </div>
                </div>
            </div>
            
            {isLoadingMatches && isCompetitionSelected && (
                <div className="flex items-center justify-center h-full w-full my-30">
                    <p>Carregando partidas...</p>
                </div>
            )}

            {!isLoadingMatches && (
                <>
                    {isCompetitionSelected ? (
                        matches && matches.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                                {matches.map((match) => {
                                    return (
                                    <GameLive
                                        variant="organizer"
                                        key={match.match_id} 
                                        matchData={match}
                                        competition={competition}
                                        selectedCampus={selectedCampus || ''}
                                    />
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full w-full my-30">
                            <p>Não há partidas registradas para esta competição!</p>
                            </div>
                        )
                    ) : (
                        (!isCompetitionSelected) && (
                            <div className="flex items-center justify-center w-full h-full my-30">
                                <p>Selecione a competição...</p>
                            </div>
                        )
                    )}
                </>
            )}

            {matches.length > 0 && !isLoadingMatches && (
                <Pagination className="mt-10">
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
        </div>
    )
}