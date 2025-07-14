interface MatchLivePanelProps {
    variant?: "live" | "pendent";
}

export default function MatchLivePanel({ variant } :  MatchLivePanelProps) {
    return (
        <div className="border border-[#E2E8F0] w-full rounded-sm h-full flex flex-col items-center justify-center">
            { variant === "live" ? (
                <div className="flex items-center justify-center gap-2 bg-red-500 py-2 px-8 rounded-full">
                    <span className="w-3 h-3 bg-[#ffffff] rounded-full inline-block flex-shrink-0" />
                    <p className="font-bold font-title text-[#ffffff]">AO VIVO</p>
                </div>
            ) : (
                <div className="flex items-center justify-center gap-2 bg-[#EDEDED] py-2 px-8 rounded-full">
                    <p className="font-bold font-title text-[#4F4F4F]">Pendente</p>
                </div>
            )}


            <div className="flex items-center justify-around w-full">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-center w-24 h-24 rounded-full flex-shrink-0 bg-gradient-to-r from-[#4CAF50] to-[#147A02]">
                        <p className="font-bold text-[#ffffff] text-lg">BAR</p>
                    </div>
                    <div className="flex items-center justify-center flex-col gap-3">
                        <p className="font-bold text-lg">Barcelona</p>
                        <p className="text-sm text-[#4F4F4F] bg-[#EDEDED] py-2 px-4 rounded-full">Casa</p>
                    </div>
                </div>


                <div className="flex flex-col items-center gap-4">
                    { variant === "live" ? (
                        <p className="text-[#147A02] font-bold text-5xl">2 - 8</p>
                    ) : (
                        <p className="text-[#147A02] font-bold text-5xl">-</p>
                    )}

                    <div className="py-1 px-5 bg-[#4CAF50] rounded-full">
                        <p className="text-[#ffffff] text-sm">Futsal Masculino</p>
                    </div>
                </div>


                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-center w-24 h-24 rounded-full flex-shrink-0 bg-gradient-to-r from-[#4CAF50] to-[#147A02]">
                        <p className="font-bold text-[#ffffff] text-lg">BAR</p>
                    </div>
                    <div className="flex items-center justify-center flex-col gap-3">
                        <p className="font-bold text-lg">Barcelona</p>
                        <p className="text-sm text-[#4F4F4F] bg-[#EDEDED] py-2 px-4 rounded-full">Casa</p>
                    </div>
                </div>
            </div>
        </div>
    )
}