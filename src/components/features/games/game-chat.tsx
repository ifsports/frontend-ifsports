'use client'

import ChatMessage from "@/components/features/games/chat-message";
import { getChatMessages } from "@/hooks/useMatches";
import { createMessageInChat, getChatFromMatch } from "@/lib/requests/match-comments";
import type { Chat, MatchLive, Message } from "@/types/match-comments";
import {SendHorizontal} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { MessageSkeleton } from "./skeleton-chat-message";
import { socket } from "@/lib/socket-provider";

interface GameChatProps {
    gameId: string;
    match: MatchLive | undefined;
}

export default function GameChat({ gameId, match } : GameChatProps) {
    const [chat, setChat] = useState<Chat | null>(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);

    const { data: chatMessages, isLoading: isLoadingChatMessage } = getChatMessages(chat?.id || null);

    useEffect(() => {
        if (chatMessages) {
            setMessages(chatMessages);
        }
    }, [chatMessages]);

    async function sendMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!chat || !message.trim()) {
            toast.error("Por favor, informe uma mensagem válida.");
            return;
        }
        try {
            const response = await createMessageInChat({ chat_id: chat.id, body: message.trim() });

            if (response && response.data) {
                setMessage("");
            } else {
                toast.error("Erro ao enviar mensagem.");
            }
        } catch (error) {
            toast.error("Erro ao enviar mensagem.");
        }
    }

    useEffect(() => {
        const handleUpdateChatMessage = (data: Message) => {
            setMessages((prev) => [...prev, data]);
        };

        socket.on("new_message", handleUpdateChatMessage);

        return () => {
            socket.off("new_message", handleUpdateChatMessage);
        };
    }, []);

    async function getChat() {
        if (!gameId) {
            return;
        }

        const response = await getChatFromMatch({ match_id: gameId });

        if (response && response.data) {
            setChat(response.data);
        } else {
            toast.error("Não foi possível carregar o chat da partida.");
        }
    }

    useEffect(() => {
        getChat();
    }, [gameId]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="w-[20rem] h-full border border-[#E2E8F0] rounded-sm flex flex-col">

            <div className="bg-gradient-to-r from-[#4CAF50] to-[#147A02] p-4 flex justify-center rounded-tr-sm rounded-tl-sm">
                <p className="font-title font-bold text-[#ffffff]">Fale no chat</p>
            </div>

            { match?.status === "in-progress" ? (
                <div className="p-4 flex flex-col gap-4 flex-grow overflow-y-auto">
                    {isLoadingChatMessage || !chatMessages ? (
                    Array.from({ length: 3 }).map((_, i) => <MessageSkeleton key={i} />)
                    ) : messages.length > 0 ? (
                    <>
                        {messages.map((message, index) => (
                        <ChatMessage key={message.id || index} message={message} />
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                    ) : (
                    <p className="text-center text-sm text-gray-500">Nenhuma mensagem no chat ainda...</p>
                    )}
                </div>
            ) : (
                <div className="p-4 flex flex-col gap-4 flex-grow flex items-center justify-center w-full">
                    <p className="text-center text-sm text-gray-500 max-w-full">
                        Chat disponível apenas para partidas em andamento...
                    </p>
                </div>
            )}

            <form onSubmit={sendMessage} className="w-full border-t border-[#E2E8F0] px-4 py-2 flex items-center justify-between gap-3">
                <input
                    type="text"
                    className="text-sm rounded focus:outline-none flex-1"
                    placeholder="Enviar uma mensagem..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit" className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer bg-[#4CAF50]">
                    <SendHorizontal size={20} className="text-[#ffffff]" />
                </button>
            </form>
        </div>
    )
}
