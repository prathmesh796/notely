const encoder = new TextEncoder()

// --- Base64URL helpers (JWT requires URL-safe Base64, not standard Base64) ---

function base64UrlEncode(bytes: ArrayBuffer | string): string {
    const str =
        typeof bytes === "string"
            ? bytes
            : String.fromCharCode(...new Uint8Array(bytes))
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function base64UrlDecode(str: string): string {
    // Restore padding and standard Base64 chars before decoding
    const padded = str.replace(/-/g, "+").replace(/_/g, "/")
    const pad = padded.length % 4
    return atob(pad ? padded + "=".repeat(4 - pad) : padded)
}

// --- JWT generation ---

export async function generateJWT(
    payload: Record<string, unknown>,
    secret: string,
    expiresInSeconds = 60 * 15 // default: 15 minutes
): Promise<string> {
    const header = { alg: "HS256", typ: "JWT" }

    // exp MUST be Unix seconds, not milliseconds
    const now = Math.floor(Date.now() / 1000)
    const claims = { ...payload, iat: now, exp: now + expiresInSeconds }

    const base64Header = base64UrlEncode(JSON.stringify(header))
    const base64Payload = base64UrlEncode(JSON.stringify(claims))

    const data = `${base64Header}.${base64Payload}`

    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    )

    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data))

    const base64Signature = base64UrlEncode(signature)

    return `${data}.${base64Signature}`
}

// --- JWT verification ---

export async function verifyJWT(
    token: string,
    secret: string
): Promise<Record<string, unknown> | null> {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const [header, payload, signature] = parts
    const data = `${header}.${payload}`

    let key: CryptoKey
    try {
        key = await crypto.subtle.importKey(
            "raw",
            encoder.encode(secret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["verify"]
        )
    } catch {
        return null
    }

    // Decode the Base64URL signature back to raw bytes
    const rawSignature = Uint8Array.from(base64UrlDecode(signature), (c) =>
        c.charCodeAt(0)
    )

    const isValid = await crypto.subtle.verify(
        "HMAC",
        key,
        rawSignature,
        encoder.encode(data)
    )

    if (!isValid) return null

    let claims: Record<string, unknown>
    try {
        claims = JSON.parse(base64UrlDecode(payload))
    } catch {
        return null
    }

    // Validate expiry (exp is in Unix seconds)
    const now = Math.floor(Date.now() / 1000)
    if (typeof claims.exp === "number" && claims.exp < now) {
        return null // Token has expired
    }

    return claims
}