import { getDetailsUser } from "@/lib/requests/auth";
import type { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function getUserMessage(user_id: string){
    return useQuery({
        queryKey: ['userMessage', user_id],
        queryFn: async () => {
            if (!user_id) {
            toast.error("Por favor, informe o ID do usuário para ver as informações dele.");
            throw new Error("Jogo não selecionado");
            }

            const response = await getDetailsUser(user_id);

            if (!response || !response.data) {
            toast.error("Detalhes do usuário não encontrados.");
            throw new Error("Dados do usuário não encontrados");
            }

            return response?.data as User;
        },
        enabled: !!user_id,
        retry: false,
        });
}