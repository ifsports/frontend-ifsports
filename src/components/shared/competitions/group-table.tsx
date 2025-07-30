import type { TeamClassification } from "@/types/competition";
import { Volleyball } from "lucide-react";

interface GroupTableProps {
  groupName: string;
  classifications: TeamClassification[];
}

export default function GroupTable({ groupName, classifications }: GroupTableProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white  flex-1 flex-shrink-0 ">
      <div className="flex mb-5 items-center gap-2">
        <span className="p-1 rounded-md border">
          <Volleyball size={18} className="text-[#4CAF50]" />
        </span>
        <p className="text-sm">
          Grupo {groupName}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="grid grid-cols-9 gap-2 px-4 py-2 border border-[#E2E8F0] bg-gray-50 text-gray-400 rounded-lg mb-1">
              <th className="col-span-3 text-left">Equipe</th>
              <th title="Pontos">P</th>
              <th title="Jogos">J</th>
              <th title="Vitórias">V</th>
              <th title="Empates">E</th>
              <th title="Derrotas">D</th>
              <th title="Saldo de Gols">SG</th>
            </tr>
          </thead>
          <tbody>
            {classifications.map((c) => (
              <tr key={c.id} className="grid grid-cols-9 gap-2 items-center p-4 text-gray-900 border-b last:border-b-0">
                <td className="col-span-3 text-left font-medium">{c.team.name}</td>
                <td className="text-center font-semibold">{c.points}</td>
                <td className="text-center">{c.games_played}</td>
                <td className="text-center">{c.wins}</td>
                <td className="text-center">{c.draws}</td>
                <td className="text-center">{c.losses}</td>
                <td className="text-center">{c.score_difference > 0 ? '+' : ''}{c.score_difference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}