import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent
} from "@repo/ui/components/sidebar"
import { NavMain } from "./nav-main"
import { Button } from "@repo/ui/components/button"
import { createNote } from "../app/actions/notes"
import { signOut } from "next-auth/react";
import Link from "next/link";
import type { SidebarNote } from "@repo/types";

export function AppSidebar(params: { notes: SidebarNote[] | null; sharedNotes?: SidebarNote[] | null }) {
  const { notes, sharedNotes } = params;

  const items = notes?.map((note) => ({
    title: note.title,
    url: `/dashboard/${encodeURIComponent(note.id)}`,
  })) || [];

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
        <NavMain label="Your notes" items={items} />
        <NavMain label="Shared with you" items={sharedNotes?.map((note) => ({ title: note.title, url: `/dashboard/${encodeURIComponent(note.id)}` })) || []} />
      </SidebarContent>
      <SidebarFooter >
        <Button variant="destructive" onClick={() => signOut({ callbackUrl: "/" })}>Log out</Button>
      </SidebarFooter>
    </Sidebar>
  )
}
