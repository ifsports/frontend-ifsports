'use client'

import GameEvent from "@/components/features/games/game-event";
import { getCommentsFromMatch, createComment } from "@/lib/requests/match-comments";
import { socket } from "@/lib/socket-provider";
import type { Comments, MatchLive } from "@/types/match-comments";
import { SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface GameEventsPanelProps {
    gameId: string;
    match: MatchLive | undefined;
    variant?: "student" | "organizer";
}

export default function GameEventsPanel({ gameId, match, variant="student" } : GameEventsPanelProps) {
    const [comments, setComments] = useState<Comments[] | []>([]);
    const [commentInput, setCommentInput] = useState("");

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

    const handleCreateComment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!commentInput.trim()) return;

        const response = await createComment(gameId, { body: commentInput });
        
        if (response.success) {
            setCommentInput("");
        } else {
            toast.error("Erro ao enviar evento");
        }
    }

    return (
        <div className="border border-[#E2E8F0] bg-white rounded-sm flex flex-col gap-4 p-4 h-full min-h-0">
            <h4 className="font-title font-bold text-xl text-[#062601] flex-shrink-0">Eventos da partida</h4>
            
            {match?.status === "in-progress" ? (
                <div className="flex flex-col gap-4 flex-1 min-h-0">
                    {comments && comments.length > 0 ? (
                        <div className="flex flex-col gap-3 overflow-y-auto flex-1 min-h-0">
                            {comments.map((comment, index) => (
                                <GameEvent key={comment.id || index} comment={comment} />
                            ))}
                            <div ref={commentsEndRef} />
                        </div>
                    ) : (
                        <div className="flex flex-1 justify-center items-center">
                            <p className="text-center text-sm text-gray-500">Sem eventos...</p>
                        </div>
                    )}
                    
                    {variant === "organizer" && (
                        <form onSubmit={handleCreateComment} className="w-full border rounded-xl border-[#E2E8F0] px-3 py-1 flex items-center justify-between gap-3 flex-shrink-0">
                            <input
                                type="text"
                                className="text-sm rounded focus:outline-none flex-1"
                                placeholder="Enviar um evento..."
                                value={commentInput}
                                onChange={e => setCommentInput(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer bg-[#4CAF50]"
                            >
                                <SendHorizontal size={18} className="text-[#ffffff]" />
                            </button>
                        </form>
                    )}
                </div>
            ) : (
                <div className="flex flex-1 justify-center items-center">
                    <p className="text-center text-sm text-gray-500">
                        Eventos disponíveis apenas para partidas em andamento...
                    </p>
                </div>
            )}
        </div>
    )
}