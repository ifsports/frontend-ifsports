export interface MatchLive {
  match_id: string;
  competition_id: string;
  team_home_id: string;
  team_away_id: string;
  score_home: number;
  score_away: number;
  start_time: string;
  status: string;
}

export interface APIGetMatchesLiveFromCampus {
  matches: MatchLive[] | null;
}