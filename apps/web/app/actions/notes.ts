import { getSession } from "next-auth/react";

export async function getNotes() {
    const session = await getSession();
    const response = await fetch("http://localhost:3000/api/notes", {
        headers: {
            "Authorization": `Bearer ${session?.access_token}`,
            "Content-Type": "application/json"
        },
    });
    return await response.json();
}

export async function getNote(id: string) {
    const session = await getSession();
    const response = await fetch(`http://localhost:3000/api/notes/${id}`, {
        headers: {
            "Authorization": `Bearer ${session?.accessToken}`,
            "Content-Type": "application/json"
        },
    });
    return await response.json();
}

export async function createNote(note: any) {
    const session = await getSession();
    const response = await fetch("http://localhost:3000/api/notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(note),
    });
    return await response.json();
}

export async function deleteNote(id: string) {
    const session = await getSession();
    const response = await fetch(`http://localhost:3000/api/notes/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.accessToken}`,
        },
    });
    return await response.json();
}

export async function updateNote(id: string, note: any) {
    const session = await getSession();
    const response = await fetch(`http://localhost:3000/api/notes/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(note),
    });
    return await response.json();
}