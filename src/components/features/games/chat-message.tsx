import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUserMessage } from "@/hooks/useAuth";
import type { Message } from "@/types/match-comments"

interface ChatMessageProps {
    message: Message;
}

export default function ChatMessage({message}: ChatMessageProps) {

    const { data: user } = getUserMessage(message.user_id);

    return (
        <div className="w-full flex items-start gap-3 min-w-0">
            <Avatar className="w-8 h-8 flex-shrink-0"> {/* Tamanho fixo */}
                <AvatarImage src={user?.foto} />
                <AvatarFallback>{user?.nome.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-[2px] min-w-0 max-w-[calc(100%-2.5rem)]"> {/* Largura calculada */}
                <p className="text-[#4F4F4F] text-xs font-semibold truncate">
                {user?.nome.split(" ").slice(0, 2).join(" ")}
                </p>
                <p className="text-xs break-words hyphens-auto overflow-hidden">
                {message.body}
                </p>
            </div>
        </div>
    )
}