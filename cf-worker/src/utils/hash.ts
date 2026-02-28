/**
 * Password hashing using PBKDF2 via the Web Crypto API.
 * bcryptjs relies on Node.js internals and does NOT work in Cloudflare Workers.
 *
 * Format stored: "pbkdf2:<iterations>:<hex-salt>:<hex-hash>"
 */

const ITERATIONS = 100_000
const KEY_LENGTH = 32 // bytes (256 bits)
const ALGORITHM = "SHA-256"

const encoder = new TextEncoder()

function bufToHex(buf: ArrayBuffer | Uint8Array): string {
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("")
}

function hexToBuf(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2)
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
    }
    return bytes
}

async function deriveKey(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
    )

    return crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt,
            iterations: ITERATIONS,
            hash: ALGORITHM,
        },
        keyMaterial,
        KEY_LENGTH * 8
    )
}

export async function hashPassword(password: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const hash = await deriveKey(password, salt)
    return `pbkdf2:${ITERATIONS}:${bufToHex(salt)}:${bufToHex(hash)}`
}

export async function comparePassword(
    password: string,
    stored: string
): Promise<boolean> {
    const parts = stored.split(":")
    if (parts.length !== 4 || parts[0] !== "pbkdf2") return false

    const [, iterations, saltHex, hashHex] = parts
    const salt = hexToBuf(saltHex)

    // Re-derive with the same salt and compare
    const derived = await deriveKey(password, salt)
    const derivedHex = bufToHex(derived)

    // Constant-time comparison to prevent timing attacks
    if (derivedHex.length !== hashHex.length) return false
    let diff = 0
    for (let i = 0; i < derivedHex.length; i++) {
        diff |= derivedHex.charCodeAt(i) ^ hashHex.charCodeAt(i)
    }
    return diff === 0
}