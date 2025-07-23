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
import {useEffect, useState} from "react";
import {Competition} from "@/types/competition";
import {getCompetitionsNoAuth} from "@/lib/requests/competitions";

export default function GamesContainer() {


    async function getCompetitions() {
        const response = await getCompetitionsNoAuth();

        console.log(response)
    }


    useEffect(() => {
        getCompetitions()
    }, [])


    const competitions = [
        {
            value: "handebol",
            label: "Handebol Misto",
        },
        {
            value: "basquetemasculino",
            label: "Basquete Masculino",
        },
        {
            value: "futsalfeminino",
            label: "Futsal Feminino",
        }
    ]

    return (
        <>
            <div className="flex items-start justify-between mb-8 max-[640px]:flex-col max-[640px]:gap-3">
                <h3 className="font-title text-2xl font-bold text-[#062601]">Todos os jogos</h3>
                <div className="flex gap-4">
                    <CompetitionsFilter label="o campus" data={competitions} />
                    <CompetitionsFilter label="a competição" data={competitions} />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <GameLive variant="live" />
                <GameLive />
                <GameLive />
                <GameLive />
                <GameLive variant="live" />
                <GameLive />
            </div>

            <Pagination className="my-16">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">9</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">10</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </>
    )
}