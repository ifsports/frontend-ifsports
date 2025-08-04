import { editGameSchema, type EditGameFormData } from "@/lib/schemas/edit-game-schema";
import type { Match } from "@/types/competition";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const useEditGameForm = (selectedGame?: Match) => {
  const form = useForm<EditGameFormData>({
    resolver: zodResolver(editGameSchema),
    defaultValues: {
      team_home_id: selectedGame?.team_home?.team_id || '',
      team_away_id: selectedGame?.team_away?.team_id || '',
      date: selectedGame?.scheduled_datetime 
        ? new Date(selectedGame.scheduled_datetime).toISOString().split('T')[0] 
        : '',
      time: selectedGame?.scheduled_datetime 
        ? new Date(selectedGame.scheduled_datetime).toTimeString().slice(0, 5) 
        : '',
      round: selectedGame?.round || '',
    },
  });

  return form;
};