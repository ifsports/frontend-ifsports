import type { Team } from "@/types/team";
import { Volleyball } from "lucide-react";

export interface TeamInfoProps {
  team: Team;
}

export default function TeamInfo({ team }: TeamInfoProps) {
  return (
    <div className="flex flex-row items-center gap-2">
      <div className="h-6 w-6 border border-gray-300 rounded-lg flex justify-center items-center">
        <Volleyball size={16} className="text-[#4CAF50]" />
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-sm">{team.name}</span>
        <p className="text-xs text-gray-400">{team.name}</p>
      </div>
    </div>
  );
};