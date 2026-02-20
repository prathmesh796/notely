import { verifyJWT } from "../utils/jwt"

export async function authMiddleware(c: any, next: () => Promise<void>) {
    const authHeader = c.req.header("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json({ error: "Unauthorized: missing or malformed Authorization header" }, 401)
    }

    const token = authHeader.slice(7) // Remove "Bearer " prefix

    if (!token) {
        return c.json({ error: "Unauthorized: token is empty" }, 401)
    }

    const payload = await verifyJWT(token, c.env.JWT_SECRET)

    if (!payload) {
        return c.json({ error: "Unauthorized: invalid or expired token" }, 401)
    }

    c.set("user", payload)

    await next()
}