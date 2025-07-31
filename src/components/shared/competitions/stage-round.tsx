import type { GroupData } from "@/types/competition";
import GroupTable from "./group-table";
import RoundsContainer from "./round-container";

interface GroupStageRoundProps {
  groupData: GroupData;
  variant?: "student" | "organizer";
}

export default function GroupStageRound({ groupData, variant }: GroupStageRoundProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <GroupTable groupName={groupData.name} classifications={groupData.classifications} />
      
      <div className="border rounded-lg overflow-hidden">
        <RoundsContainer variant={variant} rounds={groupData.rounds} />
      </div>
    </div>
  );
}