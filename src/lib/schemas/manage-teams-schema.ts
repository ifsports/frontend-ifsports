import { z } from "zod";

export const addMemberToTeam = z.object({
    enrollment: z.string().min(1, "Matricula obrigatória"),
});

export type addMemberToTeamData = z.infer<typeof addMemberToTeam>;

export const removeMemberFromTeam = z.object({
    enrollment: z.string().min(1, "Matricula obrigatória"),
    reason: z.string().min(1, "Motivo obrigatório"),
});

export type removeMemberFromTeamData = z.infer<typeof removeMemberFromTeam>;

export const removeTeamSchema = z.object({
    reason: z.string().min(1, "Motivo obrigatório"),
});

export type removeTeamData = z.infer<typeof removeTeamSchema>;