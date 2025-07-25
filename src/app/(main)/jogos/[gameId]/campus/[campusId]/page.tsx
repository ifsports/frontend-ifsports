import GameCommentsPage from "@/components/pages/game-comments-page";

interface GameCommentsProps {
    params: Promise<{
        gameId: string;
        campusId: string;
    }>,
}

export default async function GameComments({ params } : GameCommentsProps) {
    const { gameId, campusId } = await params;

    return (
        <GameCommentsPage gameId={gameId} campusId={campusId} />
    )
}