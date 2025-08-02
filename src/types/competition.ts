import type { Team } from "./team";

export interface APIGetCompetitions {
  competitions: Competition[] | null;
}

export interface Modality {
  id: string;
  name: string;
  campus: string;
}

export interface MatchTeam {
  competition: string;
  team_id: string;
}

export interface CompetitionTeam {
  team_id: string;
  competition: Competition;
}

export interface APIGetTeamInCompetition {
  team_id: string;
  competition: Competition;
}

export type CompetitionSystem = 'league' | 'groups_elimination' | 'elimination';
export type CompetitionStatus = 'not-started' | 'in-progress' | 'finished';
export type MatchStatus = 'not-started' | 'in-progress' | 'finished';

export interface Match {
  id: string;
  competition: string;
  group?: string | null;
  round?: string | null;
  round_match_number: number;
  status: 'not-started' | 'in-progress' | 'finished';
  scheduled_datetime?: string | null;
  team_home?: MatchTeam | null; 
  team_away?: MatchTeam | null;
  home_feeder_match?: string | null;
  away_feeder_match?: string | null;
  score_home?: number | null;
  score_away?: number | null;
  winner?: string | null;
}

export interface TeamClassification {
  id: string;
  team: Team;
  position: number;
  points: number;
  games_played: number;
  wins: number;
  draws: number;
  losses: number;
  score_pro: number;
  score_against: number;
  score_difference: number;
}

export interface RoundData {
  id: string;
  name: string;
  matches: Match[];
  _groupMatches?: Record<string, Match[]>;
}

export interface GroupData {
  id: string;
  name: string;
  classifications: TeamClassification[];
  rounds: RoundData[];
}

export interface Stage {
  key: string;
  name: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Competition {
  id: string;
  name: string;
  modality: string;
  status: CompetitionStatus;
  start_date: string | null;
  end_date: string | null;
  system: CompetitionSystem;
  image: string;
  min_members_per_team: number;
  teams_per_group: number | null;
  teams_qualified_per_group: number | null;
  stages?: Stage[];
}

export interface CompetitionWithModality extends Omit<Competition, 'modality'> {
  modality: Modality;
}