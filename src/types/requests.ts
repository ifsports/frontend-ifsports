import type { Player, TeamWithCompetition } from "@/app/(organizer)/organizador/solicitacoes/page";

export enum RequestTypeEnum {
  APPROVE_TEAM = "approve_team",
  DELETE_TEAM = "delete_team",
  REMOVE_TEAM_MEMBER = "remove_team_member",
  ADD_TEAM_MEMBER = "add_team_member",
}

export enum RequestStatusEnum {
  PENDENT = "pendent",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface Request {
  id: string;
  team_id: string;
  user_id?: string;
  competition_id?: string;
  campus_code: string;
  request_type: RequestTypeEnum;
  reason?: string;
  reason_rejected?: string;
  status: RequestStatusEnum;
  created_at: string;
  team?: TeamWithCompetition;
  user?: Player;
}