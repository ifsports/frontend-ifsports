import type { CreateTeamFormData } from "@/lib/schemas/team-schema";
import type { Competition } from "./competition";

export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  created_at: string;
  status: 'pendent' | 'active' | 'closed';
  campus_code: string;
  members: TeamMember[];
}

export interface TeamWithCompetition extends Team {
  competition: Competition | null;
}

export interface TeamMember {
  user_id: string;
  name?: string;
  registration?: string;
  course?: string;
  user_data?: {
    nome?: string;
    matricula?: string;
    curso?: string;
    email?: string;
    // adicione outros campos conforme necessário
  } | null;
}

export interface APIGetTeamsFromCampus {
  teams: Team[] | null;
}

export type CreateTeamPayload = Omit<CreateTeamFormData, 'members'> & {
  members: string[];
};