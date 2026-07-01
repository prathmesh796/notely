import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuButton
} from "@repo/ui/components/sidebar"
import { Button } from "@repo/ui/components/button"
import { createNote } from "../app/actions/notes"
import { signOut } from "next-auth/react";
import Link from "next/link";

export function AppSidebar(params: { notes: { id: string; title: string }[] }) {
  const { notes } = params;

  return (
    <Sidebar className="border-r border-border/40 bg-card">
      <SidebarHeader>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Notes</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
            <SidebarGroupContent>
                <Button className="w-full" onClick={createNote}>+ Create Note</Button>
            </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
            <SidebarGroupLabel>Your Notes</SidebarGroupLabel>
            <SidebarGroupContent>
                {notes.map((note) => (
                    <Link key={note.id} href={`/dashboard/${encodeURIComponent(note.id)}`}>
                        <SidebarMenuButton>{note.title || "Untitled Note"}</SidebarMenuButton>
                    </Link>
                ))}
            </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter >
        <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>Log out</Button>
      </SidebarFooter>
    </Sidebar>
  )
}