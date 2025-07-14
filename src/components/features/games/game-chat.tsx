import ChatMessage from "@/components/features/games/chat-message";
import {SendHorizontal} from "lucide-react";

interface GameChatProps {
    variant?: "live" | "pendent";
}

export default function GameChat({ variant } : GameChatProps) {
    return (
        <div className="max-w-[23.375rem] w-full h-full border border-[#E2E8F0] rounded-sm flex flex-col">

            <div className="bg-gradient-to-r from-[#4CAF50] to-[#147A02] p-4 flex justify-center rounded-tr-sm rounded-tl-sm">
                <p className="font-title font-bold text-[#ffffff]">Fale no chat</p>
            </div>


            { variant === "live" ? (
                <div className="p-4 flex flex-col gap-4 flex-grow overflow-y-auto">
                    <ChatMessage />
                    <ChatMessage />
                    <ChatMessage />
                    <ChatMessage />
                    <ChatMessage />
                    <ChatMessage />
                    <ChatMessage />
                    <ChatMessage />
                    <ChatMessage />
                    <ChatMessage />
                    <ChatMessage />
                    <ChatMessage />
                    <ChatMessage />
                    <ChatMessage />
                </div>
            ) : (
                <div className="p-4 flex flex-col items-center justify-center gap-4 flex-grow">
                    <p className="text-center"> Chat disponível apenas para partidas em
                        andamento...</p>
                </div>
            )}

            <div className="w-full border-t border-[#E2E8F0] px-4 py-2 flex items-center">
                <input
                    type="text"
                    className="text-sm flex-1 rounded focus:outline-none"
                    placeholder="Enviar uma mensagem..."
                />
                <button className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer bg-[#4CAF50]">
                    <SendHorizontal size={20} className="text-[#ffffff]" />
                </button>
            </div>
        </div>
    )
}
