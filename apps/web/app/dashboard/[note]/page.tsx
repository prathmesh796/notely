"use client"

import React, { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { Button } from '@repo/ui/components/button'
import { Spinner } from '@repo/ui/components/spinner'
import { AppSidebar } from '../../../components/appSidebar'
import { ThemeToggle } from '../../../components/theme-toggle'
import { SidebarTrigger } from '@repo/ui/components/sidebar'
import { getNote } from '../../actions/notes'
import type { Note, SidebarNote } from '@repo/types'

const Note = (params: { noteId: string, sidebarnotes: SidebarNote[] }) => {
  const noteId = params.noteId;
  const sidebarnotes = params.sidebarnotes;

  const [note, setNote] = useState<Note>();
  const [noteContent, setNoteContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNote = async () => {
      const data = await getNote(noteId);

      setNote(data.note);
      setNoteContent(data.content);
      setLoading(false);
    };

    fetchNote();
  }, [noteId]);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <AppSidebar notes={sidebarnotes || []} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border/40 bg-background/95 px-6 backdrop-blur supports-backdrop-filter:bg-background/60">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-semibold tracking-tight">{note?.title || ""}</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={() => signOut()}>Log out</Button>
          </div>
        </header>

        {loading ? (
          <main className="flex-1 overflow-auto p-6 md:p-8">
            <div className="mx-auto max-w-4xl space-y-8">
              {noteContent ? (
                <div className="prose max-w-none">
                  <p>{noteContent}</p>
                </div>
              ) : (
                <p>Note not found.</p>
              )}
            </div>
          </main>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Spinner className="size-8" />
          </div>
        )}
      </div>
    </div >
  )
}

export default Note