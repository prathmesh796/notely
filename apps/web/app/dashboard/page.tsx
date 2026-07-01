"use client"
import React, { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { Button } from '@repo/ui/components/button'
import { AppSidebar } from '../../components/appSidebar'
import { ThemeToggle } from '../../components/theme-toggle'
import { SidebarTrigger } from '@repo/ui/components/sidebar'
import { getNotes, createNote, deleteNote } from '../actions/notes'
import type { Note } from '@repo/types'
import Link from 'next/link';

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const data = await getNotes();
      setNotes(data);
    };

    fetchNotes();
  }, []);

  const handleCreateNote = async () => {
    const newNote = await createNote();
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  const handleDeleteNote = async (id: string) => {
    await deleteNote(id);
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <AppSidebar notes={notes} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border/40 bg-background/95 px-6 backdrop-blur supports-backdrop-filter:bg-background/60">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={() => signOut()}>Log out</Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 md:p-8">
          <div className="mx-auto max-w-4xl space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Notes</h2>
              <p className="text-muted-foreground mt-2">
                Capture your thoughts and ideas.
              </p>
            </div>

            {notes.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {notes.map((note) => (
                  <div key={note.id} className="relative rounded-lg border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
                    <Link href={`/dashboard/${encodeURIComponent(note.id)}`} className="">
                      <h3 className="text-lg font-semibold">{note.title || "Untitled Note"}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{note.content || "No content"}</p>

                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-100 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card text-card-foreground shadow-sm">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  {/* Note icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold">No notes yet</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  You haven&apos;t created any notes. Start writing now.
                </p>
                <Button onClick={handleCreateNote}>Create your first note</Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div >
  )
}