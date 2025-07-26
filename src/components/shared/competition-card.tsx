import type { Competition } from "@/types/competition";
import Image from "next/image";
import Link from "next/link";

interface CompetitionCardProps {
  competition: Competition;
}

export default function CompetitionCard({ competition }: CompetitionCardProps) {
  return (
    <div
        className="w-full h-96 p-6 rounded shadow-xl flex flex-col justify-between items-start gap-6 bg-white"
    >
        <div className="relative w-full h-40 overflow-hidden rounded">
            {competition.image ? (
                <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${competition.image}`}
                    alt={competition.name || ''}
                    fill
                    className="object-cover rounded"
                />
            ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded">
                    <span className="text-gray-400">Sem imagem</span>
                </div>
            )}
        </div>
        <div className="flex flex-col gap-2">
            <span className="font-medium text-base">{competition.name}</span>
            <p className="text-[#676767] text-sm text-justify">
                Acesse a página com todas as informações sobre o {competition.name.toLowerCase()}, incluindo equipes participantes, horários dos jogos e resultados atualizados.
            </p>
        </div>
        <Link href="" className="ml-auto border-0 px-8 py-2 text-white text-sm font-bold bg-[#4CAF50] rounded cursor-pointer tracking-wider">
            Acessar
        </Link>
        
    </div>
  )
}