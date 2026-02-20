import { Hono } from "hono"
import { generateJWT } from "../utils/jwt"
import { hashPassword, comparePassword } from "../utils/hash"

export interface Env {
    notes_app: D1Database
    JWT_SECRET: string
}

const auth = new Hono<{ Bindings: Env }>()

// --- Helper: fetch a user record from D1 ---
async function getUserFromDB(
    db: D1Database,
    email: string
): Promise<{ id: number; email: string; password: string } | null> {
    const result = await db
        .prepare("SELECT id, email, password FROM users WHERE email = ?")
        .bind(email)
        .first<{ id: number; email: string; password: string }>()
    return result ?? null
}

// POST /auth/register
auth.post("/register", async (c) => {
    const { email, password } = await c.req.json<{
        email: string
        password: string
    }>()

    if (!email || !password) {
        return c.json({ error: "Email and password are required" }, 400)
    }

    // Check if email is already taken
    const existing = await getUserFromDB(c.env.notes_app, email)
    if (existing) {
        return c.json({ error: "Email already in use" }, 409)
    }

    const hashed = await hashPassword(password)

    await c.env.notes_app
        .prepare("INSERT INTO users (email, password) VALUES (?, ?)")
        .bind(email, hashed)
        .run()

    return c.json({ message: "User registered successfully" }, 201)
})

// POST /auth/login
auth.post("/login", async (c) => {
    const { email, password } = await c.req.json<{
        email: string
        password: string
    }>()

    if (!email || !password) {
        return c.json({ error: "Email and password are required" }, 400)
    }

    const user = await getUserFromDB(c.env.notes_app, email)

    // Use a consistent error message to avoid user-enumeration
    if (!user) {
        return c.json({ error: "Invalid credentials" }, 401)
    }

    const valid = await comparePassword(password, user.password)
    if (!valid) {
        return c.json({ error: "Invalid credentials" }, 401)
    }

    // exp and iat are set inside generateJWT automatically (Unix seconds)
    const token = await generateJWT(
        { userId: user.id, email: user.email },
        c.env.JWT_SECRET,
        60 * 60 // 1 hour
    )

    return c.json({ token })
})

export default auth