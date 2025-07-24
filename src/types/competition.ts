export interface Competition {
    id: string;
    name: string;
    modality: string;
    status?: 'league' | 'groups_elimination' | 'elimination';
    start_date: string | null;
    end_date: string | null;
    system: string;
    image: string;
    min_members_per_team: number;
    teams_per_group: number | null;
    teams_qualified_per_group: number | null;
}

export interface APIGetCompetitions {
    competitions: Competition[] | null;
}

export interface Modality {
    id: string;
    name: string;
    campus: string;
}

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

export interface MatchTeam {
    competition: string;
    team_id: string;
}

export interface APIGetMatchesFromCampus {
    count: number;
    next: string | undefined;
    previous: string | undefined;
    results: Match[];
}