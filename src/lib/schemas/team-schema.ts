import { z } from 'zod';

export const teamSchema = z.object({
  name: z.string().min(1, 'Nome da equipe é obrigatório'),
  abbreviation: z.string().min(1, 'Abreviação é obrigatória').max(3, 'A abreviação deve ter no máximo 3 caracteres.'),
  competition_id: z.string().min(1, 'Competição é obrigatória'),
  members: z.array(
    z.object({
      registration: z.string().min(1, 'Matrícula é obrigatória')
    })
  ).min(1, 'Pelo menos um membro é obrigatório')
});

export type CreateTeamFormData = z.infer<typeof teamSchema>;