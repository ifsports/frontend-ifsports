import Link from "next/link";

interface GameLiveProps {
    variant?: "live" | "pendent";
}

export default function GameLive({ variant } : GameLiveProps) {
    return (
        <Link href="#" className="rounded-xl bg-white shadow-2xl flex flex-col gap-2 items-center pt-4 px-4 pb-6">
            <div className="flex items-center gap-2 flex-col">
                { variant === "live" ? (
                    <div className="flex items-center justify-center gap-2 bg-red-500 px-5 py-2 rounded-full">
                        <span className="w-2 h-2 bg-[#ffffff] rounded-full inline-block flex-shrink-0" />
                        <p className="text-xs font-bold text-[#ffffff]">Ao vivo</p>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-2 bg-[#EDEDED] px-5 py-2 rounded-full">
                        <p className="text-xs font-semibold text-[#4F4F4F] font-title">Pendente</p>
                    </div>
                )}
                <p className="text-[#9CA4AB] text-sm">Futsal Masculino</p>
            </div>

            <div className="flex items-center justify-between gap-4 w-full">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full flex-shrink-0 bg-[#4CAF50]">
                        <p className="font-bold text-[#ffffff] text-sm">BAR</p>
                    </div>
                    <div className="flex items-center justify-center flex-col">
                        <p className="font-medium text-sm">Barcelona</p>
                        <p className="text-xs text-[#9CA4AB]">Casa</p>
                    </div>
                </div>

                <div>
                    { variant === "live" ? (
                        <p className="text-4xl font-semibold max-[338px]:text-3xl">1 - 1</p>
                    ) : (
                        <p className="text-4xl font-semibold">-</p>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full flex-shrink-0 bg-[#4CAF50]">
                        <p className="font-bold text-[#ffffff] text-sm">BAR</p>
                    </div>
                    <div className="flex items-center justify-center flex-col">
                        <p className="font-medium text-sm">Barcelona</p>
                        <p className="text-xs text-[#9CA4AB]">Casa</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}