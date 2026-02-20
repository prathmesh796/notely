import { Hono } from "hono"
import { authMiddleware } from "./middleware/auth"
import authRoutes from "./routes/auth"

export interface Env {
	notes_app: D1Database
	JWT_SECRET: string
}

const app = new Hono<{ Bindings: Env }>()

// Public routes
app.route("/auth", authRoutes)

// Protected routes — all routes below this line require a valid JWT
app.use("/api/*", authMiddleware)

export default app
