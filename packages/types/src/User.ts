import { Note } from "./Note";

export type Session = {
    user: {
        id: string;
        email: string;
    };
    accessToken: string;
    refreshToken: string | null;
}

export type User = {
    id: string;
    email: string;
    password: string;
    notes: Note[];
}