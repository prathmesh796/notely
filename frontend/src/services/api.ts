const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8787";

export interface AuthResponse {
    token?: string;
    message?: string;
    error?: string;
}

async function request<T>(path: string, body: object): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const data = await res.json() as T;
    if (!res.ok) {
        throw new Error((data as AuthResponse).error ?? "Request failed");
    }
    return data;
}

export async function loginUser(email: string, password: string): Promise<string> {
    const data = await request<AuthResponse>("/auth/login", { email, password });
    if (!data.token) throw new Error("No token received");
    localStorage.setItem("token", data.token);
    return data.token;
}

export async function registerUser(email: string, password: string): Promise<void> {
    await request<AuthResponse>("/auth/register", { email, password });
}

export function getToken(): string | null {
    return localStorage.getItem("token");
}

export function logout(): void {
    localStorage.removeItem("token");
}
