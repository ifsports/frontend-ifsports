import CompetitionPage from "@/components/pages/competitions-page";

interface CompetitionsProps {
  params: Promise<{
    competitionId: string;
    campusId: string;
  }>,
}

export default async function Competitions({ params } : CompetitionsProps) {
  const { competitionId, campusId } = await params;

  return <CompetitionPage competitionId={competitionId} campusId={campusId} />;
};