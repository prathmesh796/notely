import type { Note } from "@repo/types";

type NotesResponse = {
  notes: Note[];
};

type NoteResponse = {
  note: Note;
  content: string;
};

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const data = (await response.json()) as T & { error?: string; message?: string };

  if (!response.ok) {
    throw new Error(data.error ?? data.message ?? "The notes request failed");
  }

  return data;
}

export async function getNotes(): Promise<Note[]> {
  const data = await request<NotesResponse>("/api/notes");
  return data.notes as Note[];
}

export async function getNote(id: string): Promise<{note: Note; content: string }> {
  const data = await request<NoteResponse>(`/api/notes/${encodeURIComponent(id)}`);
  return { note: data.note, content: data.content };
}

export async function createNote(): Promise<Note> {
  const data = await request<NoteResponse>("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "",
    }),
  });

  return data.note;
}

export async function deleteNote(id: string): Promise<Note> {
  const data = await request<NoteResponse>(
    `/api/notes/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
  return data.note;
}

export async function updateNote(
  id: string,
  note: Pick<Note, "title">,
  content: string
): Promise<Note> {
  const data = await request<NoteResponse>(
    `/api/notes/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...note, content }),
    },
  );
  return data.note;
}
