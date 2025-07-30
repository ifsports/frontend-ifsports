import CompetitionPage from "@/components/pages/competitions-page";

interface CompetitionsProps {
  params: Promise<{
    competitionId: string;
  }>,
}

export default async function Competitions({ params } : CompetitionsProps) {
  const { competitionId } = await params;

  return <CompetitionPage competitionId={competitionId} />;
};