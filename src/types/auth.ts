import {Session} from "next-auth";

export interface APISignIn {
    access: string;
    refresh: string;
}

export interface SessionType {
    data: Session | null;
    status?: string;
}