import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ChatMessage() {
    return (
        <div className="flex items-start gap-3">
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-[2px]">
                <p className="text-[#4F4F4F] text-xs font-semibold">Gustavo</p>
                <p className="text-xs">está de quanto a partida? vamos ganhaaarrrr está de quanto a partida? vamos ganhaaarrrr está de quanto a partida? vamos ganhaaarrrr está de quanto a partida? vamos ganhaaarrrr</p>
            </div>
        </div>
    )
}