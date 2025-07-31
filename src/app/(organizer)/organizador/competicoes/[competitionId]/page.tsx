import CompetitionDetailsPage from "@/components/pages/competition-details-page";

interface CompetitionOrganizerProps {
  params: Promise<{
    competitionId: string;
  }>,
}

export default async function CompetitionOrganizer({ params }: CompetitionOrganizerProps) {
  const { competitionId } = await params;
  
  return <CompetitionDetailsPage competitionId={competitionId} />
}