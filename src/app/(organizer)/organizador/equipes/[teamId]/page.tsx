import OrganizerTeamDetailsPage from "@/components/pages/organizer-team-details-page";

interface OrganizerTeamDetailsProps {
  params: Promise<{
    teamId: string;
  }>,
}

export default async function OrganizerTeamDetails({ params }: OrganizerTeamDetailsProps) {
  const { teamId } = await params;

  return <OrganizerTeamDetailsPage teamId={teamId} />

}