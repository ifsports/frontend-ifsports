import CompetitionsFilter from "@/components/shared/competitions-filter";
import {Button} from "@/components/ui/button";
import {Search} from "lucide-react";
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

export default function GamesContainer() {

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
                <h3 className="font-title text-2xl font-bold">Todos os jogos</h3>
                <div className="flex">
                    <CompetitionsFilter label="a competição" data={competitions} />
                    <Button variant={"link"} className="rounded-none rounded-tr-lg rounded-br-lg border-none cursor-pointer text-[#ffffff] bg-[#4CAF50] hover:bg-[#147A02]">
                        <Search size={18} />
                    </Button>
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