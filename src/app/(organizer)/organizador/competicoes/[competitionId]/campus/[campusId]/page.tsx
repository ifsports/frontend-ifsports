import CompetitionPage from "@/components/pages/competitions-page";

interface CompetitionOrganizerProps {
  params: Promise<{
    competitionId: string;
    campusId: string;
  }>,
}

export default async function CompetitionOrganizer({ params }: CompetitionOrganizerProps) {
  const { competitionId, campusId } = await params;
  
  return <CompetitionPage competitionId={competitionId} campusId={campusId} variant="organizer" />
}