"use client"

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@repo/ui/components/button'
import { Spinner } from '@repo/ui/components/spinner'
import { toast } from "sonner"
import { AppSidebar } from '../../../components/appSidebar'
import { ThemeToggle } from '../../../components/theme-toggle'
import { AccessDialog } from '../../../components/accessDialog'
import { SidebarTrigger } from '@repo/ui/components/sidebar'
import { getNote, getNotes, updateNoteMetadata, updateNoteContent } from '../../actions/notes'
import type { Note, SidebarNote } from '@repo/types'

const MarkdownEditor = dynamic(() => import('../../../components/markdown-editor'), {
  ssr: false,
})

const NotePage = () => {
  const { note: noteId } = useParams<{ note: string }>();
  const { data: session } = useSession();

  const [note, setNote] = useState<Note>();
  const [sidebarNotes, setSidebarNotes] = useState<SidebarNote[]>([]);
  const [sharedSidebarNotes, setSharedSidebarNotes] = useState<SidebarNote[]>([]);
  const [noteContent, setNoteContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const [data, notes] = await Promise.all([getNote(noteId), getNotes()]);
        setNote(data.note);
        setNoteContent(data.content);
        setSidebarNotes(notes.notes.map(({ id, title }) => ({ id, title })));
        setSharedSidebarNotes(notes.sharedNotes.map(({ id, title }) => ({ id, title })));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load note");
        toast.error(error || "Unable to load note");
      } finally {
        setLoading(false);
      }
    };

    void fetchNote();
  }, [noteId]);

  const handleSave = async () => {
    if (!note) return;
    try {
      await updateNoteContent(noteId, noteContent);
      if (note.title !== undefined) await updateNoteMetadata(noteId, { title: note.title });
      toast.success("Note saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to save note");
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <AppSidebar notes={sidebarNotes} sharedNotes={sharedSidebarNotes} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border/40 bg-background/95 px-6 backdrop-blur supports-backdrop-filter:bg-background/60">
          <SidebarTrigger />
          <div className="flex-1">
            <input
              className="text-lg font-semibold tracking-tight focus:outline-none"
              value={note?.title || ""}
              onChange={(e) => setNote({ ...note, title: e.target.value } as Note)}
            />
          </div>
          <div className="flex items-center gap-4">
            {note?.userId === session?.user?.id && <AccessDialog noteId={noteId} editors={note?.editors ?? []} />}
            <Button variant="outline" size="sm" onClick={handleSave}>Save</Button>
            <ThemeToggle />
          </div>
        </header>

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner className="size-8" />
          </div>
        ) : (
          <main className="flex-1 overflow-auto p-6 md:p-8">
            <div className="mx-auto max-w-4xl space-y-8">
              {note ? (
                <MarkdownEditor
                  key={noteId}
                  markdown={noteContent}
                  onChange={setNoteContent}
                />
              ) : (
                <p>Note not found.</p>
              )}
            </div>
          </main>
        )}
      </div>
    </div >
  )
}

export default NotePage
