import { Note } from "./Note";

export type User = {
    id: string;
    email: string;
    password: string;
    notes: Note[];
}