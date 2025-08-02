import OrganizerGameDetailPage from "@/components/pages/organizer-game-details-page";

interface OrganizerGameDetailContainerProps {
    params: Promise<{
        matchId: string;
        campusId: string;
    }>,
}

export default async function OrganizerGameDetailContainer({ params } : OrganizerGameDetailContainerProps) {
    const { matchId, campusId } = await params;

    return (
      <OrganizerGameDetailPage matchId={matchId} campusId={campusId} />
    )
}