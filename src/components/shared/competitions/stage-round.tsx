import type { GroupData, Match } from "@/types/competition";
import GroupTable from "./group-table";
import RoundsContainer from "./round-container";
import type { Team } from "@/types/team";

interface GroupStageRoundProps {
  groupData: GroupData;
  variant?: "student" | "organizer";
  teams: Team[];
  onEditMatchClick: (match: Match) => void;
}

export default function GroupStageRound({ groupData, variant, teams, onEditMatchClick }: GroupStageRoundProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-1/2">
        <GroupTable 
          groupName={groupData.name} 
          classifications={groupData.classifications} 
          teams={teams} 
        />
      </div>
      
      <div className="lg:w-1/2">
        <div className="border rounded-lg overflow-hidden">
          {groupData.rounds && groupData.rounds.length > 0 ? (
              <RoundsContainer 
                variant={variant} 
                rounds={groupData.rounds}
                teams={teams}
                onEditMatchClick={onEditMatchClick}
              />
          ) : (
            <div className="p-4 text-center text-gray-500">
              <p>Nenhuma rodada disponível para este grupo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}