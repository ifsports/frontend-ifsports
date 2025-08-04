import type { Competition, Stage } from '@/types/competition';

interface PopulateOptions {
  numberOfGroups?: number;
  totalTeams?: number;
}

const ALL_KNOCKOUT_STAGES: Stage[] = [
  { key: "round-of-16", name: "OITAVAS DE FINAL" },
  { key: "quarter-finals", name: "QUARTAS DE FINAL" },
  { key: "semifinal", name: "SEMIFINAL" },
  { key: "final", name: "FINAL" }
];

/**
 * Popula o array 'stages' de uma competição com base em seu sistema.
 * @param competition - O objeto da competição vindo da API (sem 'stages').
 * @param options - Dados adicionais como número de grupos ou times.
 * @returns A competição com o array 'stages' preenchido.
*/

export function populateCompetitionStages(
  competition: Omit<Competition, 'stages'>,
  options: PopulateOptions
): Competition {
  const generatedStages: Stage[] = [];

  switch (competition.system) {
    case 'groups_elimination': {
      generatedStages.push({ key: "group-stage", name: "FASE DE GRUPOS" });

      const qualifiedTeams = (options.numberOfGroups ?? 0) * (competition.teams_qualified_per_group ?? 0);
      
      let startIndex = -1;
      if (qualifiedTeams <= 2) startIndex = ALL_KNOCKOUT_STAGES.findIndex(s => s.key === 'final');
      else if (qualifiedTeams <= 4) startIndex = ALL_KNOCKOUT_STAGES.findIndex(s => s.key === 'semifinal');
      else if (qualifiedTeams <= 8) startIndex = ALL_KNOCKOUT_STAGES.findIndex(s => s.key === 'quarter-finals');
      else if (qualifiedTeams <= 16) startIndex = ALL_KNOCKOUT_STAGES.findIndex(s => s.key === 'round-of-16');

      if (startIndex !== -1) {
        generatedStages.push(...ALL_KNOCKOUT_STAGES.slice(startIndex));
      }
      break;
    }

    case 'elimination': {
      const totalTeams = options.totalTeams ?? 0;
      let startIndex = -1;
      if (totalTeams <= 2) startIndex = ALL_KNOCKOUT_STAGES.findIndex(s => s.key === 'final');
      else if (totalTeams <= 4) startIndex = ALL_KNOCKOUT_STAGES.findIndex(s => s.key === 'semifinal');
      else if (totalTeams <= 8) startIndex = ALL_KNOCKOUT_STAGES.findIndex(s => s.key === 'quarter-finals');
      else if (totalTeams <= 16) startIndex = ALL_KNOCKOUT_STAGES.findIndex(s => s.key === 'round-of-16');

      if (startIndex !== -1) {
        generatedStages.push(...ALL_KNOCKOUT_STAGES.slice(startIndex));
      }
      break;
    }

    case 'league': {
      generatedStages.push({ key: "league", name: "PONTOS CORRIDOS" });
      break;
    }
  }

  return {
    ...competition,
    stages: generatedStages
  };
}