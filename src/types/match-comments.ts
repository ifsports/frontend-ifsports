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

export interface EnrichedMatchLive extends MatchLive {
  hasSchedule: boolean;
  scheduled_datetime?: string;
}

export interface APIGetMatchesLiveFromCampus {
  matches: MatchLive[] | null;
}

export interface Comments {
  id: string;
  body: string;
  match_id: string;
  created_at: string;
}

export interface Chat {
  id: string;
  match_id: string;
  created_at: string;
  finished_at: string | null;
}

export interface Message {
  id: string;
  body: string;
  user_id: string;
  chat_id: string;
  created_at: string;
}