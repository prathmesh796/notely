import React from 'react'
import Link from 'next/link'
import { Button } from '@repo/ui/components/button'
import type { Note } from '@repo/types'
import { deleteNote } from '../app/actions/notes';

export const dashboardNotes = ({notesType, notes, setNotes}: { notesType: 'notes' | 'shared', notes: Note[], setNotes: React.Dispatch<React.SetStateAction<Note[]>> }) => {
    
    const handleDeleteNote = async (id: string) => {
        await deleteNote(id);
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    };

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
                <div key={note.id} className="relative rounded-lg border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
                    <Link href={`/dashboard/${encodeURIComponent(note.id)}`} className="">
                        <h3 className="text-lg font-semibold">{note.title}</h3>
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
    )
}

export default dashboardNotes