import { z } from "zod";

export const signInSchema = z.object({
    matricula: z.string().min(1, "Matricula obrigatória"),
    password: z.string().min(1, "Senha obrigatória"),
});

export type SignInData = z.infer<typeof signInSchema>;