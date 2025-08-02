'use client'

import MatchLivePanel from "@/components/features/games/match-live-panel";
import GameEventsPanel from "@/components/features/games/game-events-panel";
import { useMatchDetails } from "@/hooks/useMatches";
import { socket } from "@/lib/socket-provider";
import { useEffect } from "react";

interface OrganizerGameDetailPageProps {
  matchId: string;
  campusId: string;
}

export default function OrganizerGameDetailPage({ campusId, matchId } : OrganizerGameDetailPageProps) {
    const { data: match, isLoading: isLoadMatch } = useMatchDetails(matchId);

    useEffect(() => {
        if (!matchId) return;

        socket.emit("join_chat", {
            match_id: matchId,
        });

    }, [matchId]);

    return (
        <div className="w-full h-screen flex justify-between gap-4">
            <div className="flex flex-1 flex-col gap-4 h-full">
                <div className="flex-1 overflow-hidden">
                    <MatchLivePanel campusId={campusId} match={match} variant="organizer" />
                </div>
                <div className="flex-1 overflow-hidden">
                    <GameEventsPanel match={match} gameId={matchId} variant="organizer" />
                </div>
            </div>
        </div>

    )
}