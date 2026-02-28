import { Hono } from "hono"
import { Env } from "../index"

const notes = new Hono<{
    Bindings: Env
    Variables: {
        user: { userId: string; email: string }
    }
}>()

// GET /notes - List all notes for the authenticated user
notes.get("/", async (c) => {
    const user = c.get("user")

    // Fetch notes that are not deleted
    const { results } = await c.env.notes_app
        .prepare("SELECT id, title, content, version, is_archived, created_at, updated_at FROM notes WHERE owner_id = ? AND is_deleted = 0 ORDER BY updated_at DESC")
        .bind(user.userId)
        .all()

    return c.json({ notes: results })
})

// GET /notes/:id - Get a specific note
notes.get("/:id", async (c) => {
    const user = c.get("user")
    const noteId = c.req.param("id")

    const note = await c.env.notes_app
        .prepare("SELECT * FROM notes WHERE id = ? AND owner_id = ? AND is_deleted = 0")
        .bind(noteId, user.userId)
        .first()

    if (!note) {
        return c.json({ error: "Note not found" }, 404)
    }

    return c.json({ note })
})

// POST /notes - Create a new note
notes.post("/", async (c) => {
    const user = c.get("user")
    const body = await c.req.json().catch(() => null)

    if (!body || !body.title) {
        return c.json({ error: "Title is required" }, 400)
    }

    const id = crypto.randomUUID()
    const content = body.content || ""
    const timestamp = new Date().toISOString()

    await c.env.notes_app
        .prepare("INSERT INTO notes (id, owner_id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)")
        .bind(id, user.userId, body.title, content, timestamp, timestamp)
        .run()

    return c.json({ id, title: body.title, content, message: "Note created successfully" }, 201)
})

// PUT /notes/:id - Update an existing note
notes.put("/:id", async (c) => {
    const user = c.get("user")
    const noteId = c.req.param("id")
    const body = await c.req.json().catch(() => null)

    if (!body) {
        return c.json({ error: "Invalid request body" }, 400)
    }

    // Verify ownership
    const existing = await c.env.notes_app
        .prepare("SELECT id, version FROM notes WHERE id = ? AND owner_id = ? AND is_deleted = 0")
        .bind(noteId, user.userId)
        .first<{ id: string, version: number }>()

    if (!existing) {
        return c.json({ error: "Note not found" }, 404)
    }

    // Build update query dynamically
    const updates: string[] = []
    const values: any[] = []

    if (body.title !== undefined) {
        updates.push("title = ?")
        values.push(body.title)
    }

    if (body.content !== undefined) {
        updates.push("content = ?")
        values.push(body.content)
    }

    if (body.is_archived !== undefined) {
        updates.push("is_archived = ?")
        values.push(body.is_archived ? 1 : 0)
    }

    if (updates.length === 0) {
        return c.json({ message: "No changes provided" })
    }

    updates.push("updated_at = ?")
    updates.push("version = version + 1")
    values.push(new Date().toISOString())
    values.push(noteId, user.userId) // for WHERE clause

    const query = `UPDATE notes SET ${updates.join(", ")} WHERE id = ? AND owner_id = ?`

    await c.env.notes_app.prepare(query).bind(...values).run()

    return c.json({ message: "Note updated successfully" })
})

// DELETE /notes/:id - Soft delete a note
notes.delete("/:id", async (c) => {
    const user = c.get("user")
    const noteId = c.req.param("id")

    // Update is_deleted to 1
    const result = await c.env.notes_app
        .prepare("UPDATE notes SET is_deleted = 1, updated_at = ? WHERE id = ? AND owner_id = ?")
        .bind(new Date().toISOString(), noteId, user.userId)
        .run()

    // In D1, changes returns number of rows updated
    if (result.meta && result.meta.changes === 0) {
        return c.json({ error: "Note not found or already deleted" }, 404)
    }

    return c.json({ message: "Note deleted successfully" })
})

export default notes
