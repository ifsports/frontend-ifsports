import { z } from 'zod';

export const editGameSchema = z.object({
  team_home_id: z.string().uuid().optional(),
  team_away_id: z.string().uuid().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  round: z.string().uuid().optional(),
}).refine((data) => {
  if (data.team_home_id && data.team_away_id && data.team_home_id === data.team_away_id) {
    return false;
  }
  return true;
}, {
  message: "Time da casa e time visitante não podem ser iguais",
  path: ["team_away"],
});

export type EditGameFormData = z.infer<typeof editGameSchema>;