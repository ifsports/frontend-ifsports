'use client'

import MatchLivePanel from "@/components/features/games/match-live-panel";
import GameEventsPanel from "@/components/features/games/game-events-panel";
import GameChat from "@/components/features/games/game-chat";
import { useMatchDetails } from "@/hooks/useMatches";
import { socket } from "@/lib/socket-provider";
import { useEffect } from "react";

interface GameCommentsPageProps {
  gameId: string;
  campusId: string;
}

export default function GameCommentsPage({ campusId, gameId } : GameCommentsPageProps) {
    const { data: match, isLoading: isLoadMatch } = useMatchDetails(gameId);

    useEffect(() => {
        if (!gameId) return;

        socket.emit("join_chat", {
            match_id: gameId,
        });

    }, [gameId]);

    return (
        <div className="mt-8 mb-12 w-full h-screen flex justify-between gap-4">
            <div className="flex flex-1 flex-col gap-4 h-full">
                <div className="flex-1 overflow-hidden">
                    <MatchLivePanel campusId={campusId} match={match} />
                </div>
                <div className="flex-1 overflow-hidden">
                    <GameEventsPanel match={match} gameId={gameId} />
                </div>
            </div>
            <div className="h-full">
                <GameChat match={match} gameId={gameId} />
            </div>
        </div>

    )
}