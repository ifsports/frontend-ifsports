import {axiosAPI} from "@/lib/axios-api";
import {APIGetCompetitions} from "@/types/competition";

export const getCompetitionsNoAuth = async () => {
    const result = await axiosAPI<APIGetCompetitions>({
        endpoint: "/competitions/",
        withAuth: true, // assumindo que não precisa de auth
    });

    console.log("Resultado completo:", result);
    console.log("Tem data?", !!result.data);
    console.log("Tem error?", !!result.error);

    if (result.error) {
        console.log("Erro:", result.error);
        return null;
    }

    return result.data;
};
