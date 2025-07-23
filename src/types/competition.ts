export interface Competition {
    id: string;
    name: string;
    modality: string;
    status?: string;
    start_date: string | null;
    end_date: string | null;
    system: string;
    image: string;
    min_members_per_team: number;
    teams_per_group: number | null;
    teams_qualified_per_group: number | null;
}

export interface APIGetCompetitions {
    competitions: Competition[];
}

export interface Modality {
    id: string;
    name: string;
    campus: string;
}