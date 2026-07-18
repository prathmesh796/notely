import { createHmac, timingSafeEqual } from "node:crypto";
import WebSocket, { WebSocketServer, type RawData } from "ws";

const PORT = Number(process.env.WS_PORT ?? 8080);
const authSecret = process.env.WS_AUTH_SECRET || "supersecretwskey"; // Use a default secret for development

if (!authSecret) {
    throw new Error("WS_AUTH_SECRET must be set before starting the WebSocket server");
}

type JoinToken = { noteId: string; userId: string; exp: number };
type ClientMessage =
    | { type: "join-room"; noteId: string; token: string }
    | { type: "leave-room" }
    | { type: "content"; noteId: string; content: string }
    | { type: "cursor"; noteId: string; position: number };

// A room is created lazily when its first authorized member joins.
const rooms = new Map<string, Set<WebSocket>>();
const clientRoom = new Map<WebSocket, string>();

function send(ws: WebSocket, payload: unknown) {
    if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload));
}

function leaveRoom(ws: WebSocket) {
    const noteId = clientRoom.get(ws);
    if (!noteId) return;

    const room = rooms.get(noteId);
    room?.delete(ws);
    clientRoom.delete(ws);

    if (room?.size === 0) rooms.delete(noteId);
}

function joinRoom(ws: WebSocket, noteId: string) {
    leaveRoom(ws);
    const room = rooms.get(noteId) ?? new Set<WebSocket>();
    room.add(ws);
    rooms.set(noteId, room);
    clientRoom.set(ws, noteId);
}

function broadcast(sender: WebSocket, noteId: string, payload: unknown) {
    for (const client of rooms.get(noteId) ?? []) {
        if (client !== sender) send(client, payload);
    }
}

function decodeJoinToken(token: string): JoinToken | null {
    const [encodedPayload, signature] = token.split(".");

    if (!encodedPayload || !signature || token.split(".").length !== 2) return null;

    const expected = createHmac("sha256", authSecret!).update(encodedPayload).digest("base64url");
    const actualBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);

    if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return null;

    try {
        const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as JoinToken;

        if (!payload.noteId || !payload.userId || !Number.isFinite(payload.exp) || payload.exp <= Date.now()) return null;

        return payload;
    } catch {
        return null;
    }
}

function parseMessage(data: RawData): ClientMessage | null {
    try {
        const message = JSON.parse(data.toString()) as ClientMessage;
        return message && typeof message.type === "string" ? message : null;
    } catch {
        return null;
    }
}

const wss = new WebSocketServer({ port: PORT, maxPayload: 1_000_000 });

wss.on("connection", (ws) => {
    ws.on("message", (data) => {
        const message = parseMessage(data);
        if (!message) return send(ws, { type: "error", message: "Invalid message format" });

        if (message.type === "join-room") {
            const token = decodeJoinToken(message.token);
            if (!token || token.noteId !== message.noteId) {
                send(ws, { type: "error", message: "Not allowed to join this note" });
                return ws.close(1008, "Unauthorized room");
            }

            joinRoom(ws, token.noteId);
            return send(ws, { type: "joined-room", noteId: token.noteId });
        }

        if (message.type === "leave-room") {
            leaveRoom(ws);
            return send(ws, { type: "left-room" });
        }

        const roomId = clientRoom.get(ws);
        if (!roomId) return send(ws, { type: "error", message: "Join a room first" });
        if (message.noteId !== roomId) return send(ws, { type: "error", message: "Invalid room" });

        if (message.type === "content") {
            if (typeof message.content !== "string") return send(ws, { type: "error", message: "Invalid content" });
            return broadcast(ws, roomId, { type: "content", noteId: roomId, content: message.content });
        }

        if (message.type === "cursor" && Number.isInteger(message.position) && message.position >= 0) {
            broadcast(ws, roomId, { type: "cursor", noteId: roomId, position: message.position });
            return;
        }

        send(ws, { type: "error", message: "Unknown command" });
    });

    ws.on("close", () => leaveRoom(ws));
    ws.on("error", () => leaveRoom(ws));
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);
