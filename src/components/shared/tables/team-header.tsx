import { ChevronDown } from "lucide-react";
import ActionButton, { type ActionButtonProps } from "./action-button";
import TeamInfo from "./team-info";
import type { Team, TeamWithCompetition } from "@/types/team";

export interface TeamHeaderProps {
  team: TeamWithCompetition;
  actions: ActionButtonProps[];
  isExpanded: boolean;
  onToggle: () => void;
  showToggle?: boolean;
}

export default function TeamHeader({ team, actions, isExpanded, onToggle, showToggle }: TeamHeaderProps){
  return (
    <div className="flex justify-between items-center">
      <TeamInfo team={team} />
      <div className="flex items-center gap-4 min-h-[46px]">
        {actions.map((action, index) => (
          <ActionButton key={index} {...action} />
        ))}
        {showToggle && (
          <button onClick={onToggle} className="border-none bg-transparent">
            <ChevronDown 
              className={`h-3.5 w-3.5 cursor-pointer transition-transform duration-300 ease-in-out ${
                isExpanded ? 'rotate-180' : 'rotate-0'
              }`} 
            />
          </button>
        )}
      </div>
    </div>
  );
};