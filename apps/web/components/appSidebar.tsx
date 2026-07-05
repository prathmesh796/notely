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
import type { SidebarNote } from "@repo/types";

export function AppSidebar(params: { notes: SidebarNote[] | null }) {
  const { notes } = params;

  return (
    <Sidebar className="border-r border-border/40 bg-card">
      <SidebarHeader>
        <div>
          <Link href={'/'} className="text-2xl font-semibold tracking-tight">Notes</Link>
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
                {notes?.map((note) => (
                    <Link key={note.id} href={`/dashboard/${encodeURIComponent(note.id)}`}>
                        <SidebarMenuButton>
                          {note.title || "Untitled Note"}
                        </SidebarMenuButton>
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