'use client'

import GameEvent from "@/components/features/games/game-event";
import { getCommentsFromMatch } from "@/lib/requests/match-comments";
import { socket } from "@/lib/socket-provider";
import type { Comments, MatchLive } from "@/types/match-comments";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface GameEventsPanelProps {
    gameId: string;
    match: MatchLive | undefined;
}

export default function GameEventsPanel({ gameId, match } : GameEventsPanelProps) {
    const [comments, setComments] = useState<Comments[] | []>([]);

    async function getComments() {
        const response = await getCommentsFromMatch({ match_id: gameId });

        if (!response.data) {
            toast.error("Erro ao carregar eventos da partida");
            return;
        }

        setComments(response.data);

    }

    useEffect(() => {
        getComments()
    }, [])

    useEffect(() => {
        const handleUpdateEvents = (data: Comments) => {
            setComments((prev) => [...prev, data]);
        };

        socket.on("create_comment", handleUpdateEvents);

        return () => {
            socket.off("create_comment", handleUpdateEvents);
        };
    }, []);

    const commentsEndRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (commentsEndRef.current) {
        commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [comments]);


    return (
        <div className="border border-[#E2E8F0] rounded-sm flex flex-col gap-4 p-4 h-full">
            <h4 className="font-title font-bold text-xl text-[#062601]">Eventos da partida</h4>
            
            { match?.status ===  "in-progress" ? (
                comments && comments.length > 0 ? (
                    <div className="flex flex-col gap-3 overflow-y-auto">
                        {comments.map((comment, index) => (
                        <GameEvent key={comment.id || index} comment={comment} />
                        ))}
                        <div ref={commentsEndRef} />
                    </div>
                ) : (
                    <div className="flex h-full justify-center items-center">
                        <p className="text-center text-sm text-gray-500">Sem eventos...</p>
                    </div>
                )
            ) : (
                <div className="flex h-full justify-center items-center">
                    <p className="text-center text-sm text-gray-500">Eventos disponíveis apenas para partidas em andamento...</p>
                </div>
            )}

        </div>
    )
}