"use client"
import React, { useState, useEffect } from 'react'
import { Button } from '@repo/ui/components/button'
import { Spinner } from '@repo/ui/components/spinner'
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/components/tabs"
import { AppSidebar } from '../../components/appSidebar'
import { ThemeToggle } from '../../components/theme-toggle'
import { SidebarInset, SidebarTrigger } from '@repo/ui/components/sidebar'
import { getNotes, createNote } from '../actions/notes'
import type { Note } from '@repo/types'
import { DashboardNotes } from '../../components/dashboard-notes';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [sharedNotes, setSharedNotes] = useState<Note[]>([]);
  const [selectedTab, setSelectedTab] = useState<"notes" | "shared">("notes");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { notes, sharedNotes } = await getNotes();
        setNotes(notes);
        setSharedNotes(sharedNotes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load notes");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleCreateNote = async () => {
    const newNote = await createNote();
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background text-foreground">
        <Spinner className="size-8" />
      </div>
    )
  }

  return (
    <>
      <AppSidebar
        notes={notes.map(({ id, title }) => ({ id, title }))}
        sharedNotes={sharedNotes.map(({ id, title }) => ({ id, title }))}
      />

      <SidebarInset className="min-h-screen min-w-0 text-foreground">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border/40 bg-background/95 px-6 backdrop-blur supports-backdrop-filter:bg-background/60">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 md:p-8">
          <div className="mx-auto w-full max-w-5xl space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Notes</h2>
              <p className="text-muted-foreground mt-2">
                Capture your thoughts and ideas.
              </p>
            </div>

            <Tabs defaultValue="notes" value={selectedTab} onValueChange={(value) => setSelectedTab(value as "notes" | "shared")}>
              <TabsList variant="line">
                <TabsTrigger value="notes">Your Notes</TabsTrigger>
                <TabsTrigger value="shared">Shared with you</TabsTrigger>
              </TabsList>
            </Tabs>

            {error ? (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            ) : selectedTab === "notes" && notes.length > 0 ? (
              <DashboardNotes notesType="notes" notes={notes} setNotes={setNotes} />
            ) : selectedTab === "shared" && sharedNotes.length > 0 ? (
              <DashboardNotes notesType="shared" notes={sharedNotes} setNotes={setSharedNotes} />
            ) : (
              <div className="flex min-h-100 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card text-card-foreground shadow-sm">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  {/* Note icon */} 
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold">No {selectedTab === "shared" ? "shared notes" : "notes"} yet</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  {selectedTab === "shared"
                    ? "Notes shared with you will appear here."
                    : "You haven&apos;t created any notes. Start writing now."}
                </p>
                {selectedTab === "notes" && <Button onClick={handleCreateNote}>Create your first note</Button>}
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </>
  )
}
