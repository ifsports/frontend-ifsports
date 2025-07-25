import MatchLivePanel from "@/components/features/games/match-live-panel";
import GameEventsPanel from "@/components/features/games/game-events-panel";
import GameChat from "@/components/features/games/game-chat";

interface GameCommentsPageProps {
    params: Promise<{
        gameId: string;
        campusId: string;
    }>,
}

export default async function GameCommentsPage({ params } : GameCommentsPageProps) {
    const { gameId, campusId } = await params;

    console.log("GameCommentsPage params:", { gameId, campusId });

    return (
        <div className="mt-8 mb-12 w-full h-screen flex justify-between gap-4">
            <div className="flex flex-1 flex-col gap-4 h-full">
                <div className="flex-1 overflow-hidden">
                    <MatchLivePanel variant="live" />
                </div>
                <div className="flex-1 overflow-hidden">
                    <GameEventsPanel variant="live" />
                </div>
            </div>
            <div className="h-full">
                <GameChat variant="live" />
            </div>
        </div>

    )
}