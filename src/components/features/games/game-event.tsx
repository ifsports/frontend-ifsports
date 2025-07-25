import type { Comments } from "@/types/match-comments";

interface GameEventProps {
    comment: Comments;
}

export default function GameEvent({comment} : GameEventProps) {
    return (
        <div className="bg-gradient-to-r from-[#F4F4F4] to-[#ffffff] flex gap-3 rounded-2xl">
            <span className="bg-[#4CAF50] w-3 border rounded-bl-sm rounded-tl-sm" />
            <div className="py-3 px-2">
                <p className="text-sm">{comment.body}</p>
            </div>
        </div>
    )
}