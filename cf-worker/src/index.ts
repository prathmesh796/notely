import { Hono } from "hono"
import { cors } from "hono/cors"
import authMiddleware from "./middleware/auth"
import authRoutes from "./routes/auth"

export interface Env {
	notes_app: D1Database
	JWT_SECRET: string
}

const app = new Hono<{ Bindings: Env }>()

// CORS — allow all origins (tighten in production)
app.use("/*", cors({
	origin: "*",
	allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowHeaders: ["Content-Type", "Authorization"],
}))
const api = new Hono().basePath('/api')

// Public routes
app.route("/auth", authRoutes)

// Protected routes — all routes below this line require a valid JWT
app.use("/*", authMiddleware)

app.get('/', (c) => c.text('Hono!'))

export default app
