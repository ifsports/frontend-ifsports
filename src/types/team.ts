export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  created_at: string;
  status: 'pendent' | 'active' | 'closed';
  campus_code: string;
  members: TeamMember[];
}

export interface TeamMember {
  user_id: string;
}

export interface APIGetTeamsFromCampus {
  teams: Team[] | null;
}