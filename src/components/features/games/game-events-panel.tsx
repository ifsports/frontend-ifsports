import GameEvent from "@/components/features/games/game-event";

interface GameEventsPanelProps {
    variant?: "live" | "pendent";
}

export default function GameEventsPanel({ variant } : GameEventsPanelProps) {
    return (
        <div className="border border-[#E2E8F0] rounded-sm flex flex-col gap-4 p-4 h-full">
            <h4 className="font-title font-bold text-xl text-[#062601]">Eventos da partida</h4>
            { variant ===  "live" ? (
                <div className="flex flex-col gap-3 overflow-y-auto">
                    <GameEvent />
                    <GameEvent />
                    <GameEvent />
                    <GameEvent />
                    <GameEvent />
                    <GameEvent />
                    <GameEvent />
                    <GameEvent />
                </div>
            ) : (
                <div className="flex h-full justify-center items-center">
                    <p>Sem eventos para partidas não iniciadas</p>
                </div>
            ) }

        </div>
    )
}